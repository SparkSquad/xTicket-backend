const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    const fields = {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
    
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
    
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }

    const options = {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    };

    let model = sequelize.define('eventPlannerData', fields, options);
    model.belongsTo(sequelize.models.event, { foreignKey: 'eventId' });
    sequelize.models.event.hasMany(model, { foreignKey: 'eventId' });

    Reflect.defineProperty(model, 'getByEventId', {
        value: async function (eventId) {
            return await this.findOne({
                where: {
                    eventId: eventId 
                }
            });
        }
    });

    return model;
}
