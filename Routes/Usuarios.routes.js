/* Aca vamos a trabajar todas las rutas que tengan que ver con los usuarios */
import { Router } from "express";
import { readFile, writeFile } from 'fs/promises'


// constante de router para exportar 
const router = Router()



// Obtener datos 
const GetUsuarios = async() => {
    const archivoUsuarios  = await readFile('./Data/usuarios.json' , 'utf-8') // datos de usuarios 
    return JSON.parse(archivoUsuarios) // obtenemos los usuarios
} 

const GetVentas = async()=> {
    const archivoVentas = await readFile('./Data/ventas.json' , 'utf-8')
    return JSON.parse(archivoVentas) // obtenemos las ventas 
}


/* Ruta GET*/

/* obtener todos los usuarios */

    // traer todos los usuarios 
    router.get('/' , async (req,res) =>
    {
        try {
            const usuarios = await GetUsuarios();
        
            
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
        const usuarios = await GetUsuarios(); 

        // obtenemos email y contraseña del body
        const { email, contraseña } = req.body;
        console.log('Datos recibidos:', email, contraseña);

        // validamos que se hayan enviado ambos campos
        if (!email || !contraseña) {
            return res.status(400).json({ error: 'Debe proporcionar email y contraseña.' });
        }
        // buscamos el usuario
      
        let usuario = usuarios.find(u => u.email === email && u.contraseña === contraseña);

        
        if (usuario) { 

             let NombreCompleto = usuario.nombre + " " + usuario.apellido;
             console.log("El usuario autenticado es :")
             console.log(NombreCompleto);

            res.status(200).json(usuario);
        } else {
            
            res.status(400).json({ mensaje: 'Email o contraseña incorrectos.' }); 
            console.log('Credenciales inválidas para:', email);
            
        }

    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
       
        res.status(500).json({ error: 'Error interno al procesar la solicitud.' });
    }
});





// Agregar un nuevo usuario 
router.post('/add', async (req, res) => {
    try {
      const usuarios = await GetUsuarios();
      
      
      const { nombre, apellido, direccion,email, contraseña } = req.body;

        // Validamos datos
        if (!nombre || !apellido ||!direccion|| !email || !contraseña) {
        return res.status(400).json({ error: 'Faltan datos del usuario' });
        }

        // Obtener el último ID y sumarle 1
        const lastId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) : 0; // si no hay usuario le asigna el valor cero 
        const nuevoId = lastId + 1; // aca se le suma uno al ultimo id para que sea el id del nuevo usuario 
  
      // asignamos los datos al nuevo usuario 
      const nuevoUsuario = { 
        id: nuevoId, 
        nombre, 
        apellido, 
        direccion,
        email, 
        contraseña 
    };
      usuarios.push(nuevoUsuario); // lo cargamos al array 
  
      // sobreescribimos el archivo de datos usando el array actualizado 
      await writeFile('./Data/usuarios.json', JSON.stringify(usuarios, null, 2));
      res.status(200).json(nuevoUsuario);
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ error: 'Error al guardar el usuario' });
    }
  });






        

/* Ruta PUT */
        //vamos a actualizar los datos de un usuario 
                router.put("/update/:id", async (req, res) => {
                    try {
                            const usuarios = await GetUsuarios();
                        
                            // tomar el id del usuario de la url
                            const id = parseInt(req.params.id);
                        
                            // primero tenemos que ver que el id que nos mandan es de un usuario registrado
                            const ExisteUsuario = usuarios.find(x => x.id === id);
                            if (!ExisteUsuario) {
                                // si no existe debemos mostrar el error y retornar
                                console.log("El usuario no existe");
                                res.status(400).json("El usuario no existe ");
                                return;
                            }
                        
                            // Validamos los datos 
                            const { nombre, apellido, email, contraseña } = req.body;
                                    if (!nombre || !apellido || !email || !contraseña) {
                                        return res.status(400).json({ error: 'Faltan datos del usuario' });
                            }
                        
                        
                            // Creamos el nuevo objeto usuario con los datos actualizados
                            const UsuarioModificado = {
                                id,
                                nombre,
                                apellido,
                                email,
                                contraseña
                            };
                        
                            //AHORA TENEMOS QUE BUSCAR EN EL ARRAY EL LUGAR DEL USUARIO Y REEMPLAZARLO , MEDIANTE SU INDICE
                            let indice = usuarios.findIndex(x => x.id === id); // aca obtenemos el indice
                        
                            usuarios[indice] = UsuarioModificado; // Reemplazamos al Usuario completo, para reflejar cambios 
                            
                            //  timeout para ver si la escritura tarda demasiado , por que se me quedaba bloqueado el postman 
                            const timeout = setTimeout(() => {
                                res.status(500).json({ error: 'La escritura del archivo está tardando demasiado.' });
                            }, 10000); // 10 segundos

                            // sobreescribimos el json 
                           await writeFile('./Data/usuarios.json', JSON.stringify(usuarios, null, 2));

                            // Si se terminó correctamente, cancelamos el timeout
                            clearTimeout(timeout); 

                            // si no hay error mandamos la respuesta satisfactoria
                            res.status(200).json(usuarios[indice]); // devolvemos una respuesta con el usuario modificado
                            console.log("Modificacion exitosa ");
                            console.log(usuarios[indice]); // lo mostramos por consola tambien 
                            console.log("Procedimiento terminado ");
                    } catch (error) {
                        console.error("Error en la actualización del usuario:", error);
                        res.status(500).json({ error: "Error inesperado al actualizar el usuario" });
                    }
                });
  
        
