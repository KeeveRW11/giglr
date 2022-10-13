const router = require('express').Router();
const { response } = require('express');
const { User, Post, Vote, Comment } = require('../../models');

// get all users
router.get('/', (req,res) => {
    res.status(404).end();
    // User.findAll({
    //     attributes: {exclude: ['password']}
    // }) 
    //     .then(dbUserData => res.json(dbUserData))
    //     .catch(err => {
    //         res.status(500).json(err);
    //     });
});

// get one user by id and associated posts etc.
router.get('/:id', (req,res)=>{
    console.log(typeof (req.session.user_id), typeof (req.params.id))
    if (!req.session.loggedIn) {
        res.status(404).end();
        return;
    }
    if (req.params.id ===  req.session.user_id.toString()) {
    User.findOne({
        include: [
            {
                model: Post,
                attributes: ['id','title','post_url','created_at']
            },
            {
                model: Comment,
                attributes: ['id','comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            }],
        
        attributes: {exclude: ['password']},
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData=> {
            if (!dbUserData) {
                res.status(404).json({message: 'No user found with this id'})
                return;
            }
            res.json(dbUserData);
        })
        .catch(err=>{
            res.status(500).json(err);
        })
    } else {
        res.status(404).end();    
    }    
});

//create user
router.post('/', (req,res)=> {
    User.create({
        username: req.body.username,
        password: req.body.password
    })
        .then(dbUserData => {
            req.session.save(()=>{
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true;

                res.json(dbUserData);
            });
        })
        .catch(err => {
            res.status(500).json(err);
        })
});

router.post('/login',(req,res)=>{
    User.findOne({
        where:{
            username: req.body.username
        }
    })
    .then(dbUserData=>{
        if(!dbUserData){
            res.status(400).json({message: 'Invalid credentials!'});
            return;
        }
        const validPassword = dbUserData.checkPassword(req.body.password);
        
        if (!validPassword) {
            res.status(400).json({message: 'Invalid credentials!'});
            return;
        }
        req.session.save(()=>{
            
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({user: dbUserData, message: 'You are now logged in!'})
        })
    })
})

//PUT /api/users/1 THINK update
router.put('/:id', (req,res)=>{
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if(!dbUserData[0]) { 
                res.status(404)
            }
            res.json(dbUserData);
        })
        .catch(err=>{
            res.status(500).json(err);
        })
});

//DELETE /api/users/1 THINK delete
router.delete('/:id', (req,res)=>{
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'No user found with this id'})
            }
            res.json(dbUserData);
        })
        .catch(err => {
            res.status(500).json(err)
        })
});

//DESTROY SESSION
router.post('/logout', (req,res)=>{
    if(req.session.loggedIn) {
        req.session.destroy(()=>{
            res.status(204).end();
        })
    }
    else {
        res.status(404).end();
    }
})

module.exports = router;
