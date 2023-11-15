const { Sequelize, DataTypes, Model } = require('sequelize');

/**
 * @param {Sequelize} sequelize 
 */
module.exports = (sequelize) => {
    const fields = {
        artistId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    };

    const options = {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    };

    let model = sequelize.define('artist', fields, options);
    sequelize.models.event.hasMany(model, { foreignKey: 'eventId' });
    model.belongsTo(sequelize.models.event, { foreignKey: 'eventId' });

    Reflect.defineProperty(model, 'addArtist', {
        value: async function(name, eventId, t) {
            return await this.create({
                name,
                eventId
            }, { transaction: t });
        }
    });

    Reflect.defineProperty(model, 'deleteAllArtists', {
        value: async function(eventId, t) {
            return await this.destroy ({
                where: {
                    eventId
                }
            }, { transaction: t });
        }
    });

    return model;
}