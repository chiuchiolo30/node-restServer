const express = require('express');
const Producto = require('../models/producto');
const { verificaToken } = require('../middleware/autenticacion');

const app = express();

//============================================================================
// Obtener todos los productos
//============================================================================
app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    let hasta = req.query.hasta || 0;

    desde = Number(desde);
    hasta = Number(hasta);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(hasta)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Producto.countDocuments({}, (err, conteo) => {

                res.json({
                    ok: true,
                    productos,
                    total: conteo
                });
            });
        });

});
//============================================================================
// Obtener producto por id
//============================================================================
app.get('/productos/:id', verificaToken, (req, res) => {

    const id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });


});
//============================================================================
// Buscar productos
//============================================================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});
//============================================================================
// Crear un nuevo producto
//============================================================================
app.post('/productos', verificaToken, (req, res) => {

    const body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });



});

//============================================================================
// Actualizar producto
//============================================================================
app.put('/productos/:id', verificaToken, (req, res) => {

    const id = req.params.id;
    const body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.descripcion;
        productoDB.disponible = body.disponible;
        productoDB.categoria = body.categoria;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });
        });
    });



});

//============================================================================
// Borrar un producto - cambiar estado, true a false
//============================================================================
app.delete('/productos/:id', verificaToken, (req, res) => {


    const id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }
        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto borrado'
            });
        });
    });

});







module.exports = app;