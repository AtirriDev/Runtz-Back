
import { Console } from 'console'
import { readFile } from 'fs/promises'
import { json } from 'stream/consumers'

const archivoUsuarios  = await readFile('./Data/usuarios.json' , 'utf-8')

const archivoProductos = await readFile('./Data/productos.json' , 'utf-8')

const archivoVentas = await readFile('./Data/ventas.json' , 'utf-8')

const Usuarios = JSON.parse(archivoUsuarios)
const Productos = JSON.parse(archivoProductos)
const Ventas = JSON.parse(archivoVentas)


console.log(Usuarios)


   