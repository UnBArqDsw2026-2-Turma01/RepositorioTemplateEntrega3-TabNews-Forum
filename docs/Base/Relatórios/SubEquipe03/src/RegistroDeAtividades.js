const Observador = require("./Observador");

class RegistroDeAtividades extends Observador {
  #registros = [];

  atualizar(evento) {
    const dataHora = evento.ocorridoEm.toISOString();
    const autor = evento.conteudo.autor;
    const id = evento.conteudo.id;
    
    const log = `[${dataHora}] Evento ${evento.tipo} no conteúdo ${id} (Autor: ${autor})`;
    this.#registros.push(log);
    
    console.log(`[Auditoria] Log gravado: ${evento.tipo} -> ${id}`);
  }

  listarRegistros() {
    return [...this.#registros];
  }
}

module.exports = RegistroDeAtividades;