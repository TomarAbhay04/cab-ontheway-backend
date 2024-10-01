import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const serviceSid = process.env.TWILIO_SERVICE_ID;

    // Ensure these variables are correctly being loaded
if (!accountSid || !authToken || !serviceSid) {
    throw new Error('Twilio credentials are missing in environment variables');
}

    const client = twilio(accountSid, authToken);

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "300d",
    });
};



// Send OTP to user's phone number
export const sendOTP = async (req, res) => {
    const { phoneNumber } = req.body;
  
    try {
      const indianPhoneRegex = /^(\+91)?[6-9]\d{9}$/; // Validate phone number for India
      if (!indianPhoneRegex.test(phoneNumber)) {
        return res.status(400).json({ success: false, message: 'Invalid phone number. Please enter a valid Indian phone number.' });
      }
  
      const formattedPhoneNumber = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
  
      // Send OTP using Twilio Verify service
      const verification = await client.verify.v2.services(serviceSid)
        .verifications
        .create({ to: formattedPhoneNumber, channel: 'sms' });
  
      console.log('Verification response:', verification);  // Log the verification response
  
      // Respond based on the result from Twilio
      res.status(200).json({ success: true, message: 'OTP sent successfully!', verification });
      
    } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ success: false, message: 'Error sending OTP', error: error.message });
    }
  };
  


  export const verifyOTPAndRegister = async (req, res) => {
    const { name, email, phoneNumber, password, confirmPassword, otp } = req.body;

    console.log("Received data:", { name, email, phoneNumber, password, confirmPassword, otp });

    if (!name || !email || !phoneNumber || !password || !confirmPassword || !otp) {
        return res.status(400).json({ message: 'Please fill all the fields' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        // Ensure the phone number is in E.164 format
        const formattedPhoneNumber = `+${phoneNumber}`; // Make sure to include the country code

        // Verify OTP using Twilio Verify with v2 services
        const verification = await client.verify.v2.services(serviceSid)
            .verificationChecks
            .create({ to: formattedPhoneNumber, code: otp });

        if (verification.status === "approved") {
            // Check if the user already exists
            const userExists = await User.findOne({ email });

            if (userExists) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Create new user
            const newUser = await User.create({
                name,
                email,
                phoneNumber,
                password,
            });

            // Return success and JWT token
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                token: generateToken(newUser._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error("Error during OTP verification or registration:", error);
        res.status(500).json({ message: 'Error during OTP verification or registration', error: error.message });
    }
};



// Register a new user
// export const registerUser = async (req, res) => {
//     const { name, email, phoneNumber, password, confirmPassword } = req.body;

//     console.log("Received data:", { name, email, phoneNumber, password, confirmPassword });

//     if (!name || !email || !phoneNumber || !password || !confirmPassword) {
//         return res.status(400).json({ message: 'Please fill all the fields' });
//     }

//     if (password !== confirmPassword) {
//         return res.status(400).json({ message: 'Passwords do not match' });
//     }

//     try {
//         // Check if the user already exists
//         console.log("Checking if user exists...");
//         const userExists = await User.findOne({ email });
        
//         if (userExists) {
//             console.log("User already exists");
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         console.log("Creating a new user...");
//         // Create new user
//         const newUser = await User.create({
//             name,
//             email,
//             phoneNumber,
//             password,
//         });

//         console.log("User created successfully:", newUser);

//         // Return success and JWT token
//         res.status(201).json({
//             _id: newUser._id,
//             name: newUser.name,
//             email: newUser.email,
//             phoneNumber: newUser.phoneNumber,
//             token: generateToken(newUser._id),
//         });
//     } catch (error) {
//         console.error("Error occurred during user registration:", error);
//         res.status(500).json({ message: 'Error registering user', error: error.message });
//     }
// };






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

// Fetch user details
export const getUserDetails = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have middleware that attaches user info to req
        console.log("Fetching details for user ID:", userId);

        // Find user by ID
        const user = await User.findById(userId).select('-password'); // Exclude password from response

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user details
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role, // Ensure this field exists in your User model
            gender: user.gender // Ensure this field exists in your User model
        });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: 'Error fetching user details', error: error.message });
    }
};
