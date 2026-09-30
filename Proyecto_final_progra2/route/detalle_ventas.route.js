module.exports = app => {
    const detalle_ventas = require("../controller/detalle_ventas.controller.js");
    var router = require("express").Router();
    
    router.post("/create/", detalle_ventas.create);
    
    router.get("/", detalle_ventas.findAll);
    
    router.get("/status", detalle_ventas.findAllStatus);

    router.get("/:id", detalle_ventas.findOne);
   
    router.put("/update/:id", detalle_ventas.update);
   
    router.delete("/delete/:id", detalle_ventas.delete);

    router.delete("/delete/", detalle_ventas.deleteAll);

    app.use("/api/detalle_ventas", router);
};