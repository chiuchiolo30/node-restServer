//============================================================================
// Requires
//============================================================================
const express = require('express');
const Usuario = require('../models/usuario');
const bcryptJS = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

//============================================================================
// Login - Google
//============================================================================
/* Configuraciones de Google */
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };

}
/* END Configuraciones de Google */


app.post('/google', async(req, res) => {

    const token = req.body.idtoken;

    let googleuser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    Usuario.findOne({ email: googleuser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (usuarioDB) {

            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticación normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); /* expira en 30 días */

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });


            }
        } else {
            // si el usuario no existe en la base de datos
            let usuario = new Usuario();
            usuario.nombre = googleuser.nombre;
            usuario.email = googleuser.email;
            usuario.img = googleuser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); /* expira en 30 días */

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            });
        }
    });
});


module.exports = app;