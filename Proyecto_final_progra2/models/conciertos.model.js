
module.exports = (sequelize, Sequelize) => {

    const Concierto = sequelize.define("concierto", {
        id_concierto: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
        },
        id_artista: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        titulo_evento: {
            type: Sequelize.STRING,
            allowNull: false
        },
        recinto: {
            type: Sequelize.STRING,
            allowNull: false
        },
        ciudad: {
            type: Sequelize.STRING,
            allowNull: false
        }, 
        estado: {
            type: Sequelize.STRING,
            allowNull: false
        },
        tipo_evento:{
            type: Sequelize.STRING,
            allowNull: false
        },
        fecha_concierto:{
            type: Sequelize.DATE
        },
        horario:{
            type: Sequelize.DATE,
            allowNull: false
        }
    });
    return Concierto;
};