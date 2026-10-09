const PublicacaoBuilder = require("./PublicacaoBuilder");

const publicacao = new PublicacaoBuilder()
  .comTitulo("Padrões de Projeto GoF")
  .comConteudo("Exemplo didático do padrão Builder aplicado ao Projeto Fórum.")
  .comAutor("Autor demonstrativo")
  .comTags(["GoF", "Arquitetura", "JavaScript", "GoF"])
  .build();

console.log("Publicação construída com sucesso:");
console.log(JSON.stringify(publicacao, null, 2));
