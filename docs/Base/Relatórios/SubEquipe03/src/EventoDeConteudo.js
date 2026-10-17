const TipoDeEvento = Object.freeze({
  COMENTARIO_PUBLICADO: "COMENTARIO_PUBLICADO",
  CONTEUDO_REMOVIDO: "CONTEUDO_REMOVIDO",
  CONTEUDO_EM_REVISAO: "CONTEUDO_EM_REVISAO",
  CONTEUDO_RESTAURADO: "CONTEUDO_RESTAURADO"
});

class EventoDeConteudo {
  constructor({ tipo, conteudo, conteudoPai = null, ocorridoEm = new Date() }) {
    if (!Object.values(TipoDeEvento).includes(tipo)) {
      throw new TypeError(`Tipo de evento inválido: ${tipo}.`);
    }
    if (!conteudo) {
      throw new TypeError("O evento deve referenciar um conteúdo.");
    }
    this.tipo = tipo;
    this.conteudo = conteudo;
    this.conteudoPai = conteudoPai;
    this.ocorridoEm = ocorridoEm;
    Object.freeze(this);
  }
}

module.exports = { EventoDeConteudo, TipoDeEvento };
