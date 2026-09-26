const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Item = require('./models/Item');
const User = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://nethnethmidhananjana1011_db_user:a6wtcfbhLJJN48Cj@ac-lihiprf-shard-00-00.fb0bm14.mongodb.net:27017,ac-lihiprf-shard-00-01.fb0bm14.mongodb.net:27017,ac-lihiprf-shard-00-02.fb0bm14.mongodb.net:27017/?ssl=true&replicaSet=atlas-oskgwd-shard-0&authSource=admin&appName=Cluster0')
.then(() => {
    console.log('Connected to MongoDB');
}).catch(err => console.log(err));


// --- AUTHENTICATION APIs ---

app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Signup failed" });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, "reuseai_secret_key", { expiresIn: '7d' });
        res.status(200).json({ 
            message: "Login successful", 
            token, 
            user: { id: user._id, name: user.name, email: user.email } 
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Login failed" });
    }
});


// --- ITEM APIs ---

app.post('/api/items', async (req, res) => {
    try {
        const mlResponse = await fetch('http://127.0.0.1:8000/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: req.body.name,
                material: req.body.material,
                condition: req.body.condition
            })
        });
        
        const mlData = await mlResponse.json();
        const newItem = new Item(req.body);
        await newItem.save();

        res.status(201).json({ 
            message: "Item created successfully", 
            item: newItem,
            recommendations: mlData.recommendations 
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to process item" });
    }
});

app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.status(200).json(items);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to fetch items" });
    }
});

app.delete('/api/items/:id', async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to delete item" });
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});