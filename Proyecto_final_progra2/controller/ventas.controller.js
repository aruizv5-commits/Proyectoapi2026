// importamos db los modelos en este caso si tenemos uno o mas, se puede referenciar db."nombreModelo".   
const db = require("../models");
const Ventas = db.ventas;
const Op = db.Sequelize.Op;

// Create and Save a new Client
exports.create = async (req, res) => {
    // Validamos que dentro del  request no venga vacio el nombre, de lo contrario returna error
    if (!req.body.id_vendedor) {
        res.status(400).send({
            message: "Content can not be empty! venta"
        });
        return;
    }

    const VendedorID = await db.usuario.findByPk(req.body.id_vendedor);

    if(!VendedorID){

        res.status(404).send({
            message: "esa vendedor no existe"
        });
        return;
    }

    const ventas = {
        id_vendedor: req.body.id_vendedor,
        fecha_venta: req.body.fecha_venta, 
        total_venta: req.body.total_venta

    };

    // Save a new Client into the database
    Ventas.create(ventas)
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
    const nombre = req.query.id_venta;
    var condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;

    Ventas.findAll({ where: condition })
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

    Ventas.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Ventas with id=" + id
            });
        });
};


