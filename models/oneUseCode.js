const { DataTypes, Model } = require('sequelize');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'opcionalsom@gmail.com',
      pass: 'Vegeta13_', 
    },
  });

  module.exports = (sequelize) => {
    const fields = {
        oneUseCodeId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    }

    const options = {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    };
    
  let model = sequelize.define('oneUseCode', fields, options);
    model.belongsTo(sequelize.models.user, { foreignKey: 'userId' });
    sequelize.models.user.hasOne(model, { foreignKey: 'userId' });

  function generateOTUCode(){
    return crypto.randomBytes(4).toString('hex').toUpperCase();
  }

  Reflect.defineProperty(model, 'requestOTUCode', {
    value: async function (email, oTUCode) {
        try {
            const mailOptions = {
                from: 'opcionalsom@gmail.com',
                to: email,
                subject: 'Código de inicio de sesión único',
                text:  `Tu código de inicio de sesión único es: ${codigoOTP}`,
            };
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent succesfully:', info.response);
        } catch (error) {
            console.error('Email could not be sent due to an error:', error.toString());
        }
    }
  });
  }
