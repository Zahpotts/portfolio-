const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const profile = require('./routes/profile');
const contact = require('./routes/contact');
const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/profile', profile);
app.use('/contact', contact);
app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});
