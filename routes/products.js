const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const Product = require("../models/Product");
const authUltis = require('../helpers/auth')

router.post('/newProduct',authUltis.verifyToken,(req,res,next)=>{

  let product = req.body

  Product.create(product).then(product=>{
    //helper para borrar datos
    //
    res.status(200).json({product});
  }).catch(error => {
    error.action = "Error while create products";
    next(error);
  });
})

router.get('/getProducts',(req,res,next)=>{

  Product.find().populate("_category").then(products=>
    res.status(200).json({products})
    )
  .catch(error => {
    error.action = "Error while getAll products";
    next(error);
  });
})

router.get('/:id/getByCategory',(req,res,next)=>{
  let {id}= req.params
  Product.find({_category:id}).then(products=>
    res.status(200).json({products})
    ).catch(error => {
      error.action = "Error while get products by category";
      next(error);
    });
})
router.patch('/:id/edit',(req,res,next)=>{
  let {id}= req.params
  let product = req.body
  
  if(req.file){
    const image = req.file.secure_url
    product.image = image
    //product['image']
  }
  
  Product.findByIdAndUpdate({_id:id},{ $set: {...product} }, { new: true }).then(product=>
    res.status(200).json({
      product
    })
  ).catch(error=>{
    error.action = "Error while updating Product";
      next(error);
  })

})
module.exports = router;