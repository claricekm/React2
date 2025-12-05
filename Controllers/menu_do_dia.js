const express = require("express");
const router = express.Router();
const Prato = require("../Models/pratos");

// ====== FUNÇÕES AUXILIARES ======
function tipoEhValido(valor) {
  if (typeof valor !== "string") return false;
  const normalizado = valor.toLowerCase();
  return normalizado === "normal" || normalizado === "vegetariano";
}

// GET /
router.get("/", async (req, res) => {
  try {
    const pratos = await Prato.find();
    if (!pratos || pratos.length === 0) {
      return res.status(400).send("Ainda não existe nenhum prato coreano registado.");
    }
    res.status(200).json(pratos);
  } catch (erro) {
    console.error(erro);
    res.status(500).send("Falha ao consultar os pratos coreanos na base de dados.");
  }
});

// GET /:codigo
router.get("/:codigo", async (req, res) => {
  try {
    const prato = await Prato.findOne({ codigo: Number(req.params.codigo) });
    if (!prato) {
      return res.status(404).send("Prato coreano não encontrado para esse código.");
    }
    res.status(200).json(prato);
  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao obter prato coreano da base de dados.");
  }
});

// POST /
router.post("/", async (req, res) => {
  try {
    const { codigo, nome, categoria, tipo } = req.body;
    const novo = new Prato({ codigo, nome, categoria, tipo: tipo?.toLowerCase() });
    await novo.save();
    res.status(201).send(`Prato coreano ${codigo} criado com sucesso.`);
  } catch (erro) {
    console.error(erro);
    if (erro.name === "ValidationError") {
      return res.status(400).json({ erro: erro.message });
    }
    res.status(500).send("Erro ao registar novo prato coreano.");
  }
});

// PATCH /:codigo
router.patch("/:codigo", async (req, res) => {
  try {
    const { nome, tipo } = req.body;
    const atualizacoes = {};

    if (nome !== undefined) {
      if (!nome || nome.trim() === "") {
        return res.status(400).send("Nome de prato inválido.");
      }
      atualizacoes.nome = nome;
    }

    if (tipo !== undefined) {
      if (!tipoEhValido(tipo)) {
        return res
          .status(400)
          .send('Valor de "tipo" inválido. Use "normal" ou "vegetariano".');
      }
      atualizacoes.tipo = tipo.toLowerCase();
    }

    if (Object.keys(atualizacoes).length === 0) {
      return res
        .status(400)
        .send("Nenhum campo válido fornecido para atualização.");
    }

    const resultado = await Prato.updateOne(
      { codigo: Number(req.params.codigo) },
      { $set: atualizacoes }
    );

    if (resultado.matchedCount === 0) {
      return res.status(404).send("Prato coreano não encontrado.");
    }

    res.send("Prato coreano atualizado com sucesso.");
  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao atualizar prato coreano.");
  }
});

module.exports = router;
