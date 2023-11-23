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
    sequelize.models.event.hasMany(model, { foreignKey: 'eventId' });

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
        value: async function(saleDateId, upSaleDate) {
            const result = await this.update({
                saleDate: upSaleDate.saleDate,
                price: upSaleDate.price,
                tickets: upSaleDate.tickets,
                maxTickets: upSaleDate.maxTickets,
                adults: upSaleDate.adults,
                startTime: upSaleDate.startTime,
                endTime: upSaleDate.endTime,
                eventId: upSaleDate.eventId
            }, {
                where: {
                    saleDateId: saleDateId
                }
            });
            return result;
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

    Reflect.defineProperty(model, 'getById', {
        value:  async function (dateId) {
            return await this.findOne({
                where: {
                    saleDateId: dateId
                }
            });
        }
    });

    Reflect.defineProperty(model, 'getTicketsByEventId', {
        value:  async function (saleDateId) {
            return await this.sum('tickets', {
                where: {
                    saleDateId: saleDateId
                }
            });
        }
    });
    
    return model;
}
