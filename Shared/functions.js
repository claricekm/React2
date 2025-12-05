const fs = require("fs").promises;
const path = require("path");

const CAMINHO_MENU = path.join(__dirname, "menu.txt");

// Entidade que representa um prato
class Prato {
  constructor(codigo, nome, tipo) {
    this.codigo = codigo;
    this.nome = nome;
    this.tipo = tipo;
  }
}

// Devolve um array de linhas não vazias a partir de uma string
function obterLinhasValidas(texto) {
  return texto
    .split("\n")
    .map((linha) => linha.trim())
    .filter((linha) => linha.length > 0);
}

// Converte uma linha JSON num objeto Prato válido ou null
function linhaParaPrato(linha) {
  try {
    const obj = JSON.parse(linha);

    const valido =
      obj &&
      typeof obj.codigo === "string" &&
      typeof obj.nome === "string" &&
      typeof obj.tipo === "string";

    if (!valido) return null;

    return new Prato(obj.codigo, obj.nome, obj.tipo);
  } catch {
    console.warn("Registo de menu ignorado (JSON inválido):", linha);
    return null;
  }
}

// Lê o ficheiro de menu e devolve uma lista de pratos
async function carregarMenu() {
  try {
    const conteudo = await fs.readFile(CAMINHO_MENU, "utf8");
    const linhas = obterLinhasValidas(conteudo);

    const pratos = [];
    for (const linha of linhas) {
      const prato = linhaParaPrato(linha);
      if (prato) {
        pratos.push(prato);
      }
    }

    return pratos;
  } catch (erro) {
    if (erro.code === "ENOENT") {
      // Ficheiro ainda não criado → nenhum prato registado
      return [];
    }
    throw erro;
  }
}

// Recebe uma lista de pratos e persiste no ficheiro (um JSON por linha)
async function guardarMenu(listaPratos) {
  const linhas = listaPratos.map((prato) => JSON.stringify(prato));
  const conteudo = linhas.join("\n");
  await fs.writeFile(CAMINHO_MENU, conteudo, "utf8");
}

module.exports = {
  Prato,
  carregarMenu,
  guardarMenu,
};
