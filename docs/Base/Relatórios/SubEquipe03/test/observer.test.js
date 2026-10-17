const { describe, test, beforeEach, mock } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const Sujeito = require("../src/Sujeito");
const Observador = require("../src/Observador");
const ServicoDeConteudo = require("../src/ServicoDeConteudo");
const ServicoDeTabCoins = require("../src/ServicoDeTabCoins");
const { NotificadorDeResposta, Notificacao } = require("../src/NotificadorDeResposta");
const { EventoDeConteudo, TipoDeEvento } = require("../src/EventoDeConteudo");
const { RepositorioDeConteudo, Conteudo } = require("../src/RepositorioDeConteudo");
const RegistroDeAtividades = require("../src/RegistroDeAtividades");

class SujeitoDeTeste extends Sujeito {
  disparar(evento) {
    this.notificar(evento);
  }
}

class ObservadorEspiao extends Observador {
  constructor() {
    super();
    this.eventos = [];
  }

  atualizar(evento) {
    this.eventos.push(evento);
  }
}

class ObservadorComFalha extends Observador {
  atualizar() {
    throw new Error("falha simulada");
  }
}

function eventoDeExemplo() {
  return new EventoDeConteudo({
    tipo: TipoDeEvento.COMENTARIO_PUBLICADO,
    conteudo: new Conteudo({ id: "c2", autor: "maria", idPai: "c1", corpo: "Resposta" }),
    conteudoPai: new Conteudo({ id: "c1", autor: "joao", corpo: "Postagem" })
  });
}

function criarCenario() {
  const repositorio = new RepositorioDeConteudo();
  const conteudos = new ServicoDeConteudo(repositorio);
  const tabcoins = new ServicoDeTabCoins();
  const notificador = new NotificadorDeResposta();
  const auditoria = new RegistroDeAtividades();
  conteudos.inscrever(tabcoins);
  conteudos.inscrever(notificador);
  conteudos.inscrever(auditoria);
  const postagem = repositorio.salvar(new Conteudo({ autor: "joao", corpo: "Postagem" }));
  return { repositorio, conteudos, tabcoins, notificador, auditoria, postagem };
}

beforeEach(() => {
  // Silencia as mensagens de demonstração dos componentes durante os testes.
  mock.restoreAll();
  mock.method(console, "log", () => {});
  mock.method(console, "error", () => {});
});

describe("Sujeito (Subject)", () => {
  test("não pode ser instanciado diretamente", () => {
    assert.throws(() => new Sujeito(), TypeError);
  });

  test("inscrever faz o observador receber os eventos notificados", () => {
    const sujeito = new SujeitoDeTeste();
    const espiao = new ObservadorEspiao();
    const evento = eventoDeExemplo();

    sujeito.inscrever(espiao);
    sujeito.disparar(evento);

    assert.deepEqual(espiao.eventos, [evento]);
  });

  test("inscrever o mesmo observador duas vezes não duplica a notificação", () => {
    const sujeito = new SujeitoDeTeste();
    const espiao = new ObservadorEspiao();

    sujeito.inscrever(espiao);
    sujeito.inscrever(espiao);
    sujeito.disparar(eventoDeExemplo());

    assert.equal(espiao.eventos.length, 1);
  });

  test("inscrever rejeita objetos que não estendem Observador", () => {
    const sujeito = new SujeitoDeTeste();
    assert.throws(() => sujeito.inscrever({ atualizar() {} }), TypeError);
  });

  test("desinscrever impede que o observador receba novos eventos", () => {
    const sujeito = new SujeitoDeTeste();
    const espiao = new ObservadorEspiao();

    sujeito.inscrever(espiao);
    sujeito.desinscrever(espiao);
    sujeito.disparar(eventoDeExemplo());

    assert.equal(espiao.eventos.length, 0);
  });

  test("notificar respeita a ordem de inscrição", () => {
    const sujeito = new SujeitoDeTeste();
    const ordem = [];
    class Registrador extends Observador {
      constructor(nome) {
        super();
        this.nome = nome;
      }
      atualizar() {
        ordem.push(this.nome);
      }
    }

    sujeito.inscrever(new Registrador("primeiro"));
    sujeito.inscrever(new Registrador("segundo"));
    sujeito.disparar(eventoDeExemplo());

    assert.deepEqual(ordem, ["primeiro", "segundo"]);
  });

  test("RN06: a falha de um observador não impede a notificação dos demais", () => {
    const sujeito = new SujeitoDeTeste();
    const espiao = new ObservadorEspiao();

    sujeito.inscrever(new ObservadorComFalha());
    sujeito.inscrever(espiao);

    assert.doesNotThrow(() => sujeito.disparar(eventoDeExemplo()));
    assert.equal(espiao.eventos.length, 1);
    assert.equal(console.error.mock.callCount(), 1);
    assert.match(console.error.mock.calls[0].arguments[0], /ObservadorComFalha: falha simulada/);
  });
});

