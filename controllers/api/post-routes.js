const router = require('express').Router();
const {Post, User, Vote, Comment} = require('../../models');
const { route } = require('./user-routes');
const sequelize = require('../../config/connection');
// const withAuth = require('../../utils/auth');

const withAuth = (req,res,next) => {
    if (!req.session.user_id) {
        res.redirect('/login');
    } else {
        next();
    }
};

//get all posts
router.get('/', (req,res)=> {
    Post.findAll({
        attributes: ['id','post_url','title','created_at', [sequelize.literal('(SELECT COUNT (*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
        order:[['created_at','DESC']],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model:User,
                    attributes:['username']
                }
            },
            {
                model:User,
                attributes:['username']
            }
        ]
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err=>{
            console.log(err);
            res.status(500).json(err);
        })
})

//get a single post
router.get('/:id', (req,res)=> {
    Post.findOne({
        where: {
            id: req.params.id
        },
        //Query configuration
        attributes: ['id','post_url','title','created_at',[sequelize.literal('(SELECT COUNT (*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
        include: [
            {
                model:User,
                attributes:['username']
            }
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({message: "No post found with this id"});
                return;
            }
            res.json(dbPostData);
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json(err);
        })
})

router.post('/', (req,res)=>{
    //expects {title: 'Taskmaster goes public!', post_url: 'https://taskmater.com/press', user_id: 1}
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id:req.session.user_id
    })
        .then(dbPostData=> res.json(dbPostData))
        .catch(err=>{
            console.log(err);
            res.status(500).json(err);
        })
})

//PUT /api/posts/upvote
router.put('/upvote', (req,res)=>{
    
    if (req.session) {
        //pass session id along with all destructured properties on req.body
        Post.upvote({...req.body, user_id: req.session.user_id}, {Vote, Comment, User})
        .then(updatedVoteData => res.json(updatedVoteData))
        .catch(err=>{
            console.log(err);
            res.status(500).json(err);
        });
    }
    
})
//TODO: check with group if we want to go for a downvote static in Post model
router.put('/downvote', (req,res) => {

    if (req.session) {
        Post.downvote({...req.body, user_id: req.session.user_id}, {Vote, Comment, User})
        .then(updatedVoteData => res.json(updatedVoteData))
        .catch(err=>{
            console.log(err);
            res.status(500).json(err)
        })
    }
})

router.put('/:id', (req,res)=>{
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(dbPostData=>{
            if(!dbPostData){
                res.status(404).json({error: 'No post found with this id'})
                return;
            }
            res.json(dbPostData)
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json(err);
        })
})

router.delete('/:id', withAuth, (req,res)=>{
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbPostData=>{
            if (!dbPostData){
                res.status(404).json({message: 'No post found with this id!'})
                return;
            }
            res.json(dbPostData)
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json(err);
        })
})

module.exports = router;