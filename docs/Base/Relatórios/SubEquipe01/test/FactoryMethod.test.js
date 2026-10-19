"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { Conteudo, ConteudoRaiz, Comentario } = require("../src/factory-method/Conteudo");
const {
  CriadorDeConteudo,
  CriadorDeConteudoRaiz,
  CriadorDeComentario
} = require("../src/factory-method/CriadorDeConteudo");

test("Factory Method: CriadorDeConteudoRaiz produz um ConteudoRaiz", () => {
  const conteudo = new CriadorDeConteudoRaiz().prepararConteudo({
    autor: "joaopedro",
    titulo: "Padrões Criacionais",
    corpo: "Corpo da publicação."
  });

  assert.ok(conteudo instanceof ConteudoRaiz);
  assert.ok(conteudo instanceof Conteudo);
  assert.equal(conteudo.tipo, "conteudo-raiz");
});

test("Factory Method: CriadorDeComentario produz um Comentario", () => {
  const conteudo = new CriadorDeComentario().prepararConteudo({
    autor: "giovana",
    corpo: "Resposta.",
    idDoConteudoPai: "padroes-criacionais"
  });

  assert.ok(conteudo instanceof Comentario);
  assert.equal(conteudo.tipo, "comentario");
  assert.equal(conteudo.idDoConteudoPai, "padroes-criacionais");
});

test("Factory Method: o cliente usa a mesma operação para qualquer criador", () => {
  const dados = { autor: "arthur", titulo: "Título", corpo: "Corpo", idDoConteudoPai: "pai" };
  const criadores = [new CriadorDeConteudoRaiz(), new CriadorDeComentario()];

  const tipos = criadores.map((criador) => criador.prepararConteudo(dados).tipo);

  assert.deepEqual(tipos, ["conteudo-raiz", "comentario"]);
});

test("Factory Method: classes abstratas não podem ser instanciadas", () => {
  assert.throws(() => new CriadorDeConteudo(), /CriadorDeConteudo é abstrato/);
  assert.throws(() => new Conteudo({ autor: "a", corpo: "b" }), /Conteudo é abstrato/);
});

test("Factory Method: prepararConteudo() rejeita método-fábrica que não devolve Conteudo", () => {
  class CriadorInvalido extends CriadorDeConteudo {
    criarConteudo() {
      return { titulo: "objeto qualquer" };
    }
  }

  assert.throws(() => new CriadorInvalido().prepararConteudo({}), TypeError);
});

test("Factory Method: aplica as regras específicas de cada produto", () => {
  assert.throws(
    () => new CriadorDeConteudoRaiz().prepararConteudo({ autor: "a", corpo: "b" }),
    /título é obrigatório/
  );
  assert.throws(
    () => new CriadorDeComentario().prepararConteudo({ autor: "a", corpo: "b" }),
    /conteúdo que está respondendo/
  );
});

test("Factory Method: usa os limites do Singleton de configuração", () => {
  assert.throws(
    () =>
      new CriadorDeConteudoRaiz().prepararConteudo({
        autor: "a",
        titulo: "x".repeat(256),
        corpo: "b"
      }),
    /limite de 255 caracteres/
  );
});

test("Factory Method: gera slug sem acentos a partir do título", () => {
  assert.equal(ConteudoRaiz.gerarSlug("Padrões de Projeto: Criação!"), "padroes-de-projeto-criacao");
});

test("Factory Method: cada criador conta apenas os conteúdos que preparou", () => {
  const criadorDeRaiz = new CriadorDeConteudoRaiz();
  const criadorDeComentario = new CriadorDeComentario();

  criadorDeRaiz.prepararConteudo({ autor: "a", titulo: "T1", corpo: "c" });
  criadorDeRaiz.prepararConteudo({ autor: "a", titulo: "T2", corpo: "c" });
  assert.throws(() => criadorDeComentario.prepararConteudo({ autor: "a", corpo: "c" }));

  assert.equal(criadorDeRaiz.conteudosPreparados, 2);
  assert.equal(criadorDeComentario.conteudosPreparados, 0);
});