describe("Observador (Observer)", () => {
  test("não pode ser instanciado diretamente", () => {
    assert.throws(() => new Observador(), TypeError);
  });

  test("atualizar lança erro quando a subclasse não o sobrescreve", () => {
    class ObservadorIncompleto extends Observador {}
    assert.throws(
      () => new ObservadorIncompleto().atualizar(eventoDeExemplo()),
      /ObservadorIncompleto deve sobrescrever o método atualizar/
    );
  });
});

describe("EventoDeConteudo e TipoDeEvento", () => {
  test("TipoDeEvento é um enum congelado", () => {
    assert.ok(Object.isFrozen(TipoDeEvento));
    assert.deepEqual(Object.keys(TipoDeEvento), [
      "COMENTARIO_PUBLICADO",
      "CONTEUDO_REMOVIDO",
      "CONTEUDO_EM_REVISAO",
      "CONTEUDO_RESTAURADO"
    ]);
  });

  test("rejeita tipos de evento desconhecidos", () => {
    assert.throws(
      () => new EventoDeConteudo({ tipo: "CURTIDA", conteudo: new Conteudo({ autor: "a", corpo: "b" }) }),
      TypeError
    );
  });

  test("o evento é imutável e conteudoPai é opcional", () => {
    const evento = new EventoDeConteudo({
      tipo: TipoDeEvento.CONTEUDO_REMOVIDO,
      conteudo: new Conteudo({ id: "c1", autor: "joao", corpo: "Postagem" })
    });

    assert.ok(Object.isFrozen(evento));
    assert.equal(evento.conteudoPai, null);
    assert.ok(evento.ocorridoEm instanceof Date);
  });
});

describe("RepositorioDeConteudo", () => {
  test("salvar gera id, buscarPorId encontra e remover apaga", () => {
    const repositorio = new RepositorioDeConteudo();
    const conteudo = repositorio.salvar(new Conteudo({ autor: "joao", corpo: "Postagem" }));

    assert.equal(conteudo.id, "c1");
    assert.equal(repositorio.buscarPorId("c1"), conteudo);

    repositorio.remover("c1");
    assert.equal(repositorio.buscarPorId("c1"), null);
  });
});

describe("ServicoDeConteudo (ConcreteSubject)", () => {
  test("publicarComentario salva o comentário antes de notificar COMENTARIO_PUBLICADO", () => {
    const repositorio = new RepositorioDeConteudo();
    const conteudos = new ServicoDeConteudo(repositorio);
    const postagem = repositorio.salvar(new Conteudo({ autor: "joao", corpo: "Postagem" }));
    let salvoNoMomentoDaNotificacao = null;
    class Verificador extends Observador {
      atualizar(evento) {
        salvoNoMomentoDaNotificacao = repositorio.buscarPorId(evento.conteudo.id);
      }
    }
    const espiao = new ObservadorEspiao();
    conteudos.inscrever(new Verificador());
    conteudos.inscrever(espiao);

    const comentario = conteudos.publicarComentario("maria", postagem.id, "Resposta");

    assert.equal(salvoNoMomentoDaNotificacao, comentario);
    assert.equal(espiao.eventos[0].tipo, TipoDeEvento.COMENTARIO_PUBLICADO);
    assert.equal(espiao.eventos[0].conteudo, comentario);
    assert.equal(espiao.eventos[0].conteudoPai, postagem);
    assert.equal(comentario.idPai, postagem.id);
  });

  test("publicarComentario com pai inexistente lança erro e não notifica", () => {
    const conteudos = new ServicoDeConteudo(new RepositorioDeConteudo());
    const espiao = new ObservadorEspiao();
    conteudos.inscrever(espiao);

    assert.throws(() => conteudos.publicarComentario("maria", "c99", "Resposta"), /c99 não encontrado/);
    assert.equal(espiao.eventos.length, 0);
  });

  test("removerConteudo remove do repositório e notifica CONTEUDO_REMOVIDO", () => {
    const repositorio = new RepositorioDeConteudo();
    const conteudos = new ServicoDeConteudo(repositorio);
    const postagem = repositorio.salvar(new Conteudo({ autor: "joao", corpo: "Postagem" }));
    const espiao = new ObservadorEspiao();
    conteudos.inscrever(espiao);

    conteudos.removerConteudo(postagem.id);

    assert.equal(repositorio.buscarPorId(postagem.id), null);
    assert.equal(espiao.eventos[0].tipo, TipoDeEvento.CONTEUDO_REMOVIDO);
    assert.equal(espiao.eventos[0].conteudo, postagem);
  });

  test("removerConteudo de id inexistente lança erro e não notifica", () => {
    const conteudos = new ServicoDeConteudo(new RepositorioDeConteudo());
    const espiao = new ObservadorEspiao();
    conteudos.inscrever(espiao);

    assert.throws(() => conteudos.removerConteudo("c99"), /c99 não encontrado/);
    assert.equal(espiao.eventos.length, 0);
  });

  test("RN05: não importa os observadores concretos", () => {
    const codigo = fs.readFileSync(path.join(__dirname, "../src/ServicoDeConteudo.js"), "utf8");
    assert.doesNotMatch(codigo, /ServicoDeTabCoins/);
    assert.doesNotMatch(codigo, /NotificadorDeResposta/);
  });

  test("enviarParaRevisao notifica o evento CONTEUDO_EM_REVISAO", () => {
    const { conteudos, auditoria, postagem } = criarCenario();
    conteudos.enviarParaRevisao(postagem.id);

    const logs = auditoria.listarRegistros();
    assert.match(logs[0], /CONTEUDO_EM_REVISAO/);
  });

  test("restaurarConteudo notifica o evento CONTEUDO_RESTAURADO", () => {
    const { conteudos, auditoria, postagem } = criarCenario();
    conteudos.restaurarConteudo(postagem.id);

    const logs = auditoria.listarRegistros();
    assert.match(logs[0], /CONTEUDO_RESTAURADO/);
  });
});

describe("ServicoDeTabCoins (ConcreteObserver)", () => {
  test("RN01: credita o autor quando um comentário é publicado", () => {
    const { conteudos, tabcoins, postagem } = criarCenario();

    conteudos.publicarComentario("maria", postagem.id, "Resposta");

    assert.equal(tabcoins.consultarSaldo("maria"), 1);
  });

  test("RN02: debita o autor quando um conteúdo é removido", () => {
    const { conteudos, tabcoins, postagem } = criarCenario();
    const comentario = conteudos.publicarComentario("maria", postagem.id, "Resposta");

    conteudos.removerConteudo(comentario.id);

    assert.equal(tabcoins.consultarSaldo("maria"), 0);
  });

  test("consultarSaldo de usuário sem movimentação retorna 0", () => {
    assert.equal(new ServicoDeTabCoins().consultarSaldo("ninguem"), 0);
  });

  test("suspende os créditos ao entrar em revisão e restaura ao aprovar", () => {
    const { conteudos, tabcoins, postagem } = criarCenario();
    const comentario = conteudos.publicarComentario("maria", postagem.id, "Resposta");

    assert.equal(tabcoins.consultarSaldo("maria"), 1);

    conteudos.enviarParaRevisao(comentario.id);
    assert.equal(tabcoins.consultarSaldo("maria"), 0);

    conteudos.restaurarConteudo(comentario.id);
    assert.equal(tabcoins.consultarSaldo("maria"), 1);
  });
});

describe("NotificadorDeResposta (ConcreteObserver)", () => {
  test("RN03: notifica o autor do conteúdo pai quando outro usuário responde", () => {
    const { conteudos, notificador, postagem } = criarCenario();

    conteudos.publicarComentario("maria", postagem.id, "Resposta");

    const notificacoes = notificador.listarNotificacoes("joao");
    assert.equal(notificacoes.length, 1);
    assert.ok(notificacoes[0] instanceof Notificacao);
    assert.equal(notificacoes[0].destinatario, "joao");
    assert.match(notificacoes[0].mensagem, /maria respondeu/);
    assert.equal(notificador.listarNotificacoes("maria").length, 0);
  });

  test("RN04: não notifica quem responde ao próprio conteúdo", () => {
    const { conteudos, notificador, postagem } = criarCenario();

    conteudos.publicarComentario("joao", postagem.id, "Complemento");

    assert.equal(notificador.listarNotificacoes("joao").length, 0);
  });

  test("ignora o evento CONTEUDO_REMOVIDO", () => {
    const notificador = new NotificadorDeResposta();

    notificador.atualizar(
      new EventoDeConteudo({
        tipo: TipoDeEvento.CONTEUDO_REMOVIDO,
        conteudo: new Conteudo({ id: "c1", autor: "joao", corpo: "Postagem" })
      })
    );

    assert.equal(notificador.listarNotificacoes("joao").length, 0);
  });

  test("depois de desinscrito, deixa de notificar enquanto o TabCoins continua", () => {
    const { conteudos, tabcoins, notificador, postagem } = criarCenario();

    conteudos.desinscrever(notificador);
    conteudos.publicarComentario("carlos", postagem.id, "Resposta");

    assert.equal(notificador.listarNotificacoes("joao").length, 0);
    assert.equal(tabcoins.consultarSaldo("carlos"), 1);
  });
});

describe("RegistroDeAtividades (ConcreteObserver - Auditoria)", () => {
  test("RN07: grava um histórico sequencial de todos os eventos", () => {
    const { conteudos, auditoria, postagem } = criarCenario();

    const comentario = conteudos.publicarComentario("maria", postagem.id, "Resposta polêmica");
    conteudos.enviarParaRevisao(comentario.id);
    conteudos.restaurarConteudo(comentario.id);
    conteudos.removerConteudo(comentario.id);

    const logs = auditoria.listarRegistros();

    assert.equal(logs.length, 4);
    assert.match(logs[0], /COMENTARIO_PUBLICADO/);
    assert.match(logs[1], /CONTEUDO_EM_REVISAO/);
    assert.match(logs[2], /CONTEUDO_RESTAURADO/);
    assert.match(logs[3], /CONTEUDO_REMOVIDO/);
  });
});
