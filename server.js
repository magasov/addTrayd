const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const app = express();

mongoose.connect('mongodb+srv://magasov:12345@magasov.pnjqkm6.mongodb.net/?retryWrites=true&w=majority&appName=magasov')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

const Ad = require('./models/Ad');

app.post('/api/ads', upload.array('images', 3), (req, res) => {
    const { title, price, telephone, description, category } = req.body;
    const images = req.files.map(file => file.filename);

    const newAd = new Ad({
        title,
        price,
        telephone,
        description,
        category,
        images,
        createdAt: new Date()
    });

    newAd.save()
        .then(ad => res.status(200).send(ad))
        .catch(err => res.status(500).send(err));
});

app.get('/api/ads', (req, res) => {
    Ad.find().sort({ createdAt: -1 }).exec()
        .then(ads => res.status(200).send(ads))
        .catch(err => res.status(500).send(err));
});

app.get('/api/ads/:category', (req, res) => {
    const category = req.params.category;
    Ad.find({ category }).sort({ createdAt: -1 }).exec()
        .then(ads => res.status(200).send(ads))
        .catch(err => res.status(500).send(err));
});

app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'services.html'));
});

app.get('/phones', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'phones.html'));
});

app.get('/cars', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cars.html'));
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
