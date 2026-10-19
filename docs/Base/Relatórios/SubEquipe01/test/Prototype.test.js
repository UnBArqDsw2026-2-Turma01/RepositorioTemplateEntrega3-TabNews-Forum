"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { Prototipo, ModeloDeConteudo } = require("../src/prototype/ModeloDeConteudo");
const RegistroDeModelos = require("../src/prototype/RegistroDeModelos");

function criarModeloTutorial() {
  return new ModeloDeConteudo({
    nome: "Tutorial",
    tituloSugerido: "Tutorial: ",
    secoes: [{ titulo: "Introdução" }, { titulo: "Passo a passo" }]
  });
}

test("Prototype: clonar() cria um objeto novo com os mesmos dados", () => {
  const original = criarModeloTutorial();
  const copia = original.clonar();

  assert.notEqual(copia, original);
  assert.ok(copia instanceof ModeloDeConteudo);
  assert.deepEqual(copia, original);
});

test("Prototype: a cópia é profunda e não compartilha as seções", () => {
  const original = criarModeloTutorial();
  const copia = original.clonar();

  copia.preencherSecao("Introdução", "Texto do autor.");
  copia.adicionarSecao("Referências");

  assert.notEqual(copia.secoes, original.secoes);
  assert.notEqual(copia.secoes[0], original.secoes[0]);
  assert.equal(original.secoes[0].texto, "");
  assert.equal(original.secoes.length, 2);
});

test("Prototype: o registro devolve cópias, nunca o protótipo registrado", () => {
  const modelo = criarModeloTutorial();
  const registro = new RegistroDeModelos().registrar("tutorial", modelo);

  const primeira = registro.criar("tutorial");
  const segunda = registro.criar("tutorial");

  assert.notEqual(primeira, modelo);
  assert.notEqual(primeira, segunda);
  assert.deepEqual(registro.listarChaves(), ["tutorial"]);
});

test("Prototype: alterar uma cópia não afeta as cópias seguintes", () => {
  const registro = new RegistroDeModelos().registrar("tutorial", criarModeloTutorial());

  const rascunho = registro.criar("tutorial");
  rascunho.tituloSugerido = "Tutorial: alterado";
  rascunho.preencherSecao("Passo a passo", "Alterado");

  const novaCopia = registro.criar("tutorial");
  assert.equal(novaCopia.tituloSugerido, "Tutorial:");
  assert.equal(novaCopia.secoes[1].texto, "");
});

test("Prototype: o registro rejeita chave desconhecida e objeto que não é Prototipo", () => {
  const registro = new RegistroDeModelos();

  assert.throws(() => registro.criar("pitch"), /Modelo não registrado: pitch/);
  assert.throws(() => registro.registrar("qualquer", { clonar() {} }), TypeError);
});

test("Prototype: Prototipo é abstrato e o modelo valida seus dados", () => {
  assert.throws(() => new Prototipo(), /Prototipo é abstrato/);
  assert.throws(
    () => new ModeloDeConteudo({ nome: "", tituloSugerido: "T" }),
    /nome do modelo é obrigatório/
  );
  assert.throws(
    () => criarModeloTutorial().preencherSecao("Inexistente", "x"),
    /não existe no modelo/
  );
});

test("Prototype: montarCorpo() gera o corpo em Markdown a partir das seções", () => {
  const corpo = criarModeloTutorial().clonar().preencherSecao("Introdução", "Olá").montarCorpo();

  assert.equal(corpo, "## Introdução\n\nOlá\n\n## Passo a passo\n\n(a preencher)");
});
