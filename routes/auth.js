const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User");
const authUltis = require('../helpers/auth')
const mailer = require("../helpers/mailer");

router.post("/signup", (req, res) => {
  let { password, passwordConfirm } = req.body;
  if (password !== passwordConfirm) 
      return res.status(500).json({
      error,
      message: "Contraseñas no coinciden"
    })

  const salt = bcrypt.genSaltSync(10);
  const hasshedPassword = bcrypt.hashSync(req.body.password, salt);
  User.create({...req.body, password: hasshedPassword})
  .then(user => {
    const { email,name } = user;
    const options = {
      filename: "verify",
      email,
      subject: "MexArt te da la bienvenida "+name,
      message:
        "Esto es una prueba"
    };

    mailer.send(options);
    jwt.sign({id: user._id}, process.env.SECRET, {
      expiresIn: 86400
    }, (err, token) => {
      // if (err) throw err;
      res.status(200).json({token});
    })

  })
  .catch(error => {
    error.action = "Error while creating user";
    next(error);
  });


})

router.post("/login", (req, res) => {
  const {email, password} = req.body;
  User.findOne({email})
  .then(user => {

    if(!user) return res.status(404).json({
      error: {},
      message: "Email incorrecto"
    })

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if(!passwordIsValid) return res.status(401).json({
      error: {},
      message: "Contraseña incorrecta"
    })

    jwt.sign({id: user._id}, process.env.SECRET, {
      expiresIn: 86400
    }, (err, token) => {
      // if (err) throw err;
      delete user._doc.password
      delete user._doc.createdAt
      delete user._doc.updatedAt
      delete user._doc.__v
      res.status(200).json({token, user})

    })

  }).catch(error => {
    error.action = "Error while login user";
    next(error);
  });

})



router.patch('/:id/edit',authUltis.verifyToken, (req,res)=>{
  let {id}= req.params
  let user = req.body
  User.findByIdAndUpdate({_id:id},{ $set: {...user} }, { new: true }).then(user=>
    res.status(200).json({user})
  ).catch(error => {
    error.action = "Error while edit user";
    next(error);
  });
})

router.patch('/:id/changepass',authUltis.verifyToken,(req,res)=>{
  let {id}= req.params
  let user = req.body
  let { password, passwordConfirm } = req.body;
  if (password !== passwordConfirm) 
      return res.status(500).json({
      error,
      message: "Contraseñas no coinciden"
    })
    const salt = bcrypt.genSaltSync(10);
    const hasshedPassword = bcrypt.hashSync(req.body.password, salt);
    user['password']=hasshedPassword
    User.findByIdAndUpdate({_id:id},{ $set: {...user} }, { new: true }).then(user=>
      res.status(200).json({user})
    ).catch(error => {
      error.action = "Error while edit user";
      next(error);
    });
})




module.exports = router;