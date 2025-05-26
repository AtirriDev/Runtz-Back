/* Aca vamos a trabajar todas las rutas que tengan que ver con los usuarios */
import { Router } from "express";
import { readFile, writeFile } from 'fs/promises'
import { ObtenerVentas,NuevaVenta , ObtenerPorIdVenta , VentasPorUsuario} from "../database/actions/ventas.actions.js";
import mongoose from 'mongoose'; //  importar mongoose
import { BuscarUsuario } from '../database/actions/usuarios.actions.js';


// constante de router para exportar 
const router = Router()







/*Rutas GET */

 // traer todas las ventas 
 router.get('/' ,async (req,res) =>
    {
        try {
               const ventas = await ObtenerVentas()
                console.log(ventas)
                if (ventas) {
                    res.status(200).json(ventas)
                }else{
                    res.status(400).json({status:false}) // devolvemos un json con status : false 
                }
        } catch (error) {
            console.error('Error al procesar la solicitud:', error);
            res.status(500).json({ error: 'Hubo un problema al procesar la solicitud' });
        }
        




    })


/*Rutas POST */
      
      // Traer todas las ventas de un usuario específico, con POST 
         
            router.post('/VentasPorUsuario', async (req, res) => {
                        try {
                            const idUsuario = req.body.id;
                            console.log('Id recibido : ', idUsuario);

                            // 1. Validar el formato del ObjectId
                            if (!mongoose.Types.ObjectId.isValid(idUsuario)) {
                                console.log('ID de usuario no válido recibido:', idUsuario);
                                return res.status(400).json({
                                    error: 'El ID de usuario proporcionado no tiene un formato válido (debe ser una cadena hexadecimal de 24 caracteres).'
                                });
                            }

                            // 2. Verificar que el usuario exista
                           
                            const usuarioExistente = await BuscarUsuario(idUsuario);

                            if (!usuarioExistente) { 
                                console.log("No existe usuario con el ID ingresado:", idUsuario);
                               
                                return res.status(400).json({ message: `No existe un usuario con el ID ingresado: ${idUsuario}` });
                            }

                            // 3. Filtramos las ventas del usuario
                            let ventasDelUsuario = await VentasPorUsuario(idUsuario); 

                          
                            console.log("Ventas encontradas:", ventasDelUsuario);

                            // 4. Verificamos si el usuario tiene ventas asociadas
                            
                            if (ventasDelUsuario && ventasDelUsuario.length > 0) {
                                res.status(200).json(ventasDelUsuario);
                            } else {
                                
                                res.status(400).json({ message: `El usuario con ID ${idUsuario} no posee ventas registradas.` });
                            }

                        } catch (error) {
                            console.error('Error al procesar la solicitud en la ruta de ventas:', error);

                            
                            res.status(500).json({ error: 'Hubo un problema interno del servidor al procesar la solicitud.' });
                        }
            });

// Traer todas las ventas por id  específico, 
        router.post("/BusquedaPorId" , async (req,res) => {
            const id = req.body.id;
           
            try {
                const ventabuscada = await ObtenerPorIdVenta(id)
                console.log(ventabuscada)
                 res.status(200).json(ventabuscada);
            } catch (error) {
                console.log(error)
            }



        })

         

        // NUEVA VENTA
          router.post("/add", async (req, res) => {
                try {
                    const { id_usuario, fecha, total, dirección , productos } = req.body;

                    const venta = { id_usuario, fecha, total, dirección, productos };

                    console.log("venta para procesar ");
                    console.log(venta);

                    

                    const ventaGuardada = await NuevaVenta(venta);

                    res.status(200).json(ventaGuardada);
                    console.log("venta cargada");
                    console.log(ventaGuardada);
                    console.log("Procedimiento terminado");

                } catch (err) {
                    console.error('Error al guardar la venta:', err);
                    res.status(500).json({ error: 'Error al guardar la venta' });
                }
             });


/*Exportamos */

export default router