const EstadoDoConteudo = Object.freeze({
  PUBLICADO: "PUBLICADO",
  EM_REVISAO: "EM_REVISAO"
});

class Conteudo {
  constructor({ id = null, autor, idPai = null, corpo, estado = EstadoDoConteudo.PUBLICADO }) {
    this.id = id;
    this.autor = autor;
    this.idPai = idPai;
    this.corpo = corpo;
    this.estado = estado;
  }
}

class RepositorioDeConteudo {
  #conteudos = new Map();
  #proximoId = 1;

  salvar(conteudo) {
    if (conteudo.id === null) {
      conteudo.id = `c${this.#proximoId++}`;
    }
    this.#conteudos.set(conteudo.id, conteudo);
    return conteudo;
  }

  buscarPorId(id) {
    return this.#conteudos.get(id) ?? null;
  }

  remover(id) {
    this.#conteudos.delete(id);
  }
}

module.exports = { RepositorioDeConteudo, Conteudo, EstadoDoConteudo };
