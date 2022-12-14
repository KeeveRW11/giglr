const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/',  (req,res)=>{
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes:[
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal(`(SELECT COUNT (*) FROM vote WHERE post.id = vote.post_id)`), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData=>{
            if(!dbPostData){
                res.status(404).json({message: 'No post found with this id'});
                return;
            }
            //serialize data before passing to template
            const posts = dbPostData.map(post => post.get({plain:true})); 
            res.render('upload', {posts, loggedIn: req.session.loggedIn, dashboard:true})
        })
        .catch(err=>{
            res.status(500).json(err);
        })   
})

module.exports = router