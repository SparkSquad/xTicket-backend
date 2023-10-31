const { DataTypes, Model, Op } = require('sequelize');

let genres = [
    "Rock",
    "Pop",
    "Hip-Hop/Rap",
    "Música Electrónica",
    "Pop/Rock Latino",
    "Música Country",
    "R&B/Soul",
    "Reggae",
    "Metal",
    "Jazz",
    "Blues",
    "Folk",
    "Indie",
    "Clásica",
    "Reguetón"
];

module.exports = (sequelize) => {
    const fields = {
        eventId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        genre: {
            type: DataTypes.ENUM(...genres),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(250),
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    };

    const options = {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    };

    let model = sequelize.define('event', fields, options);

    Reflect.defineProperty(model, 'createEvent', {
        value: async function(name, genre, description, location, userId, t) {
            return await this.create({
                name,
                genre,
                description,
                location,
                userId
            }, { transaction: t });
        }
    });

    Reflect.defineProperty(model, 'getAllUserEvents', {
        value: async function(userId) {
            return await this.findAll({
                where: {
                    userId
                }
            });
        }
    });

    Reflect.defineProperty(model, 'getGenres', {
        value: async function() {
            return genres;
        }
    });

    Reflect.defineProperty(model, 'getById', {
        value: async function(eventId) {
            return await this.findOne({
                where: {
                    eventId
                }
            });
        }
    });

    Reflect.defineProperty(model, 'search', {
        value: async function(query, genre, limit, page) {
            if(isNaN(limit) || isNaN(page)) {
                throw new Error('Invalid limit or page');
            }
            limit = parseInt(limit);
            query = query || '';

            if(genre !== '' && genre !== null) {
                if(genres.indexOf(genre) === -1) {
                    throw new Error('Invalid genre');
                }
            }
            else {
                genre = '';
            }

            try {
                let offset = (parseInt(page) - 1) * limit;
                let results = await this.findAll({
                    subQuery: false,
                    include: [
                        {model: sequelize.models.artist, as: 'artists'},
                        {model: sequelize.models.saleDate, as: 'saleDates'}
                    ],
                    where: {
                        [Op.or]: [
                            {
                                name: {
                                    [Op.like]: `%${query}%`
                                }
                            },
                            {
                                '$artists.name$': {
                                    [Op.like]: `%${query}%`
                                }
                            }
                        ],
                        genre: {
                            [Op.like]: `%${genre}%`
                        }
                    },
                    limit,
                    offset
                });
                let totalElems = await this.count({
                    where: {
                        name: {
                            [Op.like]: `%${query}%`
                        },
                    }
                });
                return {
                    results,
                    page,
                    totalElems
                };
            }
            catch(error) {
                throw new Error('Unable to search events');
            }
        }
    });

    return model;
};
