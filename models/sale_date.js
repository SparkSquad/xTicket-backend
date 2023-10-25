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

    return model;
}
