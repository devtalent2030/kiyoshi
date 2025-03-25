const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Customer } = require(`${process.env.MODELS_PATH}`);

const router = express.Router();

// Login Route (unchanged)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Customer.findOne({
            where: { EmailAddress: email },
            attributes: ['id', 'EmailAddress', 'Password', 'Role'],
        });

        if (!user) {
            console.error('User not found for email:', email);
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) {
            console.error('Invalid credentials for email:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const tokenPayload = { id: user.id, email: user.EmailAddress, role: user.Role };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);

        console.log('Login successful:', tokenPayload);

        res.json({
            token,
            user: { id: user.id, email: user.EmailAddress, role: user.Role },
        });
    } catch (err) {
        console.error('Error during login process:', err);
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
});

// Signup Route (with debugging)
router.post('/signup', async (req, res) => {
    console.log('Signup request body:', req.body); // Log incoming data
    const { firstName, lastName, email, password } = req.body;
    try {
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword); // Log hash

        const newUser = await Customer.create({
            firstName,
            lastName,
            EmailAddress: email,
            Password: hashedPassword,
            Role: 'customer'
        });
        console.log('New user created:', newUser.toJSON()); // Log created user

        const tokenPayload = { id: newUser.id, email: newUser.EmailAddress, role: newUser.Role };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);

        console.log('Signup successful:', tokenPayload);

        res.status(201).json({
            token,
            user: { id: newUser.id, email: newUser.EmailAddress, role: newUser.Role },
        });
    } catch (err) {
        console.error('Signup error:', err.name, err.message, err.stack); // Detailed error log
        res.status(500).json({ message: 'Signup failed', error: err.message });
    }
});

module.exports = router;