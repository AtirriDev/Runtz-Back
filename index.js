// Importaciones 
import express from 'express'
import dotenv from 'dotenv'
import { Console } from 'console'
import { readFile } from 'fs/promises'
import { json } from 'stream/consumers'
import { writeFile } from 'fs'

// Traer variable de entorno 

dotenv.config()

// Instanciar express

const app = express()


// Trabajar con Json 

app.use(express.json())

// Configuracion de puerto 

const port = process.env.port || 5555 // traemos el puerto que tenemos en el archivo .env , si no lo encuentra va a poner 3000 como puerto de defecto 

// levantar el servidor 

app.listen(port , ()=> {
    console.log(`Servidor levantada en puerto ${port}`)
})

// Datos para trabajar 
const archivoUsuarios  = await readFile('./Data/usuarios.json' , 'utf-8')

const archivoProductos = await readFile('./Data/productos.json' , 'utf-8')

const archivoVentas = await readFile('./Data/ventas.json' , 'utf-8')

const Usuarios = JSON.parse(archivoUsuarios)
const Productos = JSON.parse(archivoProductos)
const Ventas = JSON.parse(archivoVentas)


// Definicion de rutas 

//Rutas Get 

    // Traer todos los productos 
    app.get('/Productos',(req , res)=> {

        res.send(Productos)

    })

    //Traer los productos disponibles 
    app.get('/Productos/disponibles' , (req , res)=> 
        {
            

            const ProductosDisponibles = Productos.filter( x => x.disponible === true)
          

            // devolvemos en la respuesta 
            if (ProductosDisponibles) {
                res.status(200).json(ProductosDisponibles)
            }else
            {
                res.send(400).json('No hay productos disponibles')
            }
        })
    // traer todos los usuarios 
    app.get('/Usuarios' , (req,res) =>
    {

        res.status(400).json(Usuarios)




    })

    // traer todas las ventas 
    app.get('/Ventas' , (req,res) =>
        {
    
            res.status(400).json(Ventas)
    
    
    
    
        })
