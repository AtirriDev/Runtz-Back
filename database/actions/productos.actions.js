// aca vamos a tener todas las acciones que tienen que con los productos 

import Producto from "../schemas/productos.schema.js";

export const ObtenerTodos = async () => {
  try {
    const res = await Producto.find();
    return JSON.parse(JSON.stringify(res));
  } catch (error) {
    console.log(error);
  }
};

export const AgregarProducto = async (data) => {
  try {
    const nuevo = new Producto(data);
    await nuevo.save();
    return nuevo;
  } catch (error) {
    console.log(error);
  }
};


// buscar por categoria 

export const BuscarPorCategoria = async(categoria) =>{
  try {
    console.log(categoria)
    const productosCat = await Producto.find({categoria}); // los paremetros se ponen dentro de {}
    // si queremos un numero concreto de datos que querramos que traiga usamos .limit  await Producto.find({categoria}).limit
    return productosCat ;
    
  } catch (error) {
     console.log(error);
  }



}