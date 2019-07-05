const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const authUltis = require('../helpers/auth')

router.post('/add',(req,res,next)=>{

  let category = req.body
  Category.create(category).then(category=>{
    //helper para borrar datos
    //
    res.status(200).json({category});
  }).catch(error => {
    error.action = "Error while create catagory";
    next(error);
  });
})


router.get('/getAll',(req,res,next)=>{
  
  Category.find().then(category=>
    res.status(200).json({category})
  ).catch(error => {
    error.action = "Error while find category";
    next(error);
  });
})



router.patch('/:id/edit',(req,res,next)=>{
  let {id}= req.params
  let category = req.body
  Category.findByIdAndUpdate({_id:id},{ $set: {...category} }, { new: true }).then(category=>
    res.status(200).json({category})
  ).catch(error => {
    error.action = "Error while edit category";
    next(error);
  });
})



module.exports = router;