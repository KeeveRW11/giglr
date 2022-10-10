const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/',  (req,res)=>{
    Post.findAll({
        where: {
            //use the ID from the session
            user_id: 1//req.session.user_id
        },
        attributes:[
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal(`(SELECT COUNT (*) FROM vote WHERE post.id = vote.post_id)`), 'vote_count']
             //[sequelize.literal('(SELECT COUNT (*) FROM downvote WHERE post.id=downvote.post_id)'), 'downvote_count]?
             //how to pull image/file; cloudinary
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
            res.render('dashboard', {posts, loggedIn: req.session.loggedIn, dashboard:true})
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json(err);
        })   
})

module.exports = router