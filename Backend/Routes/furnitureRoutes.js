const express = require("express");
const router = express.Router();
const Furniture = require("../Models/FurnitureModel");

// Get all furniture
router.get("/getAll", async (req, res) => {
    try {
        const furniture = await Furniture.find();
        res.status(200).json(furniture);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Get furniture by ID
router.get("/getById/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const furniture = await Furniture.findById(id);
        if (!furniture) {
            return res.status(404).json({ message: "Furniture not found" });
        }
        res.status(200).json(furniture);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Add new furniture
router.post("/add", async (req, res) => {
    const { name, type, pricePerDay, description, location, bookedDates, image } = req.body;
    console.log(" { name, type, pricePerDay, description, location, bookedDates, image }: ", { name, type, pricePerDay, description, location, bookedDates, image });
    if (!name || !type || !pricePerDay || !description || !location || !bookedDates || !image) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const newFurniture = new Furniture({ name, type, pricePerDay, description, location, bookedDates, image });
        await newFurniture.save();
        res.status(200).json({ message: "Furniture added successfully", furniture: newFurniture });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Update furniture details
router.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const { name, type, pricePerDay, description, location, bookedDates, image } = req.body;
    try {
        const furniture = await Furniture.findById(id);
        if (!furniture) {
            return res.status(404).json({ message: "Furniture not found" });
        }
        if (name) furniture.name = name;
        if (type) furniture.type = type;
        if (pricePerDay) furniture.pricePerDay = pricePerDay;
        if (description) furniture.description = description;
        if (location) furniture.location = location;
        if (bookedDates) furniture.bookedDates = bookedDates;
        if (image) furniture.image = image;
        await furniture.save();
        res.status(200).json({ message: "Furniture details updated successfully", furniture });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
