const { Post } = require('../models');

const postData = [
    {
        title: 'BryPost1',
        post_url: 'https://via.placeholder.com/500',
        user_id: 1
    },
    {
        title: 'BryPost2',
        post_url: 'https://via.placeholder.com/500',
        user_id: 1
    },{
        title: 'BryPost3',
        post_url: 'https://via.placeholder.com/500',
        user_id: 1
    },
    {
        title: 'ShawnPost1',
        post_url: 'https://via.placeholder.com/500',
        user_id: 2
    },
    {
        title: 'ShawnPost2',
        post_url: 'https://via.placeholder.com/500',
        user_id: 2
    },
    {
        title: 'ShawnPost3',
        post_url: 'https://via.placeholder.com/500',
        user_id: 2
    },
    {
        title: 'KeevePost1',
        post_url: 'https://via.placeholder.com/500',
        user_id: 3
    },
    {
        title: 'KeevePost2',
        post_url: 'https://via.placeholder.com/500',
        user_id: 3
    },
    {
        title: 'KeevePost3',
        post_url: 'https://via.placeholder.com/500',
        user_id: 3
    }
]

const seedPost = () => {
    Post.bulkCreate(postData)
}

module.exports = seedPost;