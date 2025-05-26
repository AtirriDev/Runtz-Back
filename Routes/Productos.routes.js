/* Aca vamos a trabajar todas las rutas que tengan que ver con los usuarios */
import { Router } from "express";
import { readFile, writeFile } from 'fs/promises'
import { ObtenerTodos , AgregarProducto , BuscarPorCategoria } from "../database/actions/productos.actions.js";
import Producto from "../database/schemas/productos.schema.js";


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
                const productos = await ObtenerTodos();
                console.log(productos)
            
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
                  const productos = await ObtenerTodos();
                  console.log(productos)
                  const ProductosDisponibles = productos.filter( x => x.disponible === true)
              
    
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

       
        
         // traer producto por categorias 
        router.post('/categorias', async (req,res)=>{
            // obtenemos la categoria que la van a mandar por el body
            const categoria = req.body.categoria;
            console.log("Vamos a atrar productos con la categoria : " + categoria )
            

            // FILTRAMOS POR CATEGORIA 

            const ProdCategorias = await BuscarPorCategoria(categoria)
          
            // VALIDAMOS , en teoria no va a fallar por que yo mismo mando por el body la categoria pero bueno no viene mal validar
            if (!ProdCategorias) {
                  // Si no lo es, mandamos la respuesta de error
                res.status(400).json("No hay articulos con esa categoria");
                console.log("Error: categoria no válida");
                return;
            }

            // mandamos la respuesta
            res.status(200).json(ProdCategorias)
            
        })

    

    // nuevo add
    router.post('/add', async (req, res) => {
        try {

           
            // Solo usás los campos que realmente necesitás del body
            const articulo = {
                marca: req.body.marca,
                producto: req.body.producto,
                categoria: req.body.categoria,
                imagen: req.body.imagen,
                precio: req.body.precio,
                disponible: true
            }

            console.log(articulo)
             // Verificamos que sea válido el artículo a agregar          
             if (!articulo) {
               
                // Si no lo es, mandamos la respuesta de error
                res.status(400).json("No hay ningún artículo para agregar");
                console.log("Error: artículo no válido");
                return;
                

            }

           
            
           

            // Guardar en la DB
            const nuevoProducto = await AgregarProducto(articulo);

            return res.status(201).json(nuevoProducto);
            
        } catch (error) {
            console.error('Error al agregar producto:', error.message);
            res.status(500).json({ error: 'Error interno al agregar el producto' });
        }
});
    

// Rutas Delete
        // vamos a eliminar un producto 
        router.delete("/delete/:id", async (req, res) => {
            try {
                 const productos = await ObtenerTodos();
                
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
