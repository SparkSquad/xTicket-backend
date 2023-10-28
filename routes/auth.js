const { Router } = require('express');
const { users, sequelize } = require('../models');
const { calculateSHA256Hash, generateJsonWebToken } = require('../utils/crypto');
const { tokenExpirationTime } = require('../config');

const router = Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await users.getByEmail(email);

    if(!user || await calculateSHA256Hash(password) != user.password) {
        return res.status(401).json({
            message: 'Invalid credentials'
        });
    }

    const token = generateJsonWebToken(user.email);
    
    return res.status(200).json({
        message: 'Login successful',
        token,
        expires: new Date(Date.now() + tokenExpirationTime).toString(),
        user: {
            name: user.name,
            surnames: user.surnames,
            email: user.email,
            type: user.type
        }
    });
});


router.post("/signup", async (req, res) => {
    const { name, surnames, email, password, type } = req.body;
    const t = await sequelize.transaction();
    console.log(req.body)
   try {
        const user = await users.postUser(
            name, 
            surnames, 
            email, 
            await calculateSHA256Hash(password), 
            type,
            t
        );
        console.error(user)

        await t.commit();

        return res.status(200).json({
            message: "User created"
        });
        
    } catch (error) {
        console.error("Unable to create user: " + error);
        await t.rollback();

        return res.status(500).json({
            message: "Unable to create usert",
        });
    }
});

module.exports = router;
