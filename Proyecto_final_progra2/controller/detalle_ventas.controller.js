// importamos db los modelos en este caso si tenemos uno o mas, se puede referenciar db."nombreModelo".   
const db = require("../models");
const Detalle_ventas = db.d_ventas;
const Op = db.Sequelize.Op;

// Create and Save a new Client
exports.create = async (req, res) => {
    // Validamos que dentro del  request no venga vacio el nombre, de lo contrario returna error
    if (!req.body.id_detalle) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    const VentaID = await db.ventas.findByPk(req.body.id_venta);
    const InventarioID = await db.i_boletos.findByPk(req.body.id_inventario);
    const clienteID = await db.cliente.findByPk(req.body.id_cliente);

    if(!VentaID){

        res.status(404).send({
            message: "esa venta no existe"
        });
        return;
    }

    if(!InventarioID){

        res.status(404).send({
            message: "no esta en el inventario"
        });
        return;
    }

    if(!clienteID){

        res.status(404).send({
            message: "no existe dicho cliente"
        });
        return;
    }

    const detalle_ventas = {
        id_detalle: req.body.id_detalle,
        id_venta: req.body.id_venta,
        id_inventario: req.body.id_inventario,
        id_cliente: req.body.id_cliente, 
        cantidad: req.body.cantidad,
        precio: req.body.precio_unitario,
        subtotal: req.body.subtotal
    };

    // Save a new Client into the database
    Detalle_ventas.create(detalle_ventas)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Client."
            });
        });
};

// Retrieve all Client from the database.
exports.findAll = (req, res) => {
    const nombre = req.query.id_detalle;
    var condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;

    Detalle_ventas.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving clients."
            });
        });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Detalle_ventas.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Detalle_ventas with id=" + id
            });
        });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Detalle_ventas.update(req.body, {
        where: { id_detalle: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Detalle_ventas was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Client with id=${id}. Maybe Client was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Client with id=" + id
            });
        });
};

// Delete a Client with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    // utilizamos el metodo destroy para eliminar el objeto mandamos la condicionante where id = parametro que recibimos 
    Detalle_ventas.destroy({
        where: { id_detalle: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Client was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Client with id=${id}. El Detalle_ventas no fue encontado!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Tutorial with id=" + id
            });
        });
};

// Delete all Clients from the database.
exports.deleteAll = (req, res) => {
    Detalle_ventas.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Clients were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all clients."
            });
        });
};

