const Publicacao = require("./Publicacao");

class PublicacaoBuilder {
  constructor() {
    this.dados = { titulo: "", conteudo: "", autor: "", tags: [] };
  }

  comTitulo(titulo) {
    this.dados.titulo = titulo;
    return this;
  }

  comConteudo(conteudo) {
    this.dados.conteudo = conteudo;
    return this;
  }

  comAutor(autor) {
    this.dados.autor = autor;
    return this;
  }

  comTags(tags) {
    if (!Array.isArray(tags)) {
      throw new TypeError("As tags devem ser informadas em um array.");
    }
    this.dados.tags = [...tags];
    return this;
  }

  build() {
    return new Publicacao(this.dados);
  }
}

module.exports = PublicacaoBuilder;
