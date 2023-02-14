const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');
const uri = process.env.MONGODB_URI;

const connectDB = async () => {
    console.log(db);
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true
    });
    console.log('MongoDB connected ...');
  } catch (error) {
    console.log('Something wrong with the connect to DB');
  }
};

module.exports = connectDB;
