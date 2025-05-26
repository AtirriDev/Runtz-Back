/* Aca vamos a trabajar todas las rutas que tengan que ver con los usuarios */
import { Router } from "express";
import { readFile, writeFile } from 'fs/promises'
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import { ObtenerUsuarios , AgregarUsuarios, BuscarUsuario, EliminarUsuario} from "../database/actions/usuarios.actions.js";
import {VentasPorUsuario, EliminarVentasUsuario} from "../database/actions/ventas.actions.js";
import mongoose from 'mongoose'; //  importar mongoose
import Usuario from "../database/schemas/usuarios.schema.js";


dotenv.config(); // traer las variables de entorno sino no las va a leer 
const secret_jwt = process.env.CLIENT_SECRET_JWT;


// constante de router para exportar 
const router = Router()





/* Ruta GET*/

/* obtener todos los usuarios */

    // traer todos los usuarios 
    router.get('/' , async (req,res) =>
    {
        try {
            const usuarios = await ObtenerUsuarios();
            console.log(usuarios)
            
            if (usuarios) {
                res.status(200).json(usuarios)
            }else{
                res.status(400).json({status:false}) // devolvemos un json con status : false 
            }

        } catch (error) {
            console.error('Error al procesar la solicitud:', error);
            res.status(500).json({ error: 'Error al guardar el usuario' });
        }
        



    })


/* Ruta POST */

    
    // Logica de login
router.post('/login', async (req, res) => {
    try {
       const usuarios = await ObtenerUsuarios();

        // obtenemos email y contraseña del body
        const { email, contraseña } = req.body;
        console.log('Datos recibidos:', email, contraseña);

        // validamos que se hayan enviado ambos campos
        if (!email || !contraseña) {
            return res.status(400).json({ error: 'Debe proporcionar email y contraseña.' });
        }
        // buscamos el usuario
      
        const usuario = usuarios.find (e => e.email === email ) // traigo solo por el email , para dsp convalidar la contraseña hasheada
        console.log(usuario)
        
        if (!usuario) {
            
            return res.status(404).send({status:false})
        }
        
        const ControlarContraseña = await bcrypt.compare(contraseña, usuario.contraseña); // ¡AQUÍ ESTÁ EL CAMBIO CLAVE!
        console.log(ControlarContraseña); // Esto ahora imprimirá true o false
        if (!ControlarContraseña) {
            
            return res.status(401).json({ status: false, message: 'Contraseña incorrecta' }); // Mejor un 401 Unauthorized
        }
        // envio estos datos que son necesarios en el front tambien 
        const datosUsuario = {
            id: usuario._id.toString(),  // 
            email: usuario.email ,
            direccion: usuario.direccion         
        };
       // aca empezamos con el jwt 

       // const token = jwt.sign({...usuario},secret_jwt ,{ expiresIn:86400 })
        const token = jwt.sign(datosUsuario, secret_jwt, { expiresIn:86400 });
        console.log(token) // lo mostramos para que ver manda 

       res.status(200).json({
            token: token,
            datosUsuario: datosUsuario
        });
       
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
       
        res.status(500).json({ error: 'Error interno al procesar la solicitud.' });
    }
});





// Agregar un nuevo usuario 
router.post('/add', async (req, res) => {
    try {
      const usuarios = await ObtenerUsuarios();
      
      
        const { nombre, apellido, direccion,email, contraseña } = req.body;

        // Validamos datos
        if (!nombre || !apellido ||!direccion|| !email || !contraseña) {
        return res.status(400).json({ error: 'Faltan datos del usuario' });
        }

        const hashedPass = bcrypt.hashSync(contraseña, 8) ;

       
  
        // asignamos los datos al nuevo usuario 
        const nuevoUsuario = { 
                
                nombre, 
                apellido, 
                direccion,
                email, 
                contraseña : hashedPass // LE PASO LA CONTRASEÑA HASHEADA 
        };

        // validamos que no exista el usuario lo validamos con mail 
        const validarUsuarioMail = usuarios.find(u=> u.email === nuevoUsuario.email)
        if (validarUsuarioMail) {
            console.log("El mail del usuario ya se encuentra registrado")
             return res.status(400).json({ error: 'El email del usuario ya se encuentra registrado' });
        }
        
        // agregamos el nuevo usuario a la bd
        await AgregarUsuarios(nuevoUsuario);
        console.log(nuevoUsuario)
        res.status(200).json(nuevoUsuario);
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ error: 'Error al guardar el usuario' });
    }
  });






        


        
/* ruta DELETE */
                // eliminacion de usuario , importante al eliminar un usuario tambien se eliminan ventas vinculadas a el 
                router.delete("/delete", async (req, res) => {
                    
                    // Primero vamos a obtener el id del usuario desde la URL
                     const id = req.body.id;
                    
                    try {
                        
                        // 1. Validar el formato del ObjectId
                        if (!mongoose.Types.ObjectId.isValid(id)) {
                            console.log('ID de usuario no válido');
                            return res.status(400).json({
                                error: 'El ID de usuario proporcionado no tiene un formato válido'
                            });
                        }
                        console.log("Eliminando usuario")
                        const userDelete = await EliminarUsuario(id)
                        
                       
                        if (userDelete) {
                             // si el usuario fue eliminado , eliminamos sus ventas 
                             const ventasEliminar = await EliminarVentasUsuario(id)

                             res.status(200).json({
                                    message: `Usuario con ID ${id} y sus ventas asociadas eliminados exitosamente.`,
                                    deletedUser: userDelete,
                                    deletedSalesCount: ventasEliminar.deletedCount // delete count me trae el numero de ventas eliminadas
                            });
                            console.log(`Usuario ${id} y sus ${ventasEliminar.deletedCount} ventas asociadas eliminadas.`);
                        }else{
                            // si entra aca es por que el usuario no fue encontrado , seria raro pero lo verificamos 
                            res.status(400).json( `No se encontró un usuario con el ID ${id} para eliminar.` );
                            console.log("No se encontró usuario para eliminar con ID:", id);
                        }
                       
                
                      
                
                    } catch (error) {
                        
                        console.error('Error al procesar la solicitud:', error);
                        res.status(500).json({ error: 'Hubo un problema al procesar la solicitud' });
                    }
                });
                
                

/* Exportar la ruta*/

export default router