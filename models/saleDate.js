const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    const fields = {
        saleDateId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        saleDate : {
            type: DataTypes.DATE,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tickets: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        maxTickets: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        adults: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        startTime: {
            type: DataTypes.TIME,
            allowNull: false
        },
        endTime: {
            type: DataTypes.TIME,
            allowNull: false
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }

    const options = {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    };

    let model = sequelize.define('saleDate', fields, options);
    model.belongsTo(sequelize.models.event, { foreignKey: 'eventId' });

    Reflect.defineProperty(model, 'getByEventId', {
        value: async function(eventId) {
            return await this.findAll({
                where: {
                    eventId: eventId
                }
            });
        }
    });

    Reflect.defineProperty(model, 'createSaleDate', {
        value: async function(saleDate) {
            return await this.create(saleDate);
        }
    });

    Reflect.defineProperty(model, 'updateSaleDate', {
        value: async function(saleDateId, saleDate) {
            return await this.update(saleDate, {
                where: {
                    saleDateId: saleDateId
                }
            });
        }
    });

    Reflect.defineProperty(model, 'deleteSaleDate', {
        value: async function(saleDateId) {
            return await this.destroy({
                where: {
                    saleDateId: saleDateId
                }
            });
        }
    });

    Reflect.defineProperty(model, 'getTicketsByEventId', {
        value: async function(saleDateId) {
            const saleDateRecord = await this.findOne({
                where: {
                    saleDateId: saleDateId
                }
            });

            if (saleDateRecord) {
                return saleDateRecord.tickets;
            } else {
                return null;
            }
        }
    });

    return model;
}
