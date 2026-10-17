// Cliente: compõe os objetos e reproduz as etapas do Diagrama de Sequência.
const Observador = require("./Observador");
const ServicoDeConteudo = require("./ServicoDeConteudo");
const ServicoDeTabCoins = require("./ServicoDeTabCoins");
const { NotificadorDeResposta } = require("./NotificadorDeResposta");
const { RepositorioDeConteudo, Conteudo } = require("./RepositorioDeConteudo");

class ObservadorComFalha extends Observador {
  atualizar(evento) {
    throw new Error(`falha simulada ao processar ${evento.tipo}`);
  }
}

function etapa(titulo) {
  console.log(`\n=== ${titulo} ===`);
}

const repositorio = new RepositorioDeConteudo();
const conteudos = new ServicoDeConteudo(repositorio);
const tabcoins = new ServicoDeTabCoins();
const notificador = new NotificadorDeResposta();

// Postagem inicial salva direto no repositório, sem evento, para servir de conteúdo pai.
const postagem = repositorio.salvar(new Conteudo({ autor: "joao", corpo: "Como aplicar o padrão Observer?" }));
console.log(`[Cliente] Postagem ${postagem.id} de ${postagem.autor} criada como ponto de partida`);

etapa("1. Configuração: inscrição dos observadores");
conteudos.inscrever(tabcoins);
console.log("[Cliente] ServicoDeTabCoins inscrito");
conteudos.inscrever(notificador);
console.log("[Cliente] NotificadorDeResposta inscrito");

etapa("2. Publicação de comentários");
const comentarioDaMaria = conteudos.publicarComentario("maria", postagem.id, "Use uma classe Sujeito.");
conteudos.publicarComentario("joao", postagem.id, "Obrigado, vou testar!");

etapa("3. Remoção de conteúdo");
conteudos.removerConteudo(comentarioDaMaria.id);

etapa("4. Desinscrição do NotificadorDeResposta");
conteudos.desinscrever(notificador);
console.log("[Cliente] NotificadorDeResposta desinscrito");
conteudos.publicarComentario("carlos", postagem.id, "Também dá para usar funções.");

etapa("5. Extra (RN06): um observador que falha não impede os demais");
conteudos.inscrever(new ObservadorComFalha());
console.log("[Cliente] ObservadorComFalha inscrito");
conteudos.inscrever(notificador);
console.log("[Cliente] NotificadorDeResposta inscrito novamente, depois do observador com falha");
conteudos.publicarComentario("ana", postagem.id, "Ótima discussão!");

etapa("Resumo");
for (const usuario of ["joao", "maria", "carlos", "ana"]) {
  console.log(`[TabCoins] Saldo de ${usuario}: ${tabcoins.consultarSaldo(usuario)}`);
}
console.log(`[Notificador] Notificações de joao: ${notificador.listarNotificacoes("joao").length}`);
