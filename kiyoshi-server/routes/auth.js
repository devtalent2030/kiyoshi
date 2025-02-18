const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Customer } = require(`${process.env.MODELS_PATH}`); // Use MODELS_PATH for importing models

const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Fetch the user with explicit inclusion of the 'Role' field
        const user = await Customer.findOne({
            where: { EmailAddress: email },
            attributes: ['id', 'EmailAddress', 'Password', 'Role'], // Include Role here
        });

        if (!user) {
            console.error('User not found for email:', email);
            return res.status(404).json({ message: 'User not found' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) {
            console.error('Invalid credentials for email:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token without expiration
        const tokenPayload = { id: user.id, email: user.EmailAddress, role: user.Role };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET); // No expiration set

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

// Signup Route
router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await Customer.create({
            FirstName: firstName,
            LastName: lastName,
            EmailAddress: email,
            Password: hashedPassword,
            Role: 'customer', // Default role for new users
        });

        // Generate token without expiration
        const tokenPayload = { id: newUser.id, email: newUser.EmailAddress, role: newUser.Role };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET); // No expiration set

        console.log('Signup successful:', tokenPayload);

        res.status(201).json({
            token,
            user: { id: newUser.id, email: newUser.EmailAddress, role: newUser.Role },
        });
    } catch (err) {
        console.error('Error during signup process:', err);
        res.status(500).json({ message: 'Error signing up', error: err.message });
    }
});


module.exports = router;
