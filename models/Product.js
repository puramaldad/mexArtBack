const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {type: String},
  price: {
    required: true,
    type: String
  },
  stock: {
    type: Number,
    default: 0
  },
  style:{enum:['Labrado a mano', 'Mueble clásico en madera'],type:String},
  image:{type:String, required:false},
  _category: {type: Schema.Types.ObjectId, ref: 'Category'},
  description:{type:String}
}, {timestamps: true})

module.exports = mongoose.model("Product", productSchema);