/* ruta DELETE */
                // eliminacion de usuario , importante al eliminar un usuario tambien se eliminan ventas vinculadas a el 
                router.delete("/delete/:id", async (req, res) => {
                    try {
                        const usuarios = await GetUsuarios();
                        const Ventas = await GetVentas();
                
                        // Primero vamos a obtener el id del usuario desde la URL
                        const id = parseInt(req.params.id);
                
                        // Verificamos que exista el usuario
                        const ExisteUsuario = usuarios.find(x => x.id == id);
                        if (!ExisteUsuario) {
                            // Si no existe, debemos mostrar el error y retornar
                            console.log("El usuario no existe");
                            res.status(400).json("El usuario no existe");
                            return;
                        }
                
                        const UsuarioEliminado = usuarios.find(x => x.id === id); // Objeto del usuario eliminado solo para mostrarlo
                
                        // Ahora vamos a buscar las ventas asociadas a ese usuario
                        let ventasAEliminar = Ventas.filter(x => x.id_usuario === id); // Array para tener los ids asociados a las ventas del usuario
                
                        // Con estos ids vamos a eliminar las ventas del usuario
                        const VentasActualizado = Ventas.filter(venta => {
                            // Comprobamos si el id de la venta actual NO está presente en el array de ventas a eliminar
                            return !ventasAEliminar.some(ventaAEliminar => venta.id === ventaAEliminar.id);
                        });
                
                        // Obtenemos el índice del usuario a eliminar
                        let indice = usuarios.findIndex(x => x.id === id);
                
                        // Cortamos el array con splice usando el índice obtenido
                        usuarios.splice(indice, 1);
                        //  timeout para ver si la escritura tarda demasiado , por que se me quedaba bloqueado el postman 
                        const timeout = setTimeout(() => {
                            res.status(500).json({ error: 'La escritura del archivo está tardando demasiado.' });
                        }, 10000); // 10 segundos


                        // Sobreescribimos el JSON de usuarios
                        await  writeFile('./Data/usuarios.json', JSON.stringify(usuarios, null, 2))
                          
                        
                         
                        
                        
                         

                        // Sobreescribimos el JSON de ventas
                        await writeFile('./Data/ventas.json', JSON.stringify(VentasActualizado, null, 2))
                
                        // Si se terminó correctamente, cancelamos el timeout
                        clearTimeout(timeout); 
                           
                        res.status(200).json(UsuarioEliminado); // Devolvemos una respuesta con el usuario eliminado
                         console.log("Eliminación exitosa, se eliminó el siguiente usuario:");
                         console.log(UsuarioEliminado); // Lo mostramos por consola también


                         // Si no hay error, mandamos la respuesta satisfactoria
                         console.log("Eliminación exitosa, se eliminaron las ventas del usuario eliminado");
                         ventasAEliminar.forEach(venta => {
                             console.log(`Id venta eliminada: ${venta.id}`);
                         });
                         console.log("Procedimiento terminado");
                
                    } catch (error) {
                        
                        console.error('Error al procesar la solicitud:', error);
                        res.status(500).json({ error: 'Hubo un problema al procesar la solicitud' });
                    }
                });
                
                

/* Exportar la ruta*/

export default router