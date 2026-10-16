const Observador = require("./Observador");
const { TipoDeEvento } = require("./EventoDeConteudo");

class Notificacao {
  constructor({ destinatario, mensagem }) {
    this.destinatario = destinatario;
    this.mensagem = mensagem;
  }
}

// Participante GoF: ConcreteObserver.
// RN03: notifica o autor do conteúdo respondido. RN04: não notifica quem responde a si mesmo.
class NotificadorDeResposta extends Observador {
  #notificacoes = [];

  atualizar(evento) {
    if (evento.tipo !== TipoDeEvento.COMENTARIO_PUBLICADO) {
      console.log(`[Notificador] Evento ${evento.tipo} ignorado (tipo não tratado)`);
      return;
    }

    const { conteudo: comentario, conteudoPai } = evento;
    if (conteudoPai.autor === comentario.autor) {
      console.log(`[Notificador] ${comentario.autor} respondeu ao próprio conteúdo; nenhuma notificação`);
      return;
    }

    this.#registrar(
      new Notificacao({
        destinatario: conteudoPai.autor,
        mensagem: `${comentario.autor} respondeu ao seu conteúdo ${conteudoPai.id}: "${comentario.corpo}"`,
      }),
    );
  }

  listarNotificacoes(usuario) {
    return this.#notificacoes.filter((notificacao) => notificacao.destinatario === usuario);
  }

  #registrar(notificacao) {
    this.#notificacoes.push(notificacao);
    console.log(`[Notificador] Para ${notificacao.destinatario}: ${notificacao.mensagem}`);
  }
}

module.exports = { NotificadorDeResposta, Notificacao };
