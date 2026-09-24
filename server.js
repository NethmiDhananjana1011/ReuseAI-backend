
const express = require('express');
const mongoose = require('mongoose');
const Item = require('./models/Item');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// මතක ඇතුව <db_username> කියන තැනට ඔයාගේ MongoDB username එක දෙන්න
// මතක ඇතුව <db_username> කියන තැනට ඔයාගේ MongoDB username එක දෙන්න
mongoose.connect('mongodb://nethnethmidhananjana1011_db_user:a6wtcfbhLJJN48Cj@ac-lihiprf-shard-00-00.fb0bm14.mongodb.net:27017,ac-lihiprf-shard-00-01.fb0bm14.mongodb.net:27017,ac-lihiprf-shard-00-02.fb0bm14.mongodb.net:27017/?ssl=true&replicaSet=atlas-oskgwd-shard-0&authSource=admin&appName=Cluster0')
.then(() => {
    console.log('Connected to MongoDB');
}).catch(err =>
    console.log(err));

app.post('/api/items', async (req, res) => {
    try {
        // 1. Python ML API එකට Data යවා Recommendations ලබාගැනීම
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

        // 2. Database එකට Item එක Save කිරීම
        const newItem = new Item(req.body);
        await newItem.save();

        // 3. React එකට Item එකයි, Python එකෙන් ආපු Recommendations ටිකයි යැවීම
        res.status(201).json({ 
            message: "Item created successfully", 
            item: newItem,
            recommendations: mlData.recommendations // ML එකෙන් එන Result එක 
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to process item and get recommendations" });
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});