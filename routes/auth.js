const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');


// Register
router.post('/register', async (req, res) => {
    // Lets validate
    const {error} = await registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Checking if the is already in the database
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).send('Email already exist');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.json({user: user._id});
    }catch (err){
        res.status(400).send(err);
    }
});


// Login
router.post('/login', async (req, res) => {
    // Lets validate
    const {error} = await loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Checking if the email exists
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Email not found');

    // Password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password');

    res.send('Logged in!');
})

module.exports = router;