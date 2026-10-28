// importamos db los modelos en este caso si tenemos uno o mas, se puede referenciar db."nombreModelo".   
const db = require("../models");
const Artista = db.artista;
const Op = db.Sequelize.Op;

// Create and Save a new Client
exports.create = (req, res) => {
    // Validamos que dentro del  request no venga vacio el nombre, de lo contrario returna error
    if (!req.body.nombre_artistico) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Client, definiendo una variable con la estructura del reques para luego solo ser enviada como parametro mas adelante. 
    const artista = {
        id_artista: req.body.id_artista,
        nombre_artistico: req.body.nombre_artistico,
        genero_musical: req.body.genero_musical,
        pais_origen: req.body.pais_origen
    };

    // Save a new Client into the database
    Artista.create(artista)
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
    const nombre = req.query.nombre_artistico;
    var condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;

    Artista.findAll({ where: condition })
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

    Artista.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Artista with id=" + id
            });
        });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Artista.update(req.body, {
        where: { id_artista: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Artista was updated successfully."
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

exports.BuscarNombre = async (req, res) => {

    try{
    const nombre = req.params.BuscarNombre;

    const artista = await Artista.findOne({
            where: {
                nombre_artistico: {
                    [Op.iLike]: `%${nombre.trim()}%` 
                }
            }
        });
 

        if(!artista || artista.length === 0){

        res.status(404).send({
            message: "esa no hay artista llamado: "+nombre
        });
        return;
    }

    res.status(200).send(artista);

    } catch(err){

        res.status(500).send({
            message: "error al buscar artista "
        });
    }
};

exports.BuscarGeneroMusical = async (req, res) => {

    try{
    const Genero = req.params.buscarGenero;

    const GeneroMusical = await Artista.findAll({
            where: {
                genero_musical: {
                    [Op.iLike]: `%${Genero.trim()}%` 
                }
            }
        });
 

        if(!GeneroMusical || GeneroMusical.length === 0){

        res.status(404).send({
            message: "esa no hay : "+Genero
        });
        return;
    }

    res.status(200).send(GeneroMusical);

    } catch(err){

        res.status(500).send({
            message: "error al buscar genero musical "
        });
    }
};

exports.BuscarPais = async (req, res) => {

    try{
    const pais = req.params.BuscarPais;

    const artista = await Artista.findAll({
            where: {
                pais_origen: {
                    [Op.iLike]: `%${pais.trim()}%` 
                }
            }
        });
 

        if(!artista || artista.length === 0){

        res.status(404).send({
            message: "esa no hay un artista registrado en ese lugar: "+pais
        });
        return;
    }

    res.status(200).send(artista);

    } catch(err){

        res.status(500).send({
            message: "error al buscar por pais "
        });
    }
};

// Delete a Client with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    // utilizamos el metodo destroy para eliminar el objeto mandamos la condicionante where id = parametro que recibimos 
    Artista.destroy({
        where: { id_artista: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Client was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Client with id=${id}. El Artista no fue encontado!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Tutorial with id=" + id
            });
        });
};



