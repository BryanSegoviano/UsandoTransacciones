let mysql = require('mysql');
let conexion = mysql.createConnection({
 host: 'localhost',
 user: 'root',
 password: 'isaaca14',
 database: 'ejerciciotransacciones'
});

class insertarVenta {

 registrarVenta(iva, total, listaProductos) {
  return new Promise((resolve, reject) => {
   //Timeout de ejemplo para simular asincronia
   setTimeout(() => {
    let consulta = "INSERT into ventas (IVA, total)  VALUES (?,?)";
    conexion.query(consulta, [iva, total], (err, results) => {
     if (err) {
      reject(err);
      return conexion.rollback(() => { throw err });
     } else {
      return conexion.commit((err) => {
       if (err) {
        return conexion.rollback(() => { throw err });
       } else {
        this.guardarVentaProducto(listaProductos, results.insertId);
       }
      });
     }
    });
   }, 1000);
  });
 }

 consultarProductos(cantidad) {
  return new Promise((resolve, reject) => {
   //Timeout de ejemplo para simular asincronia
   setTimeout(() => {
    let consulta = "SELECT * FROM productos WHERE cantidad <= ?;"
    this.#realizarConexion();
    conexion.query(consulta, [cantidad], (err, results) => {
     if (err) {
      reject(err);
     } else {
      resolve(results);
     }
    });
   }, 1000);
  });
 }

 guardarVentaProducto(listaProductos, idVenta) {
  let cantidadVendida = 0;
  let precioVenta = 0;
  let total = 0;
  let iva = 0;
  for (let i = 0; i < listaProductos.length; i++) {
   cantidadVendida = listaProductos[i].cantidad;
   total = listaProductos[i].precio * cantidadVendida;
   iva = (listaProductos[i].precio * 0.16) * cantidadVendida;
   precioVenta = total + iva;
   console.log('\n' + listaProductos[i].nombre);
   console.log('Cantidad: ' + cantidadVendida);
   console.log('Subtotal: ' + total);
   console.log('IVA: ' + iva);
   console.log('Precio total: ' + precioVenta + '\n-------------------');
   let consulta = "INSERT into rel_productosventas (cantidadvendida, precioventa, subtotal, idproducto, idventa)  VALUES (?,?,?,?,?)"
   conexion.query(consulta, [cantidadVendida, precioVenta, total, listaProductos[i].idproducto, idVenta], (err, results) => {
    if (err) {
     console.log(err);
     return conexion.rollback(() => { throw err });
    } else {
     precioVenta = 0;
     return conexion.commit((err) => {
      if (err) {
       return conexion.rollback(() => { throw err });
      } else {
       console.log('\nSe guardo la venta ' + (i + 1) + ' correctamente');
      }
     });
    }
   });
  }
 }

 #realizarConexion() {
  conexion.connect(err => {
   if (err) {
    console.log(err);
    return false;
   } else {
    console.log('BD Conectada');
    return true;
   }
  });
 }

 #desconectarConexion() {
  conexion.end(err => {
   if (err) {
    console.log(err);
   } else {
    console.log('BD Desconectada');
   }
  });
 }
}

module.exports = insertarVenta;