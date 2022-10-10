const router = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models');

// get all users
router.get('/', (req,res) => {
    User.findAll({
        attributes: {exclude: ['password']} //all attributes excluding password
    }) 
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// get one user by id and associated posts etc.
router.get('/:id', (req,res)=>{
    User.findOne({
        //TODO: figure out what we need to include from other tables Post, Comments, Post through Vote
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

        
        //     {
        //         model: Post,
        //         attributes: ['title'],
        //         through: Vote,
        //         as: 'voted_posts'
        //     }
        // ],

         //     {
        //         model: Post,
        //         attributes: ['title'],
        //         through: Downvote,
        //         as: 'downvoted_posts'
        //     }
        // ],
        
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
            console.log(err);
            res.status(500).json(err);
        })
});

//create user
router.post('/', (req,res)=> {
    //expects {username: 'string', email: '<string>@<string>.<string>', password: 'string'}
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
            console.log(err);
            res.status(500).json(err);
        })
});

router.post('/login',(req,res)=>{
    //Query operation
    User.findOne({
        where:{
            username: req.body.username
        }
    })
    .then(dbUserData=>{
        console.log(dbUserData)
        if(!dbUserData){
            res.status(400).json({message: 'No user with that username!'});
            return;
        }

        //Verify user
        const validPassword = dbUserData.checkPassword(req.body.password);
        
        if (!validPassword) {
            res.status(400).json({message: 'Incorrect password!'});
            return;
        }

        //sessions
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
            console.log(err);
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
            console.log(err);
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
