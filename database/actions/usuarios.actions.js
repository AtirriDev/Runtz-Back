


import Usuario from "../schemas/usuarios.schema.js"; // importamos el schema de usuarios

// Obtener todos los usuarios 
export const ObtenerUsuarios = async () => {
  try {
    const res = await Usuario.find(); // para traer todo no se pone nada adentro del find 
    return JSON.parse(JSON.stringify(res));
  } catch (error) {
    console.log(error);
  }
};

// Agregar Usuarios 
export const AgregarUsuarios = async (data) => {
  try {
    return await Usuario.create(data); // esto crea el usuario y lo guarda 
    // es la mejor opcion para hacer todo mas practico y si no necesitamos modificar el usuario
  } catch (error) {
    console.error("Error al agregar usuario:", error);
    
  }
};

// si queremos manipular mas los datos tenemos esta opcion haciendo mas pasos 
export const AgregarUsuarios2 = async (data) => {
  try {
    const nuevo = new Usuario(data); // creamos el usuario , dsp de aqui podemos modificarlo o hacer algun proceso
    // como no hacemos nada lo guardamos 
    await nuevo.save();
    // recien ahi lo retornamos
    return nuevo;
  } catch (error) {
    console.log(error);
   
  }
};


//obtener usuario por id 

export const BuscarUsuario = async(id)=>{
  try {
    const usuarioBuscando = Usuario.findById(id);
    return usuarioBuscando;
  } catch (error) {
    console.log(error)
  }
    
}


// eliminar por id 
export const EliminarUsuario = async(id)=>{
  try {
    const usuarioEliminar = await Usuario.findByIdAndDelete(id)
    console.log(usuarioEliminar)
    return usuarioEliminar;
  } catch (error) {
    console.log(error)
  }
    
}

