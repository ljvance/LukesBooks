const express = require('express');

const app = express();
const port = 3000;
const session = require('express-session');

const User = require('./model.js');

const Order = require('./order.js');

const passport = require('passport');

const connectEnsureLogin = require('connect-ensure-login');

app.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname));
app.set("view engine", "ejs");
app.set("views", './');

app.use(passport.initialize());

passport.use(User.createStrategy());

app.use(session({
  secret: 'sljgoijwh;eojwp298u40t',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 60*60*1000} 
}));

app.use(passport.session());



passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/private', connectEnsureLogin.ensureLoggedIn(),  (req, res)=>{
  res.render('private',{
    firstname: req.user.firstname,
    email: req.user.email
  });
})

app.get('/home', connectEnsureLogin.ensureLoggedIn(), (req,res)=> {
  req.session.counter =(req.session.counter || 0) +1;
  res.render('index',{
    amount:req.session.counter,
    firstname: req.user.firstname,
    lastname: req.user.lastname,
    email: req.user.email,
    zipcode: req.user.zipcode,
    username: req.user.username
  });
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/success', (req, res) => {
  res.sendFile(__dirname + '/OrderSuccess.html');
});

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});

app.get('/', (req, res)=>{
  res.sendFile(__dirname + '/login.html');
});

app.get('/css', (req, res)=>{
  res.sendFile(__dirname + '/app.css');
});

app.get('/app', (req, res)=>{
  res.sendFile(__dirname + '/app.js');
});

app.get('/products', (req, res)=>{
  res.sendFile(__dirname + '/products.json');
});

app.get('/authfail', (req, res)=>{
  res.sendFile(__dirname + '/authfail.html');
});

app.get('/logout', (req, res) =>{
  console.log(req.session.id)
  // req.logout();
  req.session.destroy((err)=>{
    //cannot use req.session
    console.log(err)
  });
  res.redirect('/login');
})

app.listen(port, function() {
  console.log(`app listening on port ${port}!`);
});
app.post('/register-server', function(req, res, next){
  User.register({firstname: req.body.firstname,
                 lastname: req.body.lastname,
                 email: req.body.email, 
                 zipcode: req.body.zipcode, 
                 username: req.body.username}, 
                 req.body.password, function(err){
    if(err){
      console.log('error while user register!', err);
      return next(err);
    } 
    console.log('user registered!');
    res.redirect('/')
  })
})

function authfail() {
  alert("Wrong username or password");
}

app.post('/order-server', function(req, res, next){
  console.log(req);
  Order.create({
    username: req.body.username, 
    email: req.body.email, 
    bookTitles: req.body.bookTitles, 
    totalPrice: req.body.totalPrice,
    creditCardNumber: req.body.creditCardNumber, 
    address: req.body.address}, function(err){
      if(err){
        console.log(err);
        // return res.redirect('/order-server');
      }
        console.log('Order Placed!');
        res.redirect('/success')
    // return next(err);
  })
})

app.post('/login-server', passport.authenticate('local', {failureRedirect: '/authfail'}), function (req, res){
  console.log(req.user)
  res.redirect('/home')
})

module.exports = app;
