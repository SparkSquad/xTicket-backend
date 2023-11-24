const { Router } = require('express');
const { users, sequelize } = require('../models');
const { calculateSHA256Hash, generateJsonWebToken } = require('../utils/crypto');
const { tokenExpirationTime } = require('../config');
const oneUseCode = require('../models/oneUseCode');

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
            userId: user.userId,
            name: user.name,
            surnames: user.surnames,
            email: user.email,
            type: user.type
        }
    });
});

router.post('/codeLogin', async (req, res) => {
    const { code } = req.body;
    const oneUC = await oneUseCode.findByPk(code);

    if(!oneUC) {
        return res.status(401).json({
            message: 'Invalid code'
        });
    }

    const user = await users.getById(oneUC.userId);

    if(!user) {
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
            userId: user.userId,
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

        await t.commit();

        return res.status(200).json({
            message: "User created"
        });
        
    } catch (error) {
        await t.rollback();

        return res.status(500).json({
            message: "Unable to create usert",
        });
    }
});

router.put("/update", async (req, res) => {
    const { userId, name, surnames, email, password, disabled } = req.body;
    const t = await sequelize.transaction();

    try {
        let passwordHash = await calculateSHA256Hash(password);

        if(password == null || password == "") {
            passwordHash = null;
        }

        await users.updateUser(
            userId,
            name,
            surnames,
            email,
            passwordHash,
            disabled,
            t
        );

        await t.commit();

        return res.status(200).json({
            code: 1
        });
    } catch (error) {
        await t.rollback();

        return res.status(500).json({
            code: -1
        });
    }
});

module.exports = router;
