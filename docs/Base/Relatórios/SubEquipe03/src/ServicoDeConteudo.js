const Sujeito = require("./Sujeito");
const { EventoDeConteudo, TipoDeEvento } = require("./EventoDeConteudo");
const { Conteudo } = require("./RepositorioDeConteudo");

// Participante GoF: ConcreteSubject.
class ServicoDeConteudo extends Sujeito {
  #repositorio;

  constructor(repositorio) {
    super();
    this.#repositorio = repositorio;
  }

  publicarComentario(autor, idPai, corpo) {
    const conteudoPai = this.#repositorio.buscarPorId(idPai);
    if (!conteudoPai) {
      throw new Error(`Conteúdo pai ${idPai} não encontrado.`);
    }

    const comentario = this.#repositorio.salvar(new Conteudo({ autor, idPai, corpo }));
    console.log(`[Conteudo] ${autor} publicou ${comentario.id} em resposta a ${idPai}`);

    this.notificar(
      new EventoDeConteudo({
        tipo: TipoDeEvento.COMENTARIO_PUBLICADO,
        conteudo: comentario,
        conteudoPai
      })
    );
    return comentario;
  }

  removerConteudo(id) {
    const conteudo = this.#repositorio.buscarPorId(id);
    if (!conteudo) {
      throw new Error(`Conteúdo ${id} não encontrado.`);
    }

    this.#repositorio.remover(id);
    console.log(`[Conteudo] ${id} de ${conteudo.autor} foi removido`);

    this.notificar(new EventoDeConteudo({ tipo: TipoDeEvento.CONTEUDO_REMOVIDO, conteudo }));
  }
}

module.exports = ServicoDeConteudo;
