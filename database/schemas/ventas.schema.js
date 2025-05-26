// aca es donde vamos a crear el schema de ventas , representaria algo similar a una tabla ventas en sql convencional

import mongoose from "mongoose";

const { Schema, models, model } = mongoose;

const VentaSchema = new Schema({
  id_usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  dirección: {
    type: String,
    required: true
  },
  productos: [{
    type: Schema.Types.ObjectId, // aca marcamos que es una un "array"
    ref: 'Producto', // tiene que hacer referencia a esto del schema productos "const Producto = models.Producto || model('Producto', ProductoSchema);"
    required: true
  }]}, {
  versionKey: false // ✅ Evita que Mongoose agregue el campo __v
});





const Venta = models.venta || model('ventas', VentaSchema);

export default Venta;
