//============================================================================
// Puerto -  Configuraciones globales
//============================================================================
process.env.PORT = process.env.PORT || 3000;

//============================================================================
// Entorno
//============================================================================
// para saber si estoy en desarrollo o en producción
/*  si NODE_ENV (variable de heroku) no existe, estoy en desarrollo */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//============================================================================
// Base de datos
//============================================================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://underworld:LB7EwQKdlYbPFchG@cluster0-jgftl.mongodb.net/cafe';
}

process.env.URLDB = urlDB;