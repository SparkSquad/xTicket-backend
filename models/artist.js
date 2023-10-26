const { DataTypes, Model } = require('sequelize');

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
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    };

    const options = {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    };

    let model = sequelize.define('artist', fields, options);

    Reflect.defineProperty(model, 'addArtist', {
        value: async function(name, eventId, t) {
            return await this.create({
                name,
                eventId
            }, { transaction: t });
        }
    });

    return model;
}