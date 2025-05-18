/* Aca vamos a trabajar todas las rutas que tengan que ver con los usuarios */
import { Router } from "express";
import { readFile, writeFile } from 'fs/promises'


// constante de router para exportar 
const router = Router()



// Obtener datos 
const GetVentas = async() => {
    const archivoVentas  = await readFile('./Data/ventas.json' , 'utf-8') 
    return JSON.parse(archivoVentas) 

} 

// Obtener datos 
const GetUsuarios = async() => {
    const archivoUsuarios  = await readFile('./Data/usuarios.json' , 'utf-8') 
    return JSON.parse(archivoUsuarios) 

} 


/*Rutas GET */

 // traer todas las ventas 
 router.get('/' ,async (req,res) =>
    {
        try {
               const ventas = await GetVentas()
                
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
         //** si se prueba con  el usuario 3 se valida que no tiene ventas  */
            router.post('/', async (req, res) => {
                try {
                    // Obtenemos las ventas y los usuarios
                    const Ventas = await GetVentas();
                    const Usuarios = await GetUsuarios();

                    // Sacamos el id del usuario del body
                    const idUsuario = parseInt(req.body.id);
                    console.log('Id recibido : ', idUsuario);

                    // Buscamos el usuario en el array de usuarios
                    let usuarioVenta = Usuarios.find(x => x.id === idUsuario);

                    let NombreCompleto = " ";
                    if (usuarioVenta) {
                        NombreCompleto = usuarioVenta.nombre + " " + usuarioVenta.apellido;
                        console.log(NombreCompleto);
                    } else {
                        res.status(400).json(`Usuario no encontrado`);
                        console.log(`El usuario con el id : ${idUsuario} no se encuentra registrado `);
                        return;
                    }

                    // Filtramos las ventas del usuario
                    let VentasPorUsuario = Ventas.filter(x => x.id_usuario === idUsuario);

                    // Verificamos si el usuario tiene ventas asociadas
                    if (VentasPorUsuario.length > 0) {
                        res.status(200).json(VentasPorUsuario);
                    } else {
                        res.status(400).json(`El usuario ${NombreCompleto} no tiene operaciones asociadas`);
                    }

                } catch (error) {
                  
                    console.error('Error al procesar la solicitud:', error);
                    res.status(500).json({ error: 'Hubo un problema al procesar la solicitud' });
                }
            });



          // NUEVA VENTA
          router.post("/add", async (req, res) => {
            try {
                const Ventas = await GetVentas();

                // Obtener el último ID y sumarle 1
                const lastId = Ventas.length > 0 ? Math.max(...Ventas.map(u => u.id)) : 0; // si no hay usuario le asigna el valor cero 
                const nuevoId = lastId + 1; // aca se le suma uno al ultimo id para que sea el id del nuevo usuario 
                // Obtenemos la venta
                const venta = {
                    id: nuevoId,
                    id_usuario: req.body.id_usuario,
                    fecha: req.body.fecha,
                    total: req.body.total,
                    dirección: req.body.dirección,
                    productos: req.body.productos
                };
        
                console.log("venta para procesar ");
                console.log(venta);
                console.log("Vamos a escribir el archivo");
        
                // Validación de la venta
                if (!venta) {
                    // Como no lo es, mandamos la respuesta de error
                    res.status(400).json("No existe ninguna venta");
                    console.log("No existe ninguna venta");
                    return;
                }
        
                // Si es válido, seguimos con la ejecución
                Ventas.push(venta); // Añadimos la venta al array de ventas
        
                //  timeout para ver si la escritura tarda demasiado , por que se me quedaba bloqueado el postman 
                const timeout = setTimeout(() => {
                    res.status(500).json({ error: 'La escritura del archivo está tardando demasiado.' });
                }, 10000); // 10 segundos
        
                // Sobreescribimos el archivo JSON con el array actualizado
                await writeFile('./Data/ventas.json', JSON.stringify(Ventas, null, 2)); // Usamos await para esperar que se termine la escritura
        
                // Si se terminó correctamente, cancelamos el timeout
                clearTimeout(timeout);
        
                // Respondemos con la venta agregada
                res.status(200).json(venta); // Devolvemos una respuesta con la venta agregada
                console.log("venta cargada");
                console.log(venta); // Lo mostramos por consola también
                console.log("Procedimiento terminado");
        
            } catch (err) {
                console.error('Error en la escritura del archivo json :', err); // Mostramos el error en consola
                res.status(500).json({ error: 'Error en la escritura del archivo json' }); // Mandamos el error como respuesta
            }
        });

/*Exportamos */

export default router