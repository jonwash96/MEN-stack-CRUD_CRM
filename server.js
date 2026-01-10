const express = require('express');
const morgan = require('morgan');
const Customer = require('./models/Customer.js');
const methodOverride = require('method-override');
const customerController = require('./controllers/customerController');

//* VAR
const port = 3000;

//* APP
const app = express();

//* MID
require('./db/connection.js');
app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(express.urlencoded({ extended:true }));
app.use(methodOverride('_method'));

//* ROUTE
app.get('/', (req,res) => {
    res.render('home.ejs');
})

app.use(customerController);

app.get('/*splat', (req,res) => {
    res.render('404.ejs', { url:req.url})
})

//* LISTEN
app.listen(port, ()=>console.log(`Server Running on Port ${port}. Access at [http://localhost:${port}]`));