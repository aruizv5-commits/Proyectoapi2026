
module.exports = (sequelize, Sequelize) => {

    const Artista = sequelize.define("artista", {
        id_artista: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
        },
        nombre_artistico: {
            type: Sequelize.STRING,
            allowNull: false
        },
        genero_musical: {
            type: Sequelize.STRING,
            allowNull: false
        },
        pais_origen: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    return Artista;
};