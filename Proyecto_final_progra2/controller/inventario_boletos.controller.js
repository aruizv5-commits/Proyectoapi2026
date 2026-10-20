// importamos db los modelos en este caso si tenemos uno o mas, se puede referenciar db."nombreModelo".   
const db = require("../models");
const I_boletos = db.i_boletos;
const Op = db.Sequelize.Op;

// Create and Save a new Client


// Retrieve all Client from the database.
exports.findAll = (req, res) => {
    const nombre = req.query.id_inventario;
    var condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;

    I_boletos.findAll({ where: condition })
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

    I_boletos.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving I_boletos with id=" + id
            });
        });
};

// Update a Tutorial by the id in the request

