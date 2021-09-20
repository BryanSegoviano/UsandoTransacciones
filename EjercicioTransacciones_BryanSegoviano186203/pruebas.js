let insertarVenta = require('./insertarVenta.js');
let puntoVenta = new insertarVenta();

let listaProductos;

//Se llena una lista de productos consultados de la BD
puntoVenta.consultarProductos(3)
 .then((results) => {
  listaProductos = results;
  datosVenta();
 })
 .catch((err) => console.log(err));

//Se realiza la venta con base a esos productos establecidos
function datosVenta() {
 let total = 0;
 let iva = 0;
 for (let i = 0; i < listaProductos.length; i++) {
  total += listaProductos[i].precio * listaProductos[i].cantidad;
  iva += ((listaProductos[i].precio * listaProductos[i].cantidad) * 0.16);
 }
 puntoVenta.registrarVenta(iva, total, listaProductos);
}

