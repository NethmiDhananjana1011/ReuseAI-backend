const express = require('express');
const mongoose = require('mongoose');
const Item = require('./models/Item');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://nethnethmidhananjana1011_db_user:a6wtcfbhLJJN48Cj@ac-lihiprf-shard-00-00.fb0bm14.mongodb.net:27017,ac-lihiprf-shard-00-01.fb0bm14.mongodb.net:27017,ac-lihiprf-shard-00-02.fb0bm14.mongodb.net:27017/?ssl=true&replicaSet=atlas-oskgwd-shard-0&authSource=admin&appName=Cluster0')
.then(() => {
    console.log('Connected to MongoDB');
}).catch(err => console.log(err));

// POST API - Item එක save කරන සහ Python එකෙන් AI Result එක ගන්න route එක
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

// GET API - Database එකේ තියෙන Items ඔක්කොම React එකට යවන route එක
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.status(200).json(items);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to fetch items" });
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});