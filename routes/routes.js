const express = require("express");
const Model = require("../models/model");
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateData = [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('age').isInt({ min: 0 }).withMessage('Age must be a positive integer'),
];

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST Method
router.post("/post", validateData, handleValidationErrors, async (req, res) => {
  try {
    const data = new Model({
      name: req.body.name,
      age: req.body.age,
    });
    const dataToSave = await data.save();
    res.status(201).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET all Method
router.get("/getAll", async (req, res) => {
  try {
    const data = await Model.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET by ID Method
router.get("/getOne/:id", async (req, res) => {
  try {
    const data = await Model.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE by ID Method
router.patch("/update/:id", validateData, handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const options = { new: true, runValidators: true };

    const result = await Model.findByIdAndUpdate(id, updatedData, options);
    if (!result) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE by ID Method
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Model.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json({ message: `Document with name ${data.name} has been deleted.` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;