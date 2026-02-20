const db = require('./db');

module.exports = {
    db,
    // Aquí se exportarán en el futuro funciones de queries específicas
    // de modo que la business-logic sólo llame funciones (Ej: usersModel.findById)
};
