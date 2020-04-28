//============================================================================
// Requires
//============================================================================
const express = require('express');
const bcryptJS = require('bcryptjs');
const _ = require('underscore');
const app = express();
const Usuario = require('../models/usuario');


//============================================================================
// Obtener usuarios a travez del método GET
//============================================================================
app.get('/usuario', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    total: conteo
                });
            });
        });
});

//============================================================================
// Crear un usuario através del método POST
//============================================================================
app.post('/usuario', (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcryptJS.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});
//============================================================================
// Actualizar usuario através del método PUT
//============================================================================
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    // con el pick filtro los atributos que se pueden actualizar
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });





});
//============================================================================
// Borrar usuario através del método DELETE
//============================================================================
app.delete('/usuario/:id', (req, res) => {

    let id = req.params.id;

    // eliminación física
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    let cambiaEstado = {
        estado: false
    };
    // eliminación por estado
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) { // usuarioBorrado === null, !null = true, !!null = false
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});


module.exports = app;