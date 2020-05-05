//============================================================================
// Requires
//============================================================================
const express = require('express');
const { verificaToken, verificaAdminRole } = require('../middleware/autenticacion');
const Categoria = require('../models/categoria');
const _ = require('underscore');



const app = express();



//============================================================================
// Mostrar todas las categorias
//============================================================================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({}, 'nombre descripcion')
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            return res.json({
                ok: true,
                categorias: categoriaDB,
                tolal: categoriaDB.length
            });
        });
});

//============================================================================
// Mostrar una categoria por ID
//============================================================================
app.get('/categoria/:id', verificaToken, (req, res) => {

    const id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es válido'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });



});

//============================================================================
// Crear una nueva categoria
//============================================================================
app.post('/categoria', verificaToken, (req, res) => {

    const body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });


});

//============================================================================
// Actualiza el nombre de una categoria mediante el ID
//============================================================================
app.put('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;
    // con el pick filtro los atributos que se pueden actualizar
    let body = _.pick(req.body, ['descripcion']);


    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

//============================================================================
// Borra una categoria - fisicamente
//============================================================================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {


    let id = req.params.id;

    // eliminación por estado
    Categoria.findByIdAndRemove(id, (err, categoriaBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaBorrado) { // categoriaBorrado === null, !null = true, !!null = false
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBorrado,
            message: 'Categoria borrada!'

        });
    });


});







module.exports = app;