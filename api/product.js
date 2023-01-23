const express = require('express');
const router = express.Router();
const Product = require('../Models/Products');
const mongoose = require('mongoose');
const { default: axios } = require('axios');
const  fetchAllProduct = require('../utils/getProduct');
const  UpdateProduct = require('../utils/getProduct');



// @route   GET api/animals
// @desc    get all animals
// @access  Public
router.get('/update-all', async (req, res) => {
    const d = new Product()
  let p=  await fetchAllProduct(0)
  return res.send(p);
});
// @route   POST api/animals
// @desc    modify animleal
// @access  Public
router.get('/search', async (req, res) => {
  const {keySearch,from,range} = req.query
  console.log(typeof(keySearch));
  const filter = { trade_item_description: {$regex :keySearch} };
  console.log(keySearch);
  try {
    //db.users.findOne({"trade_item_description" : {$regex : "לחם"}});
    let doc = await Product.find({trade_item_description : new RegExp(keySearch,"i")},(err,data)=>{
      if (err) {
        console.log(err);
        
      }
      else if(data){
      
        console.log("data",data.length);

      }
    }).clone().skip(from).limit(range).exec()
    return res.json(doc);

  } catch (error) {
    console.log(error);
  }      return res.status(500).json('Server Error ' + { msg: error });

  // `doc` is the document _before_ `update` was applied

});
router.put('/products-update', async (req, res) => {
  const filter = { _id: req.params.animalId };
  const {intervalTime,} = req.body
  try {
    //
    const d = new Product()
    let p=  await UpdateProduct(0,intervalTime)
    return res.json('docs updated');

  } catch (error) {
    
  }      return res.status(500).json('Server Error ' + { msg: error });

  // `doc` is the document _before_ `update` was applied

});
module.exports =router