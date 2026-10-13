
const dbConfig = require("../config/db.config.js");


const Sequelize = require("sequelize");


const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,            
  dialect: dbConfig.dialect,      

  dialectOptions: {
    ssl: {
      require: true,              
      rejectUnauthorized: false   
    }
  },

  
  pool: {
    max: dbConfig.pool.max,       
    min: dbConfig.pool.min,       
    acquire: dbConfig.pool.acquire, 
    idle: dbConfig.pool.idle      
  }
});


const db = {};


db.Sequelize = Sequelize;


db.sequelize = sequelize;


db.usuario = require("./usuario.model.js")(sequelize, Sequelize);
db.artista = require("./artista.model.js")(sequelize, Sequelize);
db.concierto = require("./conciertos.model.js")(sequelize, Sequelize);
db.localidades = require("./localidades.model.js")(sequelize, Sequelize);
db.i_boletos = require("./inventario_boletos.model.js")(sequelize, Sequelize);
db.ventas = require("./ventas.model.js")(sequelize, Sequelize);
db.d_ventas = require("./detalle_ventas.model.js")(sequelize, Sequelize);
db.cliente = require("./cliente.model.js")(sequelize, Sequelize);

//foreing de detaqlle venta
db.ventas.hasMany(db.d_ventas,{foreignKey: "id_venta"});
db.d_ventas.belongsTo(db.ventas,{foreignKey: "id_venta"});

db.i_boletos.hasMany(db.d_ventas,{foreignKey: "id_inventario"});
db.d_ventas.belongsTo(db.i_boletos,{foreignKey: "id_inventario"});

db.cliente.hasMany(db.d_ventas,{foreignKey: "id_cliente"});
db.d_ventas.belongsTo(db.cliente,{foreignKey: "id_cliente"});


//foreing de cociertos
db.artista.hasMany(db.concierto, {foreignKey: "id_artista"});
db.concierto.belongsTo(db.artista, {foreignKey: "id_artista"});

//foreing de inventario boletos
db.concierto.hasMany(db.i_boletos, {foreignKey: "id_concierto"});
db.i_boletos.belongsTo(db.concierto, {foreignKey: "id_concierto"});

db.localidades.hasMany(db.i_boletos, {foreignKey: "id_localidad"});
db.i_boletos.belongsTo(db.localidades, {foreignKey: "id_localidad"});

//foreing de ventas
db.usuario.hasMany(db.ventas, {foreignKey: "id_vendedor"});
db.ventas.belongsTo(db.usuario, {foreignKey: "id_vendedor"});


module.exports = db;