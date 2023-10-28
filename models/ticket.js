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
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }

    const options = {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    };

    let model = sequelize.define('ticket', fields, options);
    model.belongsTo(sequelize.models.saleDate, { foreignKey: 'saleDateId' });
    model.belongsTo(sequelize.models.user, { foreignKey: 'userId' });

    Reflect.defineProperty(model, 'addTicket', {
        value: async function(purchaseDate, price, saleDateId, userId, t) {
            return await this.create({
                uuid: crypto.randomUUID(),
                purchaseDate,
                price,
                saleDateId,
                userId
            }, { transaction: t });
        }
    });

    Reflect.defineProperty(model, 'getByUserId', {
        value: async function(userId) {
            return await this.findAll({
                where: {
                    userId: userId
                }
            });
        }
    });

    Reflect.defineProperty(model, 'deleteTicket', {
        value: async function(ticketId) {
            return await this.destroy({
                where: {
                    ticketId: ticketId
                }
            });
        }
    });

    Reflect.defineProperty(model, 'getByUuid', {
        value: async function(uuid) {
            return await this.findOne({
                where: {
                    uuid: uuid
                }
            });
        }
    });
}