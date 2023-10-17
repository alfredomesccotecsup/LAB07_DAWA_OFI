const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');


mongoose.connect('mongodb://0.0.0.0:27017/moviesdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});


app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


const movieSchema = new mongoose.Schema({
  title: String,
  director: String,
  releaseYear: Number,
  imageURL: String,
  description: String,
  genre: String,
  rating: Number
});

const Movie = mongoose.model('Movie', movieSchema);


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
  
  res.render('index');
});

app.post('/add', (req, res) => {
  
  const newMovie = new Movie({
    title: req.body.title,
    director: req.body.director,
    releaseYear: req.body.releaseYear,
    imageURL: req.body.imageURL,
    description: req.body.description,
    genre: req.body.genre,
    rating: req.body.rating
  });

  newMovie.save().then(() => {
    console.log('Movie saved');
    res.redirect('/movies');
  }).catch((error) => {
    console.error('Error saving movie:', error);
  });
});

app.get('/movies', (req, res) => {
 
  Movie.find().then((movies) => {
    res.render('movies', { movies });
  }).catch((error) => {
    console.error('Error retrieving movies:', error);
  });
});


app.get('/index', (req, res) => {
  res.render('index');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
