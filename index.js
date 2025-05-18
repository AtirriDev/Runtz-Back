// Importaciones 
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import { json } from 'stream/consumers'


// vamos a importar las rutas

import userRouter from './Routes/Usuarios.routes.js'
import ProdRouter from './Routes/Productos.routes.js'
import VentasRouter from './Routes/Ventas.routes.js'

// Traer variable de entorno 

dotenv.config()

// Instanciar express

const app = express()


// Trabajar con Json 

app.use(express.json())

// Configuracion de puerto 

const port = process.env.port || 5555 // traemos el puerto que tenemos en el archivo .env , si no lo encuentra va a poner 3000 como puerto de defecto 



app.use(cors({
    // vinculamos al front
    origin: 'http://127.0.0.1:5500'
}))


// levantar el servidor 

app.listen(port , ()=> {
    console.log(`Servidor levantada en puerto ${port}`)
})


// Usar las rutas

app.use('/Usuarios', userRouter);   
app.use('/Productos' , ProdRouter)
app.use('/Ventas' , VentasRouter)

      






   







