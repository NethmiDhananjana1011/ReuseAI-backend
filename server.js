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
        
        // අලුත් Item එකේ විස්තර වලට userId එකත් එකතු කරලා Save කරනවා
        const newItem = new Item({
            userId: req.body.userId,
            name: req.body.name,
            material: req.body.material,
            condition: req.body.condition,
            description: req.body.description
        });
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

// තමන්ගේ Items විතරක් බලාගන්න API එක
app.get('/api/items', async (req, res) => {
    try {
        const { userId } = req.query; // Frontend එකෙන් එවන userId එක ගන්නවා
        const items = await Item.find({ userId: userId }).sort({ createdAt: -1 });
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