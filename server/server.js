//============================================================================
// Requires
//============================================================================
require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');




//============================================================================
// Configuración del bodyParser
//============================================================================
// parse application/x-www-form-urlencode
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//============================================================================
// Habilitar la carpeta public
//============================================================================
app.use(express.static(path.resolve(__dirname, '../public')));

//============================================================================
// Routes - Middleware - Configuración global de Routes
//============================================================================
app.use(require('./routes/index'));




mongoose.connect(process.env.URLDB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;

    console.log(`Base de datos: \x1b[32m%s\x1b[0m`, 'ONLINE');

});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${ process.env.PORT }: \x1b[32m%s\x1b[0m`, 'ONLINE');
});