const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const user = require('./routes/api/user.js');
const profile = require('./routes/api/profile.js');
const post = require('./routes/api/post.js');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURI;

// Connection to MongoDB
mongoose
	.connect(db)
	.then(() => console.log('Mongoose Connected'))
	.catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello Me'));

// Using Routes
app.use('/api/user', user);
app.use('/api/profile', profile);
app.use('/api/post', post);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

