"use strict";

const { ModeloDeConteudo } = require("./ModeloDeConteudo");
const RegistroDeModelos = require("./RegistroDeModelos");
const { CriadorDeConteudoRaiz } = require("../factory-method/CriadorDeConteudo");

console.log("=== Prototype: modelos de rascunho de publicação ===\n");

const registro = new RegistroDeModelos()
  .registrar(
    "duvida",
    new ModeloDeConteudo({
      nome: "Dúvida técnica",
      tituloSugerido: "Dúvida: ",
      secoes: [
        { titulo: "Contexto" },
        { titulo: "O que já tentei" },
        { titulo: "Mensagem de erro" }
      ]
    })
  )
  .registrar(
    "tutorial",
    new ModeloDeConteudo({
      nome: "Tutorial",
      tituloSugerido: "Tutorial: ",
      secoes: [
        { titulo: "Introdução" },
        { titulo: "Passo a passo" },
        { titulo: "Conclusão" }
      ]
    })
  );

console.log(`1. Modelos registrados: ${registro.listarChaves().join(", ")}`);

const rascunho = registro.criar("tutorial");
rascunho.tituloSugerido = "Tutorial: aplicando o padrão Prototype em JavaScript";
rascunho
  .preencherSecao("Introdução", "O Prototype cria objetos copiando um modelo existente.")
  .preencherSecao("Passo a passo", "Registre os modelos e peça cópias ao registro.")
  .preencherSecao("Conclusão", "O modelo original continua intacto para o próximo autor.")
  .adicionarSecao("Referências", "GAMMA et al. Design Patterns, 1994.");

console.log("\n2. Rascunho clonado e preenchido:");
console.log(`- Título: ${rascunho.tituloSugerido}`);
console.log(`- Seções: ${rascunho.secoes.map((secao) => secao.titulo).join(" | ")}`);

const outraCopia = registro.criar("tutorial");
console.log("\n3. Nova cópia do mesmo modelo (o original não foi alterado):");
console.log(`- Título: ${outraCopia.tituloSugerido}`);
console.log(`- Seções: ${outraCopia.secoes.map((secao) => secao.titulo).join(" | ")}`);
console.log(`- Texto da Introdução: ${outraCopia.secoes[0].texto || "(vazio)"}`);
console.log(`- Rascunho e nova cópia são objetos distintos? ${rascunho !== outraCopia}`);
console.log(`- Compartilham o array de seções? ${rascunho.secoes === outraCopia.secoes}`);

console.log("\n4. Rascunho enviado ao Factory Method como conteúdo raiz:");
const conteudo = new CriadorDeConteudoRaiz().prepararConteudo({
  autor: "joaopedro",
  titulo: rascunho.tituloSugerido,
  corpo: rascunho.montarCorpo()
});
console.log(`- ${conteudo.resumo()}`);
console.log(`- Corpo com ${conteudo.corpo.length} caracteres e ${rascunho.secoes.length} seções`);

console.log("\n5. Modelo inexistente:");
try {
  registro.criar("pitch");
} catch (erro) {
  console.log(`- Erro: ${erro.message}`);
}
