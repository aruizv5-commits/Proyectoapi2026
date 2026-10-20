
module.exports = (sequelize, Sequelize) => {

    const Usuario = sequelize.define("usuario", {
        id_usuario: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true
        },
        nombre_usuario: {
            type: Sequelize.STRING,
            allowNull: false
        },
        contrasena_hash: {
            type: Sequelize.STRING,
            allowNull: false
        },
        nombre_completo: {
            type: Sequelize.STRING,
            allowNull: false
        },
        
        rol: {
            type: Sequelize.STRING,
            allowNull: false
        },
        fecha_creacion:{
            type: Sequelize.DATE
        },
        status: {
            type: Sequelize.BOOLEAN
        }
    });
    return Usuario;
};