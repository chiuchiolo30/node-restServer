//============================================================================
// Requires
//============================================================================
require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');



//============================================================================
// Configuración del bodyParser
//============================================================================
// parse application/x-www-form-urlencode
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//============================================================================
// Obtener usuarios a travez del método GET
//============================================================================
app.get('/usuario', (req, res) => {


    res.json('Get usuarios');


});

//============================================================================
// Crear un usuario através del método POST
//============================================================================
app.post('/usuario', (req, res) => {

    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            persona: body
        });
    }


});
//============================================================================
// Actualizar usuario através del método PUT
//============================================================================
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;

    res.json({
        id
    });


});
//============================================================================
// Borrar usuario através del método DELETE
//============================================================================
app.delete('/usuario/:id', (req, res) => {


    res.json('Delete usuarios');


});





app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${ process.env.PORT }: \x1b[32m%s\x1b[0m`, 'ONLINE');
});