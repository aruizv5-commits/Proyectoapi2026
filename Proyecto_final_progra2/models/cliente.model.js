//Utilizamos module.export para exportar objetos para que puedan ser utilizados en otras clases
module.exports = (sequelize, Sequelize) => {
// usamos el sequelize.defina para "definir" el nombre de la entity en la BD, en este caso "cliente"
// Usamos type.Sequelize para definir el tipo de datos de cada atributo de la entidad 
    const Cliente = sequelize.define("cliente", {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        nombre: {
            type: Sequelize.STRING,
            allowNull: false
        },
        apellido: {
            type: Sequelize.STRING,
            allowNull: false
        },
        direccion: {
            type: Sequelize.STRING,
            allowNull: true
        },
        correo: {
            type: Sequelize.STRING,
            allowNull: false
        },
        
        telefono: {
            type: Sequelize.STRING,
            allowNull: false
        },
        nit:{
            type: Sequelize.STRING,
            allowNull: false
        },
        status: {
            type: Sequelize.BOOLEAN
        }
    });
    return Cliente;
};