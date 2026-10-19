"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const ConfiguracaoDoForum = require("../src/singleton/ConfiguracaoDoForum");

test("Singleton: não cria a instância antes do primeiro acesso (criação preguiçosa)", () => {
  assert.equal(ConfiguracaoDoForum.instanciasCriadas, 0);
  ConfiguracaoDoForum.obterInstancia();
  assert.equal(ConfiguracaoDoForum.instanciasCriadas, 1);
});

test("Singleton: acessos sucessivos devolvem a mesma instância", () => {
  const primeira = ConfiguracaoDoForum.obterInstancia();
  const segunda = ConfiguracaoDoForum.obterInstancia();

  assert.equal(primeira, segunda);
  assert.equal(ConfiguracaoDoForum.instanciasCriadas, 1);
});

test("Singleton: impede a criação direta com new", () => {
  assert.throws(() => new ConfiguracaoDoForum(), /use ConfiguracaoDoForum\.obterInstancia/);
  assert.equal(ConfiguracaoDoForum.instanciasCriadas, 1);
});

test("Singleton: os parâmetros são somente leitura", () => {
  const configuracao = ConfiguracaoDoForum.obterInstancia();

  assert.ok(Object.isFrozen(configuracao));
  assert.throws(() => {
    configuracao.limiteDeCaracteresDoTitulo = 10;
  }, TypeError);
  assert.equal(configuracao.limiteDeCaracteresDoTitulo, 255);
});

test("Singleton: obter() devolve parâmetros existentes e rejeita chaves desconhecidas", () => {
  const configuracao = ConfiguracaoDoForum.obterInstancia();

  assert.equal(configuracao.obter("limiteDeCaracteresDoCorpo"), 20000);
  assert.throws(() => configuracao.obter("limiteDeTags"), /Parâmetro de configuração desconhecido/);
});
