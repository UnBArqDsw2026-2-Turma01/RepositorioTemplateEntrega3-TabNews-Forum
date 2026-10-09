class Publicacao {
  constructor({ titulo, conteudo, autor, tags = [] }) {
    if (!titulo || !titulo.trim()) {
      throw new Error("O título da publicação é obrigatório.");
    }
    if (!conteudo || !conteudo.trim()) {
      throw new Error("O conteúdo da publicação é obrigatório.");
    }
    if (!autor || !autor.trim()) {
      throw new Error("O autor da publicação é obrigatório.");
    }

    this.titulo = titulo.trim();
    this.conteudo = conteudo.trim();
    this.autor = autor.trim();
    this.tags = [...new Set(tags.map((tag) => String(tag).trim()).filter(Boolean))];
  }

  toJSON() {
    return {
      titulo: this.titulo,
      conteudo: this.conteudo,
      autor: this.autor,
      tags: this.tags
    };
  }
}

module.exports = Publicacao;
