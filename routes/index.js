const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
let SignupModel = require('../models/User.model')


/* GET home page */
router.get('/', (req, res, next) => res.render('index.hbs'));

//Sign up route
router.get('/signup', (req, res, next) => {
    res.render('signup.hbs')
    console.log(req.body)
})
//Sign in route
router.get('/signin', (req, res, next) => {
    res.render('signin.hbs')
})
//Signup POST request
router.post('/signup', (req, res, next) => {
    const { username, password } = req.body
    
    //username Validation
    if (!username || !password) {
        res.render('signup.hbs', { msg: 'You have not entered all fields' })
        return;
    }
    //Email Format
    // let emRegex = /\S+@\s+\.\S+/;
    
    // if (!emRegex.test(email)) {
    //     res.render('signup', { msg: 'Your email is not in the right format' })
    //     return;
    // }
    // //Password Validation
    // let passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    // if (!passRegex.text(password)) {
    //     res.render('singup', { msg: 'Password\: Should contain at least 8 character, one Upper&Lower case and two digits' })
    //     return;
    // }
    //Password Encryption
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    
    SignupModel.create({ username, password: hash })
        .then(() => {
            res.redirect('/signin')
        })
        .catch((err) => {
            next(err)
        })
})
//Sign in POST request
router.post('/signin', (req, res, next) => {
    const { username, password } = req.body;
    let salt = bcrypt.genSaltSync(10)
    let hash = bcrypt.hashSync(password, salt);
    SignupModel.findOne({ username: username })
        .then((result) => {
            if (result) {
                bcrypt.compare(password, result.password)
                    .then((isMatch) => {
                        if (isMatch) {
                            req.session.loggedInUser = result
                            res.redirect('/profile')
                        }
                        else {
                            res.render('signin.hbs', {msg: 'Password does not match'})
                        }
                    })
            }
            else {
                res.render('signin.hbs', {msg: 'Username does not exist'})
            }
        })
        .catch((err) => {
            next(err)
        })
})
//Handling the Profile page
const checkLoggIn = (req, res, next) => {
 if (req.session.loggedInUser) {
    next()
 }
 else {
    res.redirect('/signin')
 }
}

router.get('/profile', checkLoggIn, (req, res, next) => {
    let username = req.session.loggedInUser.username
    res.render('profile.hbs', {username})
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

router.get('/main', checkLoggIn, (req, res, next) => {
    let username = req.session.loggedInUser.username;
    res.render('main.hbs', {username})
})
router.get("/private", checkLoggIn, (req, res, next) => {
  let username = req.session.loggedInUser.username;
  res.render("private.hbs", { username });
});
router.get("/logout", checkLoggIn, (req, res, next) => {
    req.session.destroy()
    res.redirect('/')
});


module.exports = router;
