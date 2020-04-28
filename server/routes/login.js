//============================================================================
// Requires
//============================================================================
const express = require('express');
const Usuario = require('../models/usuario');
const bcryptJS = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();




//============================================================================
// Login - normal
//============================================================================
app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        // válido si el usuario existe en la DB
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }
        // válido si la contraseña es correcta
        if (!bcryptJS.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }
        // paso el login - genero el token
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); /* expira en 30 días */

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
});








module.exports = app;