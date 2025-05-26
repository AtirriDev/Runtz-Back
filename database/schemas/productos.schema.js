// aca es donde vamos a crear el schema de productos , representaria algo similar a una tabla productos en sql convencional

import mongoose from "mongoose";

const { Schema, models, model } = mongoose;

const ProductoSchema = new Schema({
  marca: { type: String, required: true },
  producto: { type: String, required: true },
  categoria: { type: String, required: true },
  imagen: { type: String, required: true },
  precio: { type: Number, required: true },
  disponible: { type: Boolean, default: true }
}, {
  
  versionKey: false        //  Evita que se agregue el campo __v
});

const Producto = models.Producto || model('Producto', ProductoSchema);

export default Producto;