//Rutas Post
    //Traer todas las ventas de un usuario especifico , con post 
    app.post('/Ventas' , (req,res)=> 
        {
            // sacamos el id del usuario del body
            const idUsuario = parseInt(req.body.id);
            // lo mostramos en consola a ver si lo trae bien 
            console.log('Id recibido : ' , idUsuario)
            let usuarioVenta = Usuarios.find(x => x.id === idUsuario)
            let NombreCompleto = " ";
            if (usuarioVenta) {
                 NombreCompleto = usuarioVenta.nombre + " " + usuarioVenta.apellido
                console.log(NombreCompleto)
            }else
            {
                res.status(400).json(`Usuario no encontrado`)
                console.log(`El usuario con el id : ${idUsuario} no se encuentra registrado `)
                return
            } 
            
           

            let VentasPorUsuario = Ventas.filter(x => x.id_usuario === idUsuario)

            //VERIFICAMOS QUE SEA VALIDO
            if (VentasPorUsuario.length > 0) {
                res.status(200).json(VentasPorUsuario)
            }else{
                res.status(400).json(`El usuario ${NombreCompleto} no tiene compras asociadas`)
            }




        })

        // Vamos a agregar un Producto nuevo 
        app.post('/Productos/add' , (req,res) => 
            {
               // creamos la constante de producto y le pasamos los campos del body 

               const articulo = {
                    id : parseInt(req.body.id) ,
                    nombre : req.body.nombre,
                    desc : req.body.desc,
                    precio: req.body.precio,
                    imagen: req.body.img ,
                    disponible: "true" 
                }
                console.log(articulo)
              
                 // verificamos que sea valido el articulo a agregar          
                if (!articulo) {
                    // como no lo es mandamos la respuesta de error 
                    res.status(400).json("No hay ningún articulo para agregar");
                    console.log("Error: artículo no válido");
                    return;
                }
                // si no entro es valido asi que seguimos la ejecucion 

                Productos.push(articulo); // agregamos el articulo al arreglo productos 
              

                // Escritura del json , con el array actualizado 
                writeFile('./Data/productos.json', JSON.stringify(Productos, null, 2), (err) => {
                    // verificamos si hay un error
                    if (err) {
                        console.error('Error en la escritura del archivo json :', err); // lo mostramos en consola 
                        return res.status(500).json({ error: 'Error en la escritura del archivo json' }); //lo mandamos como respuesta
                    }
                    // si no hay error 
                    res.status(200).json(articulo); // devolvemos una respuesta con el articulo agregado 
                    console.log(articulo); // lo mostramos por consola tambien 
                });
                console.log("Operacion exitosa ")
            })

        // solicutud post para cargar una nueva venta 
        app.post("/Ventas/add" ,(req,res)=>{

            // obtejo venta 
            const venta = {
                id: parseInt(req.body.id),
                id_usuario: req.body.id_usuario,
                fecha: req.body.fecha,
                total: req.body.total,
                dirección: req.body.dirección,
                productos: req.body.productos
              }
              console.log("venta para procesar ")
              console.log(venta)

              // validacion de la venta
              if (!venta) {
                 // como no lo es mandamos la respuesta de error 
                 res.status(400).json("No existe ninguna venta")
                 console.log("No existe ninguna venta")
                 return; 
                
              }

              // si es valido seguimos la ejecucion
              Ventas.push(venta) // añadimos la venta al array ventas

              // sobreescribimos el archivo json con el array actualizado

              writeFile('./Data/ventas.json' , JSON.stringify(Ventas, null, 2 ), (err) =>{
                // verificamos si hay error 
                if (err) {
                    // mandamos el error 
                    console.error('Error en la escritura del archivo json :', err); // lo mostramos en consola 
                    return res.status(500).json({ error: 'Error en la escritura del archivo json' }); //lo mandamos como respuesta
                }

                // si no hay error mandamos la respuesta satisfactoria
                
                res.status(200).json(venta); // devolvemos una respuesta con la venta  agregada
                console.log("venta cargada")
                console.log(venta); // lo mostramos por consola tambien 
                console.log("Procedimiento terminado ")
              })






        })
        // Agregar un nuevo usuario 
        app.post("/Usuarios/add" ,(req,res)=>{

            // obtejo venta 
            const nuevoUsuario = {
                id: parseInt(req.body.id),
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                email: req.body.email,
                contraseña: req.body.contraseña
              }
              console.log("se va a agregar al usuario :")
              console.log(nuevoUsuario)

              // validacion de la venta
              if (!nuevoUsuario) {
                 // como no lo es mandamos la respuesta de error 
                 res.status(400).json("No hay usuario para agregar")
                 console.log("No hay usuario para agregar")
                 return; 
                
              }

              // si es valido seguimos la ejecucion
              Usuarios.push(nuevoUsuario) // añadimos la venta al array ventas

              // sobreescribimos el archivo json con el array actualizado

              writeFile('./Data/usuarios.json' , JSON.stringify(Usuarios, null, 2 ), (err) =>{
                // verificamos si hay error 
                if (err) {
                    // mandamos el error 
                    console.error('Error en la escritura del archivo json :', err); // lo mostramos en consola 
                    return res.status(500).json({ error: 'Error en la escritura del archivo json' }); //lo mandamos como respuesta
                }

                // si no hay error mandamos la respuesta satisfactoria
                
                res.status(200).json(nuevoUsuario); // devolvemos una respuesta con la venta  agregada
                console.log("Se agrego al usuario :")
                console.log(nuevoUsuario.nombre); // lo mostramos por consola tambien 
                console.log("Procedimiento terminado ")
              })






        })
//Rutas Put
        //vamos a actualizar los datos de un usuario 
        app.put("/Usuarios/update/:id" ,(req,res)=>{
            // tomar el id del usuario de la url
            const id = parseInt(req.params.id)

            // primero tenemos que ver que el id que nos mandan es de un usuario registrado

            const ExisteUsuario = Usuarios.find(x=> x.id === id)
            if (!ExisteUsuario) {
                // si no existe debemos mostrar el error y retornar
                console.log("El usuario no existe")
                res.status(400).json("El usuario no existe ")
                return
            }

            
            // vamos a tomar tomar el objeto completo del usuario del body , si algo se cambia se sobrescribe y listo 
            
            const UsuarioModificado = {
                id: id, // el id es lo unico que no se puede modificar 
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                email: req.body.email,
                contraseña: req.body.contraseña 
              }

             //AHORA TENEMOS QUE BUSCAR EN EL ARRAY EL LUGAR DEL USUARIO Y REEMPLAZARLO , MEDIANTE SU INDICE
             
             let indice = Usuarios.findIndex(x=> x.id === id) // aca obtenemos el indice
              
             Usuarios[indice] = UsuarioModificado ; // Reemplazamos al Usuario completo, para reflejar cambios 

             // sobreescribimos el json 
             writeFile('./Data/usuarios.json' , JSON.stringify(Usuarios, null, 2 ), (err) =>{
                // verificamos si hay error 
                if (err) {
                    // mandamos el error 
                    console.error('Error en la escritura del archivo json :', err); // lo mostramos en consola 
                    return res.status(500).json({ error: 'Error en la escritura del archivo json' }); //lo mandamos como respuesta
                }

                // si no hay error mandamos la respuesta satisfactoria
                
                res.status(200).json(Usuarios[indice]); // devolvemos una respuesta con el usuario modificado
                console.log("Modificacion exitosa ")
                console.log(Usuarios[indice]); // lo mostramos por consola tambien 
                console.log("Procedimiento terminado ")
              })

        })


