module.exports = {
    port: process.env.PORT || 3000,
    debug: process.env.NODE_ENV == "development" || false,
    logLevel: process.env.NODE_ENV == "development" ? "info" : "warn",
    database: {
        prod: {
            dialect: "mariadb",
            host: process.env.DB_PROD_HOST || "localhost",
            port: process.env.DB_PROD_PORT || 3306,
            name: process.env.DB_PROD_NAME || "xticket",
            user: process.env.DB_PROD_USER || "xticket",
            password: process.env.DB_PROD_PASSWORD || ""
        },
        dev: {
            dialect: "mariadb",
            host: process.env.DB_DEV_HOST || "localhost",
            port: process.env.DB_DEV_PORT || 3306,
            name: process.env.DB_DEV_NAME || "xticket-dev",
            user: process.env.DB_DEV_USER || "xticket",
            password: process.env.DB_DEV_PASSWORD || ""
        },
    },
    webTokenSecret: process.env.WEB_TOKEN_SECRET || "secret",
    tokenExpirationTime: process.env.TOKEN_EXPIRATION_TIME || 3600,
}
