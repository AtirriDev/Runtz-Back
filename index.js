import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { conexionDataBase } from './database/conexion.db.js'; // Import de la base de datos 
import userRouter from './Routes/Usuarios.routes.js';
import ProdRouter from './Routes/Productos.routes.js';
import VentasRouter from './Routes/Ventas.routes.js';

dotenv.config(); // Siempre primero

const app = express();
const port = process.env.port || 5555;

app.use(express.json());

app.use(cors({
  origin: 'http://127.0.0.1:5500'
}));

// Conectarse a la bd e iniciar el servidor 
const IniciarServidor = async () => {
  try {
    await conexionDataBase(); // 👈 SOLO ACÁ
    console.log("Base de datos conectada");

    // Rutas después de conectar
    app.use('/Usuarios', userRouter);
    app.use('/Productos', ProdRouter);
    app.use('/Ventas', VentasRouter);

    app.listen(port, () => {
      console.log(`Servidor levantado en puerto ${port}`);
    });

  } catch (err) {
    console.error("Error al conectar la base de datos:", err);
    process.exit(1);
  }
};

IniciarServidor(); // iniciamos el servidor 


      






   







