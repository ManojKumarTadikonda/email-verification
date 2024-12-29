const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { sendOtpEmail } = require("../utils/emailService");
const { JWT_SECRET } = require("../config");

const signup = async (req, res) => {
  console.log(req.body);
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validate input
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Save user to database
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      otp,
    });
    await user.save();

    // Send OTP to email
    await sendOtpEmail(email, otp);
    console.log("OTP sent successfully");

    res.status(201).json({ message: "User registered. Check your email for OTP." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(otp);
    console.log(user.otp);
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = undefined; // Clear OTP after verification
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { signup, verifyEmail, login };
