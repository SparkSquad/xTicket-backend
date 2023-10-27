const { DataTypes, Model } = require('sequelize');
const crypto = require('crypto');

module.exports = (sequelize) => {
    const fields = {
        ticketId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        uuid: {
            type: DataTypes.UUID,
            allowNull: false
        },
        purchaseDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        saleDateId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }

    const options = {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    };

    let model = sequelize.define('ticket', fields, options);
    model.belongsTo(sequelize.models.saleDate, { foreignKey: 'saleDateId' });

    Reflect.defineProperty(model, 'addTicket', {
        value: async function(purchaseDate, price, saleDateId, t) {
            return await this.create({
                uuid: crypto.randomUUID(),
                purchaseDate,
                price,
                saleDateId
            }, { transaction: t });
        }
    });
}