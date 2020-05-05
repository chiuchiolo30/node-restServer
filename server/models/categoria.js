//============================================================================
// Requires
//============================================================================

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/* inicialización del modelo */
let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre es necesario']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es necesaria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});


categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Categoria', categoriaSchema);