import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "300d",
    });
};

// Register a new user
export const registerUser = async (req, res) => {
    const { name, email, phoneNumber, password, confirmPassword } = req.body;

    console.log("Received data:", { name, email, phoneNumber, password, confirmPassword });

    if (!name || !email || !phoneNumber || !password || !confirmPassword) {
        return res.status(400).json({ message: 'Please fill all the fields' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        // Check if the user already exists
        console.log("Checking if user exists...");
        const userExists = await User.findOne({ email });
        
        if (userExists) {
            console.log("User already exists");
            return res.status(400).json({ message: 'User already exists' });
        }

        console.log("Creating a new user...");
        // Create new user
        const newUser = await User.create({
            name,
            email,
            phoneNumber,
            password,
        });

        console.log("User created successfully:", newUser);

        // Return success and JWT token
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            token: generateToken(newUser._id),
        });
    } catch (error) {
        console.error("Error occurred during user registration:", error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// User login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    console.log("Login attempt:", { email, password });

    if (!email || !password) {
        console.log("Please enter both email and password");
        return res.status(400).json({ message: 'Please enter both email and password' });
    }

    try {
        console.log("Finding user by email...");
        // Find user by email
        const user = await User.findOne({ email });

        // if (user) {
        //     console.log("User found, checking password...");
        // }

        if(!user) {
            console.log("User not found");
            return res.status(404).json({ message: 'User not found' });
        } else {
            console.log("User found:", user);
        }

        if (user && (await user.matchPassword(password))) {
            console.log("Password match, generating token...");
            // If user exists and password matches, return user details and token
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                token: generateToken(user._id),

            });
            console.log("Login successful, res sent to client");
        } else {
            console.log("Invalid email or password");
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Error occurred during login:", error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};
