const router = require('express').Router();
const { Comment } = require('../../models');



//get all comments
router.get('/', (req,res) => {
    Comment.findAll(
        {
            attributes: [
                'id',
                'comment_text',
                'post_id',
                'user_id'
            ]
        }
    )
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err=>{
            console.log(err);
            res.status(400).json(err);
        })
})

//get one comment
router.get('/:id', (req,res) => {
    Comment.findOne(
        {where: {
            id:req.params.id
            }
        },
        {
            attributes: [
                'id',
                'comment_text',
                'post_id',
                'user_id'
            ]
        }
    )
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err=>{
            console.log(err);
            res.status(400).json(err);
        })
})

//post comment
router.post('/', (req,res) => {
    if(req.session){
        Comment.create(
            {
                comment_text: req.body.comment_text,
                //user_id: req.body.user_id, for testing under insomnia
                user_id: req.session.user_id, //takes user id from session (user that is currently logged in)
                post_id: req.body.post_id
            }
        )
            .then(dbCommentData => res.json(dbCommentData))
            .catch(err=>{
                console.log(err);
                res.status(400).json(err);
            })
    }
})

//update commment
router.put('/:id', (req,res)=>{
    Comment.update(
        {
        comment_text: req.body.comment_text
        },
        {where: {
            id:req.params.id
            }
        }
    )
        .then(updatedCommentsData => {
            if(!updatedCommentsData){
                res.status(404).json({error: 'No comment found with this id'})
                return;
            }
            res.json(updatedCommentsData)
        })
        .catch(err=>{
            console.log(err);
            res.status(400).json(err);
        })
})

//delete comment
router.delete('/:id', (req,res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        },
    })
        .then(deletedCommentData => {
            if (!deletedCommentData) {
                res.status(404).json({error: 'No comment found with this id'});
                return;
            }
            res.json(deletedCommentData)
        })
        .catch(err=>{
            console.log(err);
            res.status(400).json(err);
        })
})

module.exports = router;