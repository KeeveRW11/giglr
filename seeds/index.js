const seedPost = require('./post-seeds');
const seedUser = require('./user-seeds');

const sequelize = require('../config/connection');
const { Post } = require('../models');

const seedAll = async () => {
    await sequelize.sync({force: true});
    await seedUser();
    await seedPost();

    process.exit(0);
};

seedAll();