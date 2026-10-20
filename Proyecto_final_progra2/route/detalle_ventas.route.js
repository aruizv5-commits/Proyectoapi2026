module.exports = app => {
    const detalle_ventas = require("../controller/detalle_ventas.controller.js");
    var router = require("express").Router();
    
    router.post("/create/", detalle_ventas.create);
    
    router.get("/", detalle_ventas.findAll);
    
   

    router.get("/:id", detalle_ventas.findOne);
   
    
   
    router.delete("/delete/:id", detalle_ventas.delete);

   

    app.use("/api/detalle_ventas", router);
};