import dotenv from 'dotenv';
dotenv.config(); // Cargar .env

console.log("MONGODB_URI cargada:", process.env.MONGODB_URI); // Verificación

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI no existe");
}

let cache = global.mongoose || { conn: null, promise: null };

export const conexionDataBase = async () => {
    if (cache.conn) return cache.conn;

    cache.promise = cache.promise || mongoose.connect(MONGODB_URI, {
        dbName: 'RUNTZ_DB',
        bufferCommands: false
    });

    cache.conn = await cache.promise;
    return cache.conn;
};