const mongoose = require('mongoose');

const ProductsSchema = new mongoose.Schema({
    id: {
      type: String,
      
    },
    group_id: {
      type: String
    },
    group_name: {
      type: String
    },
    modification_timestamp: {
      type: Date
    },
    product_code: {
      type: String
    },
    effective_date_time: {
      type: String
    },
    discontinued_date_time: {
      type: String
    },
    gtin: {
      type: String
    },
    brandname: {
      type: String
    },
    trade_item_description: {
      type:mongoose.Schema.Types.Mixed
    },
    gln: {
      type: String
    },
    Product_Status: {
      type: String
    },
    content: {
      type: String
    },
    imgBase64:{
        type: String
    },
    moreDetails:{
      type:mongoose.Schema.Types.Mixed
    }
  });

module.exports = Products = mongoose.model('Products', ProductsSchema);