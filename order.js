// dependencies
const mongoose = require('mongoose');

// connect to database
mongoose.connect('mongodb+srv://ljvance:ljvance@finalproject.undu1fs.mongodb.net/?retryWrites=true&w=majority');

const Schema = mongoose.Schema;

const Order = new Schema({
  username: String,
  email: String,
  bookTitles: String,
  totalPrice: String,
  creditCardNumber: String,
  address: String
});


module.exports = mongoose.model('orderinfos', Order);