// Rutas Delete
        // vamos a eliminar un producto 
        app.delete("/Productos/delete/:id" , (req,res)=>{

            // primero vamos a obtener el id del producto desde la url
            const id = parseInt(req.params.id)
            // verificamos que exista
            const ExisteProducto = Productos.find(x=> x.id == id)
            if (!ExisteProducto) {
                // si no existe debemos mostrar el error y retornar
                console.log("El producto no existe")
                res.status(400).json("El productoa no existe ")
                return
            }

            const ProductoEliminado = Productos.find(x=> x.id === id) // objeto del producto eliminado solo para mostrarlo
           
            // si existe seguimos 
            let indice = Productos.findIndex(x=> x.id === id) // obtenemos el indice del articulo a eliminar 
            
            // cortamos el array con splice usando el indice obtenido
            Productos.splice(indice,1) // va a sacar el elemento en ese indice , el 1 indica que elimina solo ese

            // sobreescribimos el json 
            writeFile('./Data/productos.json' , JSON.stringify(Productos, null, 2 ), (err) =>{
                // verificamos si hay error 
                if (err) {
                    // mandamos el error 
                    console.error('Error en la escritura del archivo json :', err); // lo mostramos en consola 
                    return res.status(500).json({ error: 'Error en la escritura del archivo json' }); //lo mandamos como respuesta
                }

                // si no hay error mandamos la respuesta satisfactoria
                
                res.status(200).json(ProductoEliminado); // devolvemos una respuesta con el usuario modificado
                console.log("Eliminacion exitosa , se elimino el siguiente producto : " )
                console.log(ProductoEliminado); // lo mostramos por consola tambien 
                console.log("Procedimiento terminado ")
              })

        })

        // eliminacion de usuario , importante al eliminar un usuario tambien se eliminan ventas vinculadas a el 
        app.delete("/Usuarios/delete/:id" , (req,res)=>{

            // primero vamos a obtener el id del usuario desde la url
            const id = parseInt(req.params.id)
            // verificamos que exista
            const ExisteUsuario= Usuarios.find(x=> x.id == id)
            if (!ExisteUsuario) {
                // si no existe debemos mostrar el error y retornar
                console.log("El usuario no existe")
                res.status(400).json("El usuario no existe ")
                return
            }
            const UsuarioEliminado = Usuarios.find(x=> x.id === id) // objeto del producto eliminado solo para mostrarlo
            // Ahora vamos a buscar las ventas asociadas a ese usuario

            let ventasAEliminar = Ventas.filter(x=> x.id_usuario === id) ; // array para tener los ids asociados a las ventas del usuario      
            
           
            
            // con estos ids vamos eliminar las ventas del usuario
            const VentasActualizado = Ventas.filter(venta => {
                // Comprobamos si el id de la venta actual NO está presente en el array de ventas a eliminar
                return !ventasAEliminar.some(ventaAEliminar => venta.id === ventaAEliminar.id);
              });

          

            let indice = Productos.findIndex(x=> x.id === id) // obtenemos el indice del usuario a eliminar 
            
            // cortamos el array con splice usando el indice obtenido
            Usuarios.splice(indice,1) 

            // sobreescribimos el json de usuarios 

            writeFile('./Data/usuarios.json' , JSON.stringify(Usuarios, null, 2 ), (err) =>{
                // verificamos si hay error 
                if (err) {
                    // mandamos el error 
                    console.error('Error en la escritura del archivo json :', err); // lo mostramos en consola 
                    return res.status(500).json({ error: 'Error en la escritura del archivo json' }); //lo mandamos como respuesta
                }

                // si no hay error mandamos la respuesta satisfactoria
                
                res.status(200).json(UsuarioEliminado); // devolvemos una respuesta con el usuario modificado
                console.log("Eliminacion exitosa , se elimino el siguiente usuario : " )
                console.log(UsuarioEliminado); // lo mostramos por consola tambien 
               
              })
              
              
            // sobreescribimos el json de ventas

            writeFile('./Data/ventas.json' , JSON.stringify(VentasActualizado, null, 2 ), (err) =>{
                // verificamos si hay error 
                if (err) {
                    // mandamos el error 
                    console.error('Error en la escritura del archivo json :', err); // lo mostramos en consola 
                    return res.status(500).json({ error: 'Error en la escritura del archivo json' }); //lo mandamos como respuesta
                }

                // si no hay error mandamos la respuesta satisfactoria
                
               
                console.log("Eliminacion exitosa , se eliminaron las ventas del usuario eliminado  " )
                
                ventasAEliminar.forEach(venta => {
                    console.log(`Id venta eliminada: ${venta.id}`);
                });
                console.log("Procedimiento terminado ")
              })

         


        })







   







   