const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    required:true,
    type: String
  },
  last_name:{
    required:true,
    type: String
  },
  email: {
    required: true,
    unique: true,
    type: String
  },
  password: {
    required: true,
    type: String
  },
  roles: {
    type: String,
    enum: ["admin", "client"],
    default: "client"
  },
  address:{type:String , default:''},
  phone:{type:Number,default:null}
}, {timestamps: true})

module.exports = mongoose.model("User", userSchema);