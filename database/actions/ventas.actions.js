
import Venta from "../schemas/ventas.schema.js"; // importamos el schema de ventas 



export const ObtenerVentas = async() => {
    try {
        const ventas = await Venta.find().populate({ path: "productos" })
        .populate({ path: "id_usuario" }); ;
        return ventas;
        
    } catch (error) {
        console.log(error)
    }



}



export const NuevaVenta = async(venta) => {
    try {

        const newVenta = await Venta.create(venta);
        return venta;
        
    } catch (error) {
        console.log(error)
    }



}

// traer venta por id venta
export const ObtenerPorIdVenta = async (id) =>{
    try {
        const ventabuscada = await Venta.findById(id).populate({ path: "productos" })
        .populate({ path: "id_usuario" }); 
        return ventabuscada;
    } catch (error) {
        console.log(error)
    }

}

// traer ventas por id usuario 
export const VentasPorUsuario = async(id)=>{
    try {
        
        const ventabuscada = await Venta.find({ id_usuario: id }).populate("id_usuario").populate({ path: "productos" }); 
        
        return ventabuscada;
    } catch (error) {
        console.log(error)
    }
}

// eliminar venta asociadas a un usuario 

export const EliminarVentasUsuario = async (idUsuario) => {
    try {
        
        // debemos usar deleta many 
        const ventasUser = await Venta.deleteMany({ id_usuario: idUsuario }); // basicamente elimina todo cuando coincide el id usuario 

        
        return ventasUser;  


    } catch (error) {
        
        console.log(error)
    }



}

