const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getUser = (req, res) => {
    res.send('You fetched a user!');
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (isPasswordCorrect) {
            const token = jwt.sign({ email }, 'secret', { expiresIn: '1h' });
            return res.send(token);
        } else {
            return res.send(`Password does not match email ${email}`);
        }
    } else {
        return res.send(`This email ${email} does not exist`);
    }
}


exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).send(`An account with the email ${email} already exists`);
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });
        const result = await user.save();
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1h' });
        res.send(token);

    } catch (err) {
        res.status(500).send(err);
    }
}