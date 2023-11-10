const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    const fields = {
        reportId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }

    const options = {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    };

    let model = sequelize.define('report', fields, options);
    model.belongsTo(sequelize.models.event, { foreignKey: 'eventId' });
    model.belongsTo(sequelize.models.user, { foreignKey: 'userId' });

    Reflect.defineProperty(model, 'getByEventId', {
        value: async function(eventId) {
            return await this.findAll({
                where: {
                    eventId: eventId
                }
            });
        }
    });

    Reflect.defineProperty(model, 'createReport', {
        value: async function( description, eventId, userId) {
            return await this.create({
                description,
                eventId,
                userId
            });
        }
    });

    Reflect.defineProperty(model, 'getReportCountByEventId', {
        value: async function(eventId) {
            const count = await this.count({
                where: {
                    eventId: eventId
                }
            });
            return count;
        }
    });
    

    return model;
}