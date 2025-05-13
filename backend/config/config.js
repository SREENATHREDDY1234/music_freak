require('dotenv').config();

module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    MONGO_URI: process.env.MONGO_URI || 'your_mongodb_connection_string'
};