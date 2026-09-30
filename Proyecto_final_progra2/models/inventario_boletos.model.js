
module.exports = (sequelize, Sequelize) => {

    const Boletos = sequelize.define("boletos", {
        id_inventario: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
        },
        id_concierto: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        id_localidad: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        precio: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        
        cantidad_total: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        cantidad_disponible:{
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
    return Boletos;
};