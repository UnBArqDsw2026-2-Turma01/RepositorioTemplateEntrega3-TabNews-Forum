const test = require("node:test");
const assert = require("node:assert/strict");
const PublicacaoBuilder = require("../src/PublicacaoBuilder");

test("constrói uma publicação com dados válidos", () => {
  const publicacao = new PublicacaoBuilder()
    .comTitulo("Título")
    .comConteudo("Conteúdo")
    .comAutor("Autor")
    .comTags(["GoF", "JS"])
    .build();

  assert.equal(publicacao.titulo, "Título");
  assert.equal(publicacao.conteudo, "Conteúdo");
  assert.equal(publicacao.autor, "Autor");
  assert.deepEqual(publicacao.tags, ["GoF", "JS"]);
});

test("remove espaços externos e tags repetidas ou vazias", () => {
  const publicacao = new PublicacaoBuilder()
    .comTitulo("  Título  ")
    .comConteudo("  Conteúdo  ")
    .comAutor("  Autor  ")
    .comTags(["GoF", "GoF", "  JS  ", ""])
    .build();

  assert.equal(publicacao.titulo, "Título");
  assert.deepEqual(publicacao.tags, ["GoF", "JS"]);
});

test("rejeita publicação sem título", () => {
  assert.throws(
    () => new PublicacaoBuilder().comConteudo("Conteúdo").comAutor("Autor").build(),
    /título da publicação é obrigatório/i
  );
});

test("rejeita publicação sem conteúdo", () => {
  assert.throws(
    () => new PublicacaoBuilder().comTitulo("Título").comAutor("Autor").build(),
    /conteúdo da publicação é obrigatório/i
  );
});

test("rejeita tags que não sejam array", () => {
  assert.throws(
    () => new PublicacaoBuilder().comTags("GoF"),
    /tags devem ser informadas em um array/i
  );
});
