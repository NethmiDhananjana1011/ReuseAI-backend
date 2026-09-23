const expreass = require('express');
const mongoose = require('mongoose');
const Item = require('./models/Item');
const cros = require('.models/Item');

const app = express();
app.use(expreass.json());
app.use(cors());

mongoose.connect('mongodb://<db_username>:a6wtcfbhLJJN48Cj@ac-lihiprf-shard-00-00.fb0bm14.mongodb.net:27017,ac-lihiprf-shard-00-01.fb0bm14.mongodb.net:27017,ac-lihiprf-shard-00-02.fb0bm14.mongodb.net:27017/?ssl=true&replicaSet=atlas-oskgwd-shard-0&authSource=admin&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err =>
    console.log(err));

app.post('/api/items', async (req, res) => {
    try {
        const newItem = new Item(req.body);
        await newItem.save();
        res.status(201).json({ message: "Item created successfully", item: newItem });
    } catch (error) {
        res.status(500).json({ error: "Failed to add item" });
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
