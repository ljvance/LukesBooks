// dependencies
const mongoose = require('mongoose');

//passport-local-mongoose is a authentication strategy module
const passportLocalMongoose = require('passport-local-mongoose');

// connect to database
mongoose.connect('mongodb+srv://ljvance:ljvance@finalproject.undu1fs.mongodb.net/?retryWrites=true&w=majority');
// Create Model
const Schema = mongoose.Schema;

const User = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  zipcode: String,
  username: String
});

//The plugin is for user authentication
User.plugin(passportLocalMongoose);


module.exports = mongoose.model('userinfos', User);


