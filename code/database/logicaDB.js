const mariadb = require('mariadb');
// const password = process.env.DB_PASSWORD || 'admin1234';
// const host = process.env.DB_HOST || '127.0.0.1';

// const pool = mariadb.createPool({
//   host: host,
//   user: 'root',
//   password: password,
//   database: 'pushpull',
//   connectionLimit: 5
// });

class Database {
  constructor(password, host) {
    console.log("**** Creando Pool ****");

    this.pool = mariadb.createPool({
      host: host,
      user: 'root',
      password: password,
      database: 'pushpull',
      connectionLimit: 5
    });
  }

  /**
   * Extrae todas las filas de la base de datos, creando una conexión
   * a base de datos de MariaDB se hace uso de `query()` para hacer una
   * consulta a la tabla correspondiente.
   * @returns Devuelve toda la data en la DB
   */
  async sacarTodo() {
    let conn;

    try {
      conn = await this.pool.getConnection();
      const rows = await conn.query("SELECT * FROM JSON_OBJECT");
      console.log("Devuelvo base de datos completa --- sacarTodo()");
      return rows;
    }
    catch (err) {
      throw new Error(err.message);
    }
    finally {
      if (conn) {
        conn.end();
      }
      //process.exit(0);
    }
  }

  /**
   * Extrae las filas de la base de datos que coinciden con el filtro enviado 
   * como argumento. Se crea una conexión a la base de datos de MariaDB
   * se hace uso de `query()` para hacer una consulta a la tabla correspondiente.
   * @param {*} args { propietario: name }
   * @returns Devuelve data de la DB filtradas por 'Propietario'
   */
  async buscarObjetoporPropietario(args) {
    let conn;

    try {
      //Convierto string a JSON y extraigo el propietario
      var propietario = JSON.parse(args);

      conn = await this.pool.getConnection();
      let myQuery = `SELECT * FROM JSON_OBJECT WHERE Propietario ='${propietario.propietario}'`;
      const rows = await conn.query(myQuery);
      console.log("Devuelvo datos de Propietario: --- ", propietario);
      return rows;

    }
    catch (err) {
      throw new Error(err.message);
    }
    finally {
      if (conn) {
        conn.end();
      }
      //process.exit(0);
    }
  }

  /**
   * Inserta objetos en la base de datos, cuando el objeto este bien construido.
   * Enviamos consulta de insertar usando el método `query()`
   * @param {*} args { propietario: name , objeto : {...} }
   * @returns Devuelme mensaje de confirmación de la base de datos o muestra 
   * el error en caso de fallo.
   */
  async guardarObjeto(args) {
    let conn;
    try {
      //Convierto string a JSON, extraigo datos [propietario, objeto]
      var body = JSON.parse(args);
      var propietario = body.propietario;
      var objeto = body.objeto;

      conn = await this.pool.getConnection();
      let myQuery = `INSERT INTO JSON_OBJECT VALUES (NULL, '${propietario}', '${JSON.stringify(objeto)}')`;
      const rta = await conn.query(myQuery);
      console.log("Insertando datos en la DB. Propietario: --- ", propietario);
      return rta;
    }
    catch (err) {
      throw new Error(err.message);
    }
    finally {
      if (conn) {
        conn.end();
      }
      //process.exit(0);
    }
  }

  /**
   * Busqueda de un registro en la base de datos filtrando por Id-
   * @param {*} args { id: id }
   * @returns Devuleve registro con identificador unico en base de datos.
   */
  async buscarPorID(args) {
    let conn;
    
    try {
      //Convierto string a JSON, extraigo id
      var id = JSON.parse(args);
      conn = await this.pool.getConnection();
      let myQuery = `SELECT * FROM JSON_OBJECT WHERE Id =${id.id}`;
      const rows = await conn.query(myQuery);
      console.log("Devuelvo datos objeto con ID --- ", id);
      return rows;
    }
    catch (err) { 
      throw new Error(err.message);
    }
    finally {
      if (conn) {
        conn.end();
      }
    }
  }

  async borrarTodo(){
    let conn;
    
    try {
      conn = await this.pool.getConnection();
      const rows = await conn.query('DELETE FROM JSON_OBJECT');
      console.log("Borrando toda la data de JSON_Object");
      return rows;
    }
    catch (err) {
      throw new Error(err.message);
    }
    finally {
      if (conn) {
        conn.end();
      }
    }
  }

  async borrarPropietario(args){
    let conn;
   
    try {
      //Convierto string a JSON y extraigo el propietario
      var propietario = JSON.parse(args);

      conn = await this.pool.getConnection();
      let myQuery = `DELETE FROM JSON_OBJECT WHERE Propietario ='${propietario.propietario}'`;
      const rows = await conn.query(myQuery);
      console.log("Eliminando datos del propietario: --- ", propietario);
      return rows;
    }
    catch (err) {
      throw new Error(err.message);
    }
    finally {
      if (conn) {
        conn.end();
      }
    }

  }


  async borrarPorID(args){
    let conn;
    try {
      //Convierto string a JSON, extraigo id
      var id = JSON.parse(args);
      conn = await this.pool.getConnection();
      let myQuery = `DELETE FROM JSON_OBJECT WHERE Id =${id.id}`;
      const rows = await conn.query(myQuery);
      console.log("Eliminando objeto con ID --- ", id);
      return rows;
    }
    catch (err) {
      throw new Error(err.message);
    }
    finally {
      if (conn) {
        conn.end();
      }
    }
  }

}

module.exports.Database = Database;

