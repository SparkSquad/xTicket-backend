const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    const fields = {
        sale_date_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        sale_date : {
            type: DataTypes.DATE,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
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
        max_tickets: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        adults: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        start_time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        end_time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        event_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }

    const options = {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    };

    let model = sequelize.define('sale_date', fields, options);

    Reflect.defineProperty(model, 'getByEventId', {
        value: async function(eventId) {
            return await this.findAll({
                where: {
                    event_id: eventId
                }
            });
        }
    });

    Reflect.defineProperty(model, 'postSaleDate', {
        value: async function(saleDate) {
            return await this.create(saleDate);
        }
    });

    Reflect.defineProperty(model, 'deleteSaleDate', {
        value: async function(saleDateId) {
            return await this.destroy({
                where: {
                    sale_date_id: saleDateId
                }
            });
        }
    });

    Reflect.defineProperty(model, 'SaleDate', {
        value: async function(saleDateId, saleDate) {
            return await this.update(saleDate, {
                where: {
                    sale_date_id: saleDateId
                }
            });
        }
    });


    return model;
}
