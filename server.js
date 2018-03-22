const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');

app.use(methodOverride('_method'));
app.use(session({
    secret:'feedmeseymour',
    resave:false,
    saveUninitialized: false
}))
app.use(express.urlencoded({extended:false}));

const usersController = require('./controllers/users.js');
app.use('/users', usersController);

const sessionsController = require('./controllers/sessions.js');
app.use('/sessions', sessionsController);

app.get('/', (req, res)=>{
    res.render('index.ejs', {
        currentUser: req.session.currentuser
    });
});

app.post('/articles', (req, res)=>{
    req.body.author = req.session.currentuser.username;
    Article.create(req.body, (err, createdArticle)=>{
        res.redirect('/articles');
    })
})

app.get('/app', (req, res)=>{
    if(req.session.currentuser){
        res.send('the app');
    } else {
        res.redirect('/sessions/new');
    }
});

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auth';
mongoose.connect(mongoURI);

mongoose.connection.once('open', ()=>{
    console.log('connected to mongo');
})

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log('listening');
});
