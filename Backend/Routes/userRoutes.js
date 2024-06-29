const express = require("express");
const router = express.Router();
const Users = require("../Models/UserModel");
const bcrypt = require("bcryptjs");

// Signup endpoint
router.post("/signup", async (req, res) => {
    const { email, name, address, contactNumber, password } = req.body;
    console.log("{ email, name, address, contactNumber, password }: ", { email, name, address, contactNumber, password });
    if (!email || !name || !address || !contactNumber || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const userExists = await Users.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Users({ email, name, address, contactNumber, password: hashedPassword });
        await newUser.save();
        res.status(200).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.log("error: ", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// Login endpoint
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        res.cookie("email", email, { httpOnly: true });
        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Update user details endpoint
router.put("/updateDetails", async (req, res) => {
    const { email, name, address, contactNumber, oldPassword, newPassword } = req.body;
    if (!email || !oldPassword) {
        return res.status(400).json({ message: "Email and old password are required" });
    }
    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid old password" });
        }
        if (name) user.name = name;
        if (address) user.address = address;
        if (contactNumber) user.contactNumber = contactNumber;
        if (newPassword) user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({ message: "User details updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Get user details endpoint
router.get("/getDetails", (req, res) => {
    res.status(200).json({ message: "This endpoint is pending implementation" });
});

module.exports = router;
