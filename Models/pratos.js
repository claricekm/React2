const mongoose = require('mongoose');
const { Schema } = mongoose;

const pratoSchema = new Schema(
  {
    codigo: {
      type: Number,
      required: [true, 'Código do prato é obrigatório'],
      unique: true,
      min: [1, 'Código tem de ser >= 1']
    },
    nome: {
      type: String,
      required: [true, 'Nome do prato é obrigatório'],
      minlength: [3, 'Nome demasiado curto'],
      maxlength: [100, 'Nome demasiado longo']
    },
    categoria: {
      type: String,
      required: [true, 'Categoria é obrigatória'],
      minlength: [3, 'Categoria demasiado curta'],
      maxlength: [50, 'Categoria demasiado longa']
    },
    tipo: {
      type: String,
      required: [true, 'Tipo é obrigatório'],
      enum: {
        values: ['normal', 'vegetariano'],
        message: 'Tipo inválido (use "normal" ou "vegetariano")'
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prato', pratoSchema);
