require('dotenv').config()
const express = require("express");
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const port =  process.env.PORT || 8080;
const session = require('express-session')
const flash = require('express-flash')
const bodyParser = require('body-parser')
const path = require('path')

const knex = require('./Database/connection')

const admController = require('./controller/admController')
const userController = require('./controller/userController')

app.use(session({
    secret: 'asfjaçdsfjadsçlfjadf',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }
}))
app.use(flash())

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/assets', express.static(__dirname + 'public/assets'));

app.set('views', path.join(__dirname + '/views') );
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

app.use('/', admController)
app.use('/', userController)

app.get("/", async function(req, res){
    var result = await knex('produtos').select()
    res.render('index', {products: result, user: req.session.user});
});

app.get("/carrinho", (req, res) => {
    if(req.session.user == undefined){
        res.redirect('/sing-in')
    }else{
        res.render('carrinho', {user: req.session.user});
    }
});

app.get('/about-us', (req, res) => {
    res.render('partials/aboutus', {user: req.session.user})
})

app.use((req, res, next) => {
    res.status(400).send('Não Encontrado, contate o desenvolvedor')
})

app.listen(port, () => {
    console.log(`=====> Servidor rodando na porta: ${port}`);
});