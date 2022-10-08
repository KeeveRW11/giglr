const seedPost = require('./post-seeds');
const seedUser = require('./user-seeds');

const sequelize = require('../config/connection');


const seedAll = async () => {
    await sequelize.sync({force: true});
    await seedUser();
    seedPost();

    
};

seedAll();

//npm run seed then ctrl+c -> y to stop; automated process.exit seem to skip seedPost even with await in front.