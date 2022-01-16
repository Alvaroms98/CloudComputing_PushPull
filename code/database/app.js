const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: '127.0.0.1', 
     user:'root', 
     password: 'admin1234',
     database: 'pushpull',
     connectionLimit: 5
});

pool.getConnection()
    .then(conn => {
    
      conn.query("SELECT * FROM JSON_OBJECT")
        .then((rows) => {
          console.log(rows); //[ {val: 1}, meta: ... ]
          //Table must have been created before 
          // " CREATE TABLE myTable (id int, val varchar(255)) "
          //return conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
        })
        .catch(err => {
          //handle error
          console.log(err); 
          conn.end();
        })
        
    }).catch(err => {
      //not connected
    });