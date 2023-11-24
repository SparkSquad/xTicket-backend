const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    const fields = {
        eventFollowId: {
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

    let model = sequelize.define('eventFollow', fields, options);

    model.belongsTo(sequelize.models.user, { foreignKey: 'userId' });
    sequelize.models.user.hasMany(model, { foreignKey: 'userId' });

    model.belongsTo(sequelize.models.event, { foreignKey: 'eventId' });
    sequelize.models.event.hasMany(model, { foreignKey: 'eventId' });

    Reflect.defineProperty(model, 'getFollowedEvent', {
        value: async function(userId) {
            return await this.findAll({
                where: {
                    userId
                }
            });
        }
    });

    return model;
}