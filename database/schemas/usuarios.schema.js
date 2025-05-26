// aca es donde vamos a crear el schema de usuarios , representaria algo similar a una tabla usuarios en sql convencional

import mongoose from "mongoose";

const {Schema, models , model } = mongoose;



const UsuarioSchema = new Schema({
nombre: { type: String, required: true },
apellido: { type: String, required: true },
direccion: { type: String, required: true },
email: { type: String, required: true, unique: true },
contraseña: { type: String, required: true }
}, {
versionKey: false // Evita que se agregue el campo __v
});

// Evita recompilar el modelo si ya existe
const Usuario = models.usuario || model('Usuario', UsuarioSchema);

export default Usuario;
