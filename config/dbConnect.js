const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    console.log(db);
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true
    });
    console.log('MongoDB connected ...');
  } catch (error) {
    console.log('Something wrong with the connect to DB');
  }
};

module.exports = connectDB;
