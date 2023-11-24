const { on } = require('nodemailer/lib/xoauth2');
const { DataTypes, Model } = require('sequelize');


module.exports = (sequelize) => {
    const fields = {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
    
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
    
        surnames: {
            type: DataTypes.STRING,
            allowNull: false
        },
    
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
    
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [64, 64]
            }
        },
        disabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    
        type: {
            type: DataTypes.ENUM('admin', 'assistant', 'eventPlanner', 'ticketTaker'),
            allowNull: false
        }
    }

    const options = {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    };

    let model = sequelize.define('user', fields, options);

    Reflect.defineProperty(model, 'getByEmail', {
        value: async function(email) {
            return await this.findOne({
                where: {
                    email: email
                }
            });
        }
    });
    Reflect.defineProperty(model, 'postUser', {
        value: async function (name, surnames, email, password, type, t) {
            return await this.create({
                name,
                surnames,
                email,
                password,
                type
            }, { transaction: t });
            
        }
    })

    Reflect.defineProperty(model, 'updateUser', {
        value: async function (userId, name, surnames, email, passwordHash, disabled,t) {

            const userAccount = await this.findOne({
                where: {
                    userId: userId
                }
            }, { transaction: t });

            userAccount.name = name;
            userAccount.surnames = surnames;
            userAccount.email = email;
            userAccount.disabled = disabled;
            if(passwordHash != null) {
                userAccount.password = passwordHash;
            }
            
            await userAccount.save({ transaction: t });

            return userAccount;
        }
    })

    Reflect.defineProperty(model, 'search', {
        value: async function(query, limit, page) {
            if(isNaN(limit) || isNaN(page)) {
                throw new Error('Invalid limit or page');
            }
            limit = parseInt(limit);
            query = query || '';

            try {
                let offset = (parseInt(page) - 1) * limit;
                let results = await this.findAll({
                    subQuery: false,
                    include: [
                        {model: sequelize.models.eventPlannerData, as: 'eventPlannerData'}
                    ],
                    where: {
                        [Op.or]: [
                            {
                                name: {
                                    [Op.like]: `%${query}%`
                                }
                            },
                            {
                                surnames: {
                                    [Op.like]: `%${query}%`
                                }
                            }
                        ],
                        type: "eventPlanner"
                    },
                    limit,
                    offset
                });
                let totalElems = await this.count({
                    where: {
                        [Op.or]: [
                            {
                                name: {
                                    [Op.like]: `%${query}%`
                                }
                            },
                            {
                                surnames: {
                                    [Op.like]: `%${query}%`
                                }
                            }
                        ],
                        type: "eventPlanner"
                    }
                });
                return {
                    results,
                    page,
                    totalElems
                };
            }
            catch(error) {
                console.log(error);
                throw new Error('Unable to search event planner');
            }
        }
    });



    return model;
}
