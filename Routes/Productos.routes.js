/* Aca vamos a trabajar todas las rutas que tengan que ver con los usuarios */
import { Router } from "express";
import { readFile, writeFile } from 'fs/promises'


// constante de router para exportar 
const router = Router()


// Obtener datos 
const GetProductos = async() => {
    const archivoProductos = await readFile('./Data/productos.json' , 'utf-8')
    return JSON.parse(archivoProductos) // obtenemos los productos
} 


/* Rutas GET */
    // Traer todos los productos 
     //
     router.get('/' , async (req,res) =>
        {
            try {
                const productos = await GetProductos();
            
            
                if (productos) {
                    res.status(200).json(productos)
                }else{
                    res.status(400).json({status:false}) // devolvemos un json con status : false 
                }
                
            } catch (error) {
                console.error('Error al procesar la solicitud:', error);
                res.status(500).json({ error: 'Hubo un problema al procesar la solicitud' });
            }
           
    
    
    
    
        })
    

     //Traer los productos disponibles // esta ruta no va a ser usada en el proyecto real 
     router.get('/disponibles' , async (req , res)=> 
        {
            try {
                const Productos = await GetProductos();
                const ProductosDisponibles = Productos.filter( x => x.disponible === true)
              
    
                // devolvemos en la respuesta 
                if (ProductosDisponibles) {
                    res.status(200).json(ProductosDisponibles)
                }else
                {
                    res.send(400).json('No hay productos disponibles')
                }
            } catch (error) {
                console.error('Error al procesar la solicitud:', error);
                res.status(500).json({ error: 'Hubo un problema al procesar la solicitud' });
            }
           
        })

    
/* Rutas POST */

        // traer producto por cagetegorias 
        router.post('/', async (req,res)=>{
            // obtenemos la categoria que la van a mandar por el body
            const categoria = req.body.categoria;

            // obtenemos todos los productos 

            const productos = await GetProductos() ;

            // FILTRAMOS POR CATEGORIA 
            const ProdcutosCategorias = productos.filter(prod => prod.categoria === categoria)

            // VALIDAMOS , en teoria no va a fallar por que yo mismo mando por el body la categoria pero bueno no viene mal validar
            if (!ProdcutosCategorias) {
                  // Si no lo es, mandamos la respuesta de error
                res.status(400).json("No hay articulos con esa categoria");
                console.log("Error: categoria no válida");
                return;
            }

            // mandamos la respuesta
            res.status(200).json(ProdcutosCategorias)
            
        })
    

    // Vamos a agregar un Producto nuevo 
    router.post('/add', async (req, res) => {
        try {
            const Productos = await GetProductos();
            
            // Creamos la constante de producto y le pasamos los campos del body
            const articulo = {
                id: parseInt(req.body.id),
                nombre: req.body.nombre,
                desc: req.body.desc,
                precio: req.body.precio,
                imagen: req.body.img,
                disponible: "true"
            };

             // Verificamos que sea válido el artículo a agregar          
             if (!articulo) {
               
                // Si no lo es, mandamos la respuesta de error
                res.status(400).json("No hay ningún artículo para agregar");
                console.log("Error: artículo no válido");
                return;
                

            }

           
            // verificamos si existe el producto con el id para no duplicar 
            const yaExiste = Productos.some(element => element.id === articulo.id);
            // si existe mandamos un return con el error 
            if (yaExiste) {
                console.log("No se puede agregar el producto por que su id ya existe en stock ");
                return res.status(400).json("Numero de articulo ya existente");
                
            }
           
           
            console.log("Articulo a agregar");
            console.log(articulo)

            // Si es válido, seguimos la ejecución
            Productos.push(articulo); // Agregamos el artículo al arreglo productos

            //  timeout para ver si la escritura tarda demasiado , por que se me quedaba bloqueado el postman 
            const timeout = setTimeout(() => {
                res.status(500).json({ error: 'La escritura del archivo está tardando demasiado.' });
            }, 10000); // 10 segundos

            // Escritura del JSON, con el array actualizado
           await writeFile('./Data/productos.json', JSON.stringify(Productos, null, 2));
                
                
            // Si se terminó correctamente, cancelamos el timeout
            clearTimeout(timeout);
            // Si no hay error, devolvemos una respuesta con el artículo agregado
            res.status(200).json(articulo); // Devolvemos una respuesta con el artículo agregado
            
            

            console.log("Operación exitosa");
               
                
               
            

            
        } catch (error) {
           
            console.error('Error al procesar la solicitud:', error);
            res.status(500).json({ error: 'Hubo un problema al procesar la solicitud' });
        }
    });
    

// Rutas Delete
        // vamos a eliminar un producto 
        router.delete("/delete/:id", async (req, res) => {
            try {
                const Productos = await GetProductos();
                
                // Obtenemos el id del producto desde la URL
                const id = parseInt(req.params.id);
        
                // Verificamos que exista
                const ExisteProducto = Productos.find(x => x.id == id);
                if (!ExisteProducto) {
                    // Si no existe, mostramos el error y retornamos
                    console.log("El producto no existe");
                    res.status(400).json("El producto no existe");
                    return;
                }
        
                const ProductoEliminado = Productos.find(x => x.id === id); // Objeto del producto eliminado solo para mostrarlo
        
                // Si existe, seguimos
                let indice = Productos.findIndex(x => x.id === id); // Obtenemos el índice del artículo a eliminar
        
                // Cortamos el array con splice usando el índice obtenido
                Productos.splice(indice, 1); // Elimina el elemento en ese índice, el 1 indica que elimina solo ese
        
                
                //  timeout para ver si la escritura tarda demasiado , por que se me quedaba bloqueado el postman 
                const timeout = setTimeout(() => {
                    res.status(500).json({ error: 'La escritura del archivo está tardando demasiado.' });
                }, 10000); // 10 segundos

                // Sobreescribimos el JSON
                await writeFile('./Data/productos.json', JSON.stringify(Productos, null, 2));
                
                // Si se terminó correctamente, cancelamos el timeout
                 clearTimeout(timeout);

                 // Si no hay error, mandamos la respuesta satisfactoria
                    res.status(200).json(ProductoEliminado); // Devolvemos una respuesta con el producto eliminado
                    console.log("Eliminación exitosa, se eliminó el siguiente producto: ");
                    console.log(ProductoEliminado); // Lo mostramos por consola también 
                    console.log("Procedimiento terminado ");
            } catch (error) {
                // Manejo de errores
                console.error('Error al procesar la solicitud:', error);
                res.status(500).json({ error: 'Hubo un problema al procesar la solicitud' });
            }
        });
        


/* Exportar la ruta*/

export default router
