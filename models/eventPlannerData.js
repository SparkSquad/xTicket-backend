const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    const fields = {
        eventPlannerDataId: {
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
    model.belongsTo(sequelize.models.user, { foreignKey: 'userId' });
    sequelize.models.event.hasOne(model, { foreignKey: 'userId' });

    Reflect.defineProperty(model, 'getByUserId', {
        value: async function (userId) {
            return await this.findOne({
                include: [{
                    model: sequelize.models.user
                }],
                where: {
                    userId 
                }
            });
        }
    });

    return model;
}
