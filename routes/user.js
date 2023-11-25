const { Router } = require("express");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { events, artists, sequelize, eventFollows, users, oneUseCodes} = require("../models");

const router = Router();

router.get('/searchEventPlanner/:query?', async (req, res) => {
    const { query } = req.params;
    let { limit, page } = req.query;

    try {
        const searchResult = await users.search(query, limit, page);
        return res.status(200).json(searchResult);
    }
    catch(e) {
        return res.status(400).json({
            message: e.message
        });
    }
});

router.get('/eventFollows/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await eventFollows.getFollowedEvent(userId);
        return res.status(200).json(result);
    }
    catch(e) {
        return res.status(400).json({
            message: e.message
        });
    }
});

router.post('/eventFollow/:userId', async (req, res) => {
    const { userId } = req.params;
    const { eventId } = req.body;

    try {
        const result = await eventFollows.create({
            userId,
            eventId
        });

        return res.status(200);
    }
    catch(e) {
        return res.status(400).json({
            message: e.message
        })
    }
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
      user: 'opcionalsom@gmail.com',
      pass: 'Vegeta13_', 
    },
  });
  function generateOTUCode(){
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    return code;
  }

/*router.post('/requestOTUCode', async (req, res) => {
    const { email } = req.body;
    try {
        const codigoOTP = generateOTUCode();
        const mailOptions = {
            from: 'opcionalsom@gmail.com',
            to: email,
            subject: 'Código de inicio de sesión único',
            text:  `Tu código de inicio de sesión único es: ${codigoOTP}`,
        };
        transporter.sendMail(mailOptions, async function(error, info){
            if (error) {
              console.log(error);
              return res.status(400).json({
                code: -1
            });
            } else {
                console.log('Correo electrónico enviado: ' + info.response);
                const userId = await users.getByEmail(email);
                const code = await oneUseCodes.registerOTUCode(email, userId);

                return res.status(200).json({
                    code
                });
            }
          });
    }
    catch(e) {
        console.log(e);
        return res.status(400).json({
            code: -1
        });
    }
})*/

router.post('/requestOTUCode', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await users.getByEmail(email);

        if(user == null) {
            return res.status(400).json({
                oneUseCodeId: "",
                userId: -1
            });
        }

        const utcCode = generateOTUCode();
        const code = await oneUseCodes.registerOTUCode(utcCode, user.userId);

        if (code == null) {
            return res.status(400).json({
                oneUseCodeId: "",
                userId: -1
            });
        }

        return res.status(200).json({
            oneUseCodeId: code.oneUseCodeId,
            userId: code.userId
        });
    }
    catch(e) {
        console.log(e);
        return res.status(400).json({
            oneUseCodeId: "",
            userId: -1
        });
    }
})



module.exports = router;
