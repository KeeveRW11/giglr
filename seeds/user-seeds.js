const { User }= require('../models')

const userData = [
    {
        username: 'BryanTest',
        password: 'BryanPass'
    },
    {
        username: 'ShawnTest',
        password: 'ShawnPass'
    },
    {
        username: 'KeeveTest',
        password: 'KeevePass'
    }
]

const seedUser = () => User.bulkCreate(userData);

module.exports = seedUser;