"use strict";

const ConfiguracaoDoForum = require("./ConfiguracaoDoForum");

console.log("=== Singleton: ConfiguracaoDoForum ===\n");

console.log(`Instâncias criadas antes do primeiro acesso: ${ConfiguracaoDoForum.instanciasCriadas}`);

const configuracaoDoCriador = ConfiguracaoDoForum.obterInstancia();
const configuracaoDoValidador = ConfiguracaoDoForum.obterInstancia();

console.log(`Instâncias criadas após dois acessos: ${ConfiguracaoDoForum.instanciasCriadas}`);
console.log(`As duas referências apontam para o mesmo objeto? ${configuracaoDoCriador === configuracaoDoValidador}`);

console.log("\nParâmetros disponíveis:");
console.log(`- Plataforma: ${configuracaoDoCriador.obter("nomeDaPlataforma")}`);
console.log(`- Limite do título: ${configuracaoDoCriador.obter("limiteDeCaracteresDoTitulo")} caracteres`);
console.log(`- Limite do corpo: ${configuracaoDoCriador.obter("limiteDeCaracteresDoCorpo")} caracteres`);

console.log("\nTentativa de criar outra instância com new:");
try {
  new ConfiguracaoDoForum();
} catch (erro) {
  console.log(`- Erro: ${erro.message}`);
}

console.log("\nTentativa de alterar um parâmetro em tempo de execução:");
try {
  configuracaoDoCriador.limiteDeCaracteresDoTitulo = 10;
} catch (erro) {
  console.log(`- Erro: ${erro.message}`);
}
console.log(`- Limite do título continua: ${configuracaoDoValidador.limiteDeCaracteresDoTitulo}`);
