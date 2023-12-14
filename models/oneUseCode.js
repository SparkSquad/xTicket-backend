const { DataTypes, Model, ConnectionRefusedError } = require('sequelize');

  module.exports = (sequelize) => {
    const fields = {
        oneUseCodeId: {
            type: DataTypes.STRING,
            primaryKey: true,
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

    Reflect.defineProperty(model, 'registerOTUCode', {
      value: async function (oneUseCodeId, userId) {
          return await this.create({
              oneUseCodeId,
              userId
          });
      }
    });

    Reflect.defineProperty(model, 'validateUserCode', {
      value: async function (oneUseCodeId, userId) {
          return await this.findOne({
              where: {
                  oneUseCodeId: oneUseCodeId,
                  userId: userId
              }
          });
      }
    });
    
  return model;
}
