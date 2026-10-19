"use strict";

const {
  CriadorDeConteudoRaiz,
  CriadorDeComentario
} = require("./CriadorDeConteudo");

/**
 * O cliente conhece apenas a interface de CriadorDeConteudo.
 * Ele não sabe qual classe concreta de conteúdo será instanciada.
 */
function enviarConteudo(criador, dados) {
  const conteudo = criador.prepararConteudo(dados);
  console.log(`- Criado por ${criador.constructor.name}: ${conteudo.resumo()}`);
  return conteudo;
}

console.log("=== Factory Method: criação de conteúdos do fórum ===\n");

const criadorDeRaiz = new CriadorDeConteudoRaiz();
const criadorDeComentario = new CriadorDeComentario();

console.log("1. Mesma operação, criadores diferentes:");
const publicacao = enviarConteudo(criadorDeRaiz, {
  autor: "joaopedro",
  titulo: "Como o Factory Method organiza a criação de conteúdos",
  corpo: "Cada criador concreto decide qual tipo de conteúdo instanciar."
});

const resposta = enviarConteudo(criadorDeComentario, {
  autor: "giovana",
  corpo: "Ótima explicação! Ficou claro o papel do método-fábrica.",
  idDoConteudoPai: publicacao.slug
});

console.log("\n2. Produtos resultantes:");
console.log(`- ${publicacao.constructor.name}: tipo="${publicacao.tipo}", slug="${publicacao.slug}"`);
console.log(`- ${resposta.constructor.name}: tipo="${resposta.tipo}", responde a "${resposta.idDoConteudoPai}"`);

console.log("\n3. Regras específicas de cada produto:");
try {
  enviarConteudo(criadorDeRaiz, { autor: "arthur", corpo: "Conteúdo raiz sem título." });
} catch (erro) {
  console.log(`- CriadorDeConteudoRaiz recusou: ${erro.message}`);
}
try {
  enviarConteudo(criadorDeComentario, { autor: "arthur", corpo: "Comentário sem conteúdo pai." });
} catch (erro) {
  console.log(`- CriadorDeComentario recusou: ${erro.message}`);
}

console.log("\n4. Contagem por criador:");
console.log(`- ${criadorDeRaiz.constructor.name}: ${criadorDeRaiz.conteudosPreparados} conteúdo(s)`);
console.log(`- ${criadorDeComentario.constructor.name}: ${criadorDeComentario.conteudosPreparados} conteúdo(s)`);
