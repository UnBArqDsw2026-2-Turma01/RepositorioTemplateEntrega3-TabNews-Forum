const TipoDeEvento = Object.freeze({
  COMENTARIO_PUBLICADO: "COMENTARIO_PUBLICADO",
  CONTEUDO_REMOVIDO: "CONTEUDO_REMOVIDO",
});

// Modelo push: o evento carrega os dados de que os observadores precisam.
// É congelado para que um observador não altere o evento recebido pelos seguintes.
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
