module.exports = app => {
    const inventario_boletos = require("../controller/inventario_boletos.controller.js");
    var router = require("express").Router();
    
    
    
    router.get("/", inventario_boletos.findAll);
    
   

    router.get("/:id", inventario_boletos.findOne);

    router.get("/BuscarConcierto/:id", inventario_boletos.EncontrarPorConcierto);
   


    app.use("/api/inventario_boletos", router);
};