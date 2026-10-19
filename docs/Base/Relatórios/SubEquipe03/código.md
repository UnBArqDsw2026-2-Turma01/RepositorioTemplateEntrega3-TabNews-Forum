# 3. Código

Esta seção apresenta a implementação do padrão de projeto GoF **Observer**, utilizado para desacoplar o serviço responsável pelo ciclo de vida de conteúdos das diversas reações provocadas por seus eventos (como crédito de moedas, notificações e auditoria). O exemplo foi desenvolvido em JavaScript com Node.js (versão 18 ou superior), sem dependências externas, e segue o Diagrama de Classes e o Diagrama de Sequência apresentados na [Modelagem](/Base/Relatórios/SubEquipe03/modelagem.md).

A implementação é didática e independente do sistema real. Ela não realiza persistência em banco de dados real nem integração com usuários externos: os conteúdos, os saldos de TabCoins, as notificações e os registros de auditoria ficam apenas em memória.

## 1. Organização dos arquivos

A estrutura do projeto segue a Tabela 4 da [Modelagem](/Base/Relatórios/SubEquipe03/modelagem.md?id=_7-correspondência-entre-modelagem-e-implementação):

```text
src/
├── EventoDeConteudo.js        (EventoDeConteudo + TipoDeEvento)
├── NotificadorDeResposta.js   (NotificadorDeResposta + Notificacao)
├── Observador.js
├── RegistroDeAtividades.js
├── RepositorioDeConteudo.js   (RepositorioDeConteudo + Conteudo + EstadoDoConteudo, em memória)
├── ServicoDeConteudo.js
├── ServicoDeTabCoins.js
├── Sujeito.js
└── index.js                   (cliente/demonstração)

test/
└── observer.test.js

package.json
README.md
```

Os participantes do padrão, conforme a estrutura descrita por Gamma et al. (2000), estão distribuídos da seguinte forma:

- **Subject:** `Sujeito`.
- **Observer:** `Observador`.
- **ConcreteSubject:** `ServicoDeConteudo`.
- **ConcreteObserver:** `ServicoDeTabCoins`, `NotificadorDeResposta` e `RegistroDeAtividades`.
- **Cliente:** `index.js`, único ponto que conhece todas as classes concretas.
- **Colaboradores fora do padrão:** `EventoDeConteudo`, `TipoDeEvento`, `RepositorioDeConteudo`, `Conteudo`, `EstadoDoConteudo` e `Notificacao`.

## 2. Classe `Observador`

**Participante GoF:** Observer.  
**Arquivo:** [`src/Observador.js`](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/blob/main/docs/Base/Relat%C3%B3rios/SubEquipe03/src/Observador.js)

```javascript
// Participante GoF: Observer.
class Observador {
  constructor() {
    if (new.target === Observador) {
      throw new TypeError("Observador é abstrata e não pode ser instanciada diretamente.");
    }
  }

  atualizar(evento) {
    throw new Error(`${this.constructor.name} deve sobrescrever o método atualizar(evento).`);
  }
}

module.exports = Observador;
```

A classe `Observador` define o contrato que todo observador concreto deve cumprir: o método `atualizar(evento)`. Como o JavaScript não possui interfaces nem métodos abstratos, o contrato é garantido em tempo de execução, conforme a decisão registrada na seção 6 da modelagem:

- O construtor verifica `new.target` e impede a instanciação direta de `Observador`, já que a classe é abstrata no diagrama.
- A implementação padrão de `atualizar` lança um erro com o nome da subclasse. Assim, um observador que esqueça de sobrescrever o método falha de forma explícita, em vez de ser ignorado em silêncio durante a notificação.

O `Sujeito` depende apenas dessa abstração, e é isso que o desacopla dos observadores concretos.

## 3. Classe `Sujeito`

**Participante GoF:** Subject.  
**Regras:** RN05 e RN06.  
**Arquivo:** [`src/Sujeito.js`](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/blob/main/docs/Base/Relat%C3%B3rios/SubEquipe03/src/Sujeito.js)

```javascript
const Observador = require("./Observador");

// Participante GoF: Subject.
class Sujeito {
  #observadores = [];

  constructor() {
    if (new.target === Sujeito) {
      throw new TypeError("Sujeito é abstrata e não pode ser instanciada diretamente.");
    }
  }

  inscrever(observador) {
    if (!(observador instanceof Observador)) {
      throw new TypeError("Somente instâncias de Observador podem ser inscritas.");
    }
    if (!this.#observadores.includes(observador)) {
      this.#observadores.push(observador);
    }
  }

  desinscrever(observador) {
    this.#observadores = this.#observadores.filter((inscrito) => inscrito !== observador);
  }

  // Protegido por convenção: deve ser chamado apenas pelas subclasses.
  notificar(evento) {
    // Cópia da lista: uma desinscrição durante a notificação não altera o laço.
    for (const observador of [...this.#observadores]) {
      try {
        observador.atualizar(evento);
      } catch (erro) {
        // RN06: a falha de um observador não impede a notificação dos demais.
        console.error(`[Sujeito] Falha em ${observador.constructor.name}: ${erro.message}`);
      }
    }
  }
}

module.exports = Sujeito;
```

A classe abstrata `Sujeito` concentra o mecanismo de inscrição, que é idêntico para qualquer sujeito e, por isso, foi colocado em uma superclasse reutilizável.

- **`#observadores`:** campo privado, correspondente ao atributo `- observadores : Observador[0..*]` do diagrama. Representa a agregação com `Observador`: o sujeito referencia os observadores, mas não controla o ciclo de vida deles.
- **`inscrever(observador)`:** aceita somente instâncias de `Observador` (lança `TypeError` caso contrário) e ignora inscrições repetidas, para que um mesmo observador não seja notificado duas vezes pelo mesmo evento.
- **`desinscrever(observador)`:** remove o observador da lista. As notificações seguintes deixam de alcançá-lo.
- **`notificar(evento)`:** percorre os observadores na ordem de inscrição e chama `atualizar(evento)` em cada um. No diagrama, a operação é protegida (`#`); como o JavaScript não tem esse modificador, a proteção é **por convenção**: apenas as subclasses a chamam.

Dois detalhes do `notificar` merecem destaque:

- **RN06 (isolamento de falhas):** cada chamada a `atualizar` fica em um bloco `try/catch`. Se um observador lançar uma exceção, o erro é registrado com `console.error` e os demais continuam sendo notificados. Sem isso, uma falha no envio de uma notificação impediria, por exemplo, o crédito de TabCoins.
- **Cópia da lista:** a iteração é feita sobre `[...this.#observadores]`. Se um observador se desinscrever durante a notificação, a lista original muda, mas o laço em andamento não é afetado.

A classe não importa nenhum observador concreto, apenas a abstração `Observador` (RN05).

## 4. `EventoDeConteudo` e `TipoDeEvento`

**Papel:** dados da notificação (modelo *push*).  
**Arquivo:** [`src/EventoDeConteudo.js`](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/blob/main/docs/Base/Relat%C3%B3rios/SubEquipe03/src/EventoDeConteudo.js)

```javascript
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
```

O `EventoDeConteudo` é o objeto que trafega do sujeito para os observadores. Ele carrega o `tipo`, o `conteudo` afetado, o `conteudoPai` (opcional, `[0..1]` no diagrama, e `null` quando não se aplica) e o instante `ocorridoEm`. Com isso, os observadores não precisam consultar o sujeito de volta, o que caracteriza o modelo *push* adotado na modelagem.

- **`TipoDeEvento`** é um enum congelado com `Object.freeze`, com os quatro tipos de evento: publicação de comentário, remoção, envio para revisão e restauração.
- O construtor rejeita tipos desconhecidos e eventos sem conteúdo.
- O próprio evento é congelado ao final do construtor. Como o mesmo objeto é entregue a todos os observadores, isso impede que um deles altere o evento recebido pelos seguintes. O congelamento é raso: os objetos `Conteudo` referenciados continuam mutáveis.

## 5. `RepositorioDeConteudo`, `Conteudo` e `EstadoDoConteudo`

**Papel:** colaboradores do sujeito, fora do padrão.  
**Regra:** RN08.  
**Arquivo:** [`src/RepositorioDeConteudo.js`](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/blob/main/docs/Base/Relat%C3%B3rios/SubEquipe03/src/RepositorioDeConteudo.js)

```javascript
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
```

A classe `Conteudo` representa uma postagem ou um comentário, com os atributos `id`, `autor`, `idPai`, `corpo` e `estado` do diagrama. Uma postagem raiz tem `idPai` igual a `null`, e todo conteúdo nasce com o estado `PUBLICADO`.

O enum `EstadoDoConteudo` tem os valores `PUBLICADO` e `EM_REVISAO`, que correspondem aos estados Publicado e Em revisão do Diagrama de Estados da Entrega 02. O estado Removido não é um valor do enum, pois o conteúdo removido deixa de existir no repositório.

O `RepositorioDeConteudo` armazena os conteúdos em um `Map`, apenas em memória:

- **`salvar(conteudo)`** gera um identificador sequencial (`c1`, `c2`, ...) quando o conteúdo ainda não tem `id`, armazena e retorna o próprio conteúdo. Quando o conteúdo já tem `id`, a operação o atualiza.
- **`buscarPorId(id)`** retorna o conteúdo ou `null`, quando ele não existe.
- **`remover(id)`** apaga o conteúdo.

O repositório não participa do padrão. Ele existe para que o `ServicoDeConteudo` tenha onde buscar o conteúdo pai e persistir o comentário antes de notificar, como mostra o Diagrama de Sequência.

## 6. Classe `ServicoDeConteudo`

**Participante GoF:** ConcreteSubject.  
**Regras:** RN05 e RN08.  
**Arquivo:** [`src/ServicoDeConteudo.js`](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/blob/main/docs/Base/Relat%C3%B3rios/SubEquipe03/src/ServicoDeConteudo.js)

```javascript
const Sujeito = require("./Sujeito");
const { EventoDeConteudo, TipoDeEvento } = require("./EventoDeConteudo");
const { Conteudo, EstadoDoConteudo } = require("./RepositorioDeConteudo");

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

  enviarParaRevisao(id) {
    const conteudo = this.#repositorio.buscarPorId(id);
    if (!conteudo) {
      throw new Error(`Conteúdo ${id} não encontrado.`);
    }
    if (conteudo.estado !== EstadoDoConteudo.PUBLICADO) {
      throw new Error(`Conteúdo ${id} não está publicado.`);
    }

    conteudo.estado = EstadoDoConteudo.EM_REVISAO;
    this.#repositorio.salvar(conteudo);

    console.log(`[Conteudo] ${id} de ${conteudo.autor} foi enviado para revisão (Oculto)`);
    this.notificar(new EventoDeConteudo({ tipo: TipoDeEvento.CONTEUDO_EM_REVISAO, conteudo }));
  }

  restaurarConteudo(id) {
    const conteudo = this.#repositorio.buscarPorId(id);
    if (!conteudo) {
      throw new Error(`Conteúdo ${id} não encontrado.`);
    }
    if (conteudo.estado !== EstadoDoConteudo.EM_REVISAO) {
      throw new Error(`Conteúdo ${id} não está em revisão.`);
    }

    conteudo.estado = EstadoDoConteudo.PUBLICADO;
    this.#repositorio.salvar(conteudo);

    console.log(`[Conteudo] ${id} de ${conteudo.autor} foi restaurado pela moderação`);
    this.notificar(new EventoDeConteudo({ tipo: TipoDeEvento.CONTEUDO_RESTAURADO, conteudo }));
  }
}

module.exports = ServicoDeConteudo;
```

O `ServicoDeConteudo` estende `Sujeito` e herda o mecanismo de inscrição. Ele recebe o repositório no construtor e o guarda no campo privado `#repositorio`, correspondente ao atributo `- repositorio` do diagrama. É responsável pelo ciclo de vida do conteúdo:

- **`publicarComentario(autor, idPai, corpo)`** busca o conteúdo pai, salva o comentário e **só depois** notifica um evento `COMENTARIO_PUBLICADO`, com o comentário e o pai. A ordem garante que, quando um observador é notificado, o comentário já está persistido. Se o pai não existir, o método lança um erro e nenhum observador é notificado.
- **`removerConteudo(id)`** busca o conteúdo, remove-o e notifica um evento `CONTEUDO_REMOVIDO`.
- **`enviarParaRevisao(id)`** só aceita um conteúdo `PUBLICADO`: muda o estado para `EM_REVISAO`, salva e notifica `CONTEUDO_EM_REVISAO`.
- **`restaurarConteudo(id)`** só aceita um conteúdo `EM_REVISAO`: devolve o estado para `PUBLICADO`, salva e notifica `CONTEUDO_RESTAURADO`.

Em todos os métodos, um id inexistente ou uma transição de estado não permitida lança um erro antes da notificação. Essas verificações seguem o Diagrama de Estados da Entrega 02 e impedem créditos e débitos duplicados de TabCoins (RN08).

O ponto central do padrão está no que essa classe **não** faz: ela não importa `ServicoDeTabCoins`, `NotificadorDeResposta` nem `RegistroDeAtividades` e não sabe quantos observadores existem (RN05). Na Entrega 02, o `ContentService` chamava `creditarPorPublicacao` diretamente; aqui, essa chamada foi substituída por `this.notificar(evento)`.

## 7. Classe `ServicoDeTabCoins`

**Participante GoF:** ConcreteObserver.  
**Regras:** RN01, RN02 e RN08.  
**Arquivo:** [`src/ServicoDeTabCoins.js`](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/blob/main/docs/Base/Relat%C3%B3rios/SubEquipe03/src/ServicoDeTabCoins.js)

```javascript
const Observador = require("./Observador");
const { TipoDeEvento } = require("./EventoDeConteudo");
const { EstadoDoConteudo } = require("./RepositorioDeConteudo");

const VALOR_POR_CONTEUDO = 1;

// Participante GoF: ConcreteObserver.
class ServicoDeTabCoins extends Observador {
  #saldos = new Map();

  atualizar(evento) {
    switch (evento.tipo) {
      case TipoDeEvento.COMENTARIO_PUBLICADO:
      case TipoDeEvento.CONTEUDO_RESTAURADO:
        this.#creditar(evento.conteudo.autor);
        break;
      case TipoDeEvento.CONTEUDO_EM_REVISAO:
        this.#debitar(evento.conteudo.autor);
        break;
      case TipoDeEvento.CONTEUDO_REMOVIDO:
        // Conteúdo removido em revisão já teve os créditos suspensos.
        if (evento.conteudo.estado === EstadoDoConteudo.PUBLICADO) {
          this.#debitar(evento.conteudo.autor);
        }
        break;
    }
  }

  consultarSaldo(usuario) {
    return this.#saldos.get(usuario) ?? 0;
  }

  #creditar(usuario) {
    this.#saldos.set(usuario, this.consultarSaldo(usuario) + VALOR_POR_CONTEUDO);
    console.log(`[TabCoins] +${VALOR_POR_CONTEUDO} para ${usuario} (saldo: ${this.consultarSaldo(usuario)})`);
  }

  #debitar(usuario) {
    this.#saldos.set(usuario, this.consultarSaldo(usuario) - VALOR_POR_CONTEUDO);
    console.log(`[TabCoins] -${VALOR_POR_CONTEUDO} para ${usuario} (saldo: ${this.consultarSaldo(usuario)})`);
  }
}

module.exports = ServicoDeTabCoins;
```

O `ServicoDeTabCoins` estende `Observador` e mantém os saldos no campo privado `#saldos`, um `Map` de usuário para saldo, correspondente ao atributo `- saldos : Map<String, Integer>` do diagrama.

- **`atualizar(evento)`** decide como reagir a cada tipo: credita o autor quando um comentário é publicado (**RN01**) ou restaurado e debita o autor quando o conteúdo vai para revisão ou é removido (**RN02**). Na remoção, o débito só ocorre se o conteúdo estava publicado, pois um conteúdo em revisão já teve os créditos suspensos (**RN08**).
- **`consultarSaldo(usuario)`** retorna o saldo atual, ou `0` para um usuário sem movimentação.
- **`#creditar`** e **`#debitar`** são privados e correspondem às operações `- creditar` e `- debitar` do diagrama.

O valor de cada crédito ou débito é fixo em 1 (`VALOR_POR_CONTEUDO`), já que a modelagem não define valores.

## 8. Classes `NotificadorDeResposta` e `Notificacao`

**Participante GoF:** ConcreteObserver.  
**Regras:** RN03 e RN04.  
**Arquivo:** [`src/NotificadorDeResposta.js`](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/blob/main/docs/Base/Relat%C3%B3rios/SubEquipe03/src/NotificadorDeResposta.js)

```javascript
const Observador = require("./Observador");
const { TipoDeEvento } = require("./EventoDeConteudo");

class Notificacao {
  constructor({ destinatario, mensagem }) {
    this.destinatario = destinatario;
    this.mensagem = mensagem;
  }
}

// Participante GoF: ConcreteObserver.
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
        mensagem: `${comentario.autor} respondeu ao seu conteúdo ${conteudoPai.id}: "${comentario.corpo}"`
      })
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
```

O `NotificadorDeResposta` estende `Observador` e guarda as notificações no campo privado `#notificacoes`. A classe `Notificacao` fica no mesmo arquivo, pois só existe no contexto do notificador, o que corresponde à composição do diagrama.

- **`atualizar(evento)`** ignora eventos que não sejam `COMENTARIO_PUBLICADO`. Isso mostra que **cada observador decide a quais eventos reage**, sem que o sujeito precise filtrar os destinatários.
- Quando o autor do comentário é o mesmo do conteúdo pai, nenhuma notificação é gerada (**RN04**).
- Nos demais casos, uma `Notificacao` é registrada para o autor do conteúdo pai (**RN03**) pelo método privado `#registrar`.
- **`listarNotificacoes(usuario)`** retorna as notificações destinadas ao usuário.

Esse observador concretiza a responsabilidade que, no Diagrama de Implantação da Entrega 02, cabia ao nó externo Serviço de e-mail. Na demonstração, a notificação é apenas registrada em memória e impressa no terminal.

## 9. Classe `RegistroDeAtividades`

**Participante GoF:** ConcreteObserver.  
**Regra:** RN07.  
**Arquivo:** [`src/RegistroDeAtividades.js`](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/blob/main/docs/Base/Relat%C3%B3rios/SubEquipe03/src/RegistroDeAtividades.js)

```javascript
const Observador = require("./Observador");

// Participante GoF: ConcreteObserver.
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
```

O `RegistroDeAtividades` atua como log de auditoria. Diferente dos demais observadores, ele reage a todos os tipos de evento: para cada um, grava no campo privado `#registros` uma linha com a data e a hora do evento, o tipo, o id do conteúdo e o autor (**RN07**). O método `listarRegistros()` retorna uma cópia da lista, de modo que quem a consulta não altera o histórico gravado.

Esse observador é um exemplo da efetivação do Princípio Aberto/Fechado: a auditoria foi acrescentada sem nenhuma alteração no `ServicoDeConteudo`, apenas com uma nova subclasse de `Observador` inscrita pelo cliente.

## 10. Programa de demonstração

**Participante GoF:** Cliente.  
**Arquivo:** [`src/index.js`](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/blob/main/docs/Base/Relat%C3%B3rios/SubEquipe03/src/index.js)

```javascript
// Cliente: compõe os objetos e reproduz as etapas do Diagrama de Sequência.
const Observador = require("./Observador");
const ServicoDeConteudo = require("./ServicoDeConteudo");
const ServicoDeTabCoins = require("./ServicoDeTabCoins");
const { NotificadorDeResposta } = require("./NotificadorDeResposta");
const RegistroDeAtividades = require("./RegistroDeAtividades");
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
const auditoria = new RegistroDeAtividades();

// Postagem inicial salva direto no repositório, sem evento, para servir de conteúdo pai.
const postagem = repositorio.salvar(new Conteudo({ autor: "joao", corpo: "Como aplicar o padrão Observer?" }));
console.log(`[Cliente] Postagem ${postagem.id} de ${postagem.autor} criada como ponto de partida`);

etapa("1. Configuração: inscrição dos observadores");
conteudos.inscrever(tabcoins);
console.log("[Cliente] ServicoDeTabCoins inscrito");
conteudos.inscrever(notificador);
console.log("[Cliente] NotificadorDeResposta inscrito");
conteudos.inscrever(auditoria);
console.log("[Cliente] RegistroDeAtividades inscrito");

etapa("2. Publicação de comentários");
const comentarioDaMaria = conteudos.publicarComentario("maria", postagem.id, "Use uma classe Sujeito.");
conteudos.publicarComentario("joao", postagem.id, "Obrigado, vou testar!");

etapa("3. Moderação: Envio para Revisão e Restauração");
conteudos.enviarParaRevisao(comentarioDaMaria.id);
conteudos.restaurarConteudo(comentarioDaMaria.id);

etapa("4. Remoção de conteúdo");
conteudos.removerConteudo(comentarioDaMaria.id);

etapa("5. Desinscrição do NotificadorDeResposta");
conteudos.desinscrever(notificador);
console.log("[Cliente] NotificadorDeResposta desinscrito");
conteudos.publicarComentario("carlos", postagem.id, "Também dá para usar funções.");

etapa("6. Extra (RN06): um observador que falha não impede os demais");
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
console.log(`[Auditoria] Total de eventos registrados no log: ${auditoria.listarRegistros().length}`);
```

O `index.js` é o cliente: compõe os objetos, injetando as dependências e inscrevendo os observadores em tempo de execução, e é o único arquivo que conhece todas as classes concretas. Ele reproduz as etapas do Diagrama de Sequência e acrescenta uma etapa extra:

1. **Configuração:** inscreve o `ServicoDeTabCoins`, o `NotificadorDeResposta` e o `RegistroDeAtividades` no `ServicoDeConteudo`.
2. **Publicação de comentários:** `maria` responde à postagem de `joao`, que recebe crédito e notificação. Em seguida, `joao` responde à própria postagem, o que exercita o outro ramo do fragmento `alt`: ele recebe o crédito, mas não é notificado (RN04).
3. **Moderação:** o comentário de `maria` é enviado para revisão, o que suspende o crédito dela, e depois restaurado, o que o devolve.
4. **Remoção de conteúdo:** o comentário de `maria` é removido. O TabCoins debita a autora e o notificador ignora o evento.
5. **Desinscrição:** o `NotificadorDeResposta` é desinscrito, e o comentário seguinte só gera crédito e registro de auditoria.
6. **Extra (RN06):** um `ObservadorComFalha`, definido apenas na demonstração, é inscrito antes do `NotificadorDeResposta`. A falha é registrada pelo `Sujeito`, e o notificador, inscrito depois dele, continua recebendo o evento.

A postagem inicial é salva direto no repositório, sem passar pelo serviço, apenas para servir de conteúdo pai. Por isso, ela não gera evento nem crédito. Ao final, um resumo imprime o saldo de cada usuário, a quantidade de notificações de `joao` e o total de eventos registrados na auditoria.

Cada mensagem do terminal é prefixada pelo componente que a produziu (`[Cliente]`, `[Conteudo]`, `[TabCoins]`, `[Notificador]`, `[Auditoria]` e `[Sujeito]`), o que permite acompanhar a ordem das chamadas. A saída real da execução está registrada na página [Execução](/Base/Relatórios/SubEquipe03/execução.md).

## 11. Testes automatizados

**Arquivo:** [`test/observer.test.js`](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/blob/main/docs/Base/Relat%C3%B3rios/SubEquipe03/test/observer.test.js)

Os testes utilizam o módulo nativo `node:test` e a biblioteca `node:assert/strict`, sem dependências externas. São 32 testes, organizados em 8 suítes, uma para cada participante ou colaborador. As mensagens dos componentes são silenciadas com `mock.method`, para que a saída mostre apenas o resultado dos testes.

O arquivo define três auxiliares: `SujeitoDeTeste`, que expõe `notificar` por meio do método `disparar`; `ObservadorEspiao`, que guarda os eventos recebidos; e `ObservadorComFalha`, que sempre lança um erro.

| Suíte | Comportamento verificado | Regra |
|---|---|---|
| `Sujeito (Subject)` | Não pode ser instanciado diretamente. | — |
| | `inscrever` faz o observador receber os eventos. | — |
| | Inscrever o mesmo observador duas vezes não duplica a notificação. | — |
| | `inscrever` rejeita objetos que não estendem `Observador`. | — |
| | `desinscrever` impede o recebimento de novos eventos. | — |
| | `notificar` respeita a ordem de inscrição. | — |
| | A falha de um observador não impede a notificação dos demais. | RN06 |
| `Observador (Observer)` | Não pode ser instanciado diretamente. | — |
| | `atualizar` lança erro quando não é sobrescrito. | — |
| `EventoDeConteudo e TipoDeEvento` | `TipoDeEvento` é um enum congelado com os quatro tipos. | — |
| | Tipos de evento desconhecidos são rejeitados. | — |
| | O evento é imutável e `conteudoPai` é opcional. | — |
| `RepositorioDeConteudo` | `salvar` gera o id e o estado inicial, `buscarPorId` encontra e `remover` apaga. | — |
| `ServicoDeConteudo (ConcreteSubject)` | `publicarComentario` salva antes de notificar `COMENTARIO_PUBLICADO`. | — |
| | Pai inexistente lança erro e não notifica. | — |
| | `removerConteudo` remove e notifica `CONTEUDO_REMOVIDO`. | — |
| | Id inexistente na remoção lança erro e não notifica. | — |
| | Não importa os observadores concretos. | RN05 |
| | `enviarParaRevisao` notifica `CONTEUDO_EM_REVISAO`. | — |
| | `restaurarConteudo` notifica `CONTEUDO_RESTAURADO`. | — |
| | `enviarParaRevisao` só aceita conteúdo publicado. | RN08 |
| | `restaurarConteudo` só aceita conteúdo em revisão. | RN08 |
| `ServicoDeTabCoins (ConcreteObserver)` | Credita o autor quando um comentário é publicado. | RN01 |
| | Debita o autor quando um conteúdo é removido. | RN02 |
| | Usuário sem movimentação tem saldo 0. | — |
| | Suspende os créditos na revisão e os restaura na aprovação. | RN08 |
| | Não debita de novo ao remover um conteúdo em revisão. | RN08 |
| `NotificadorDeResposta (ConcreteObserver)` | Notifica o autor do pai quando outro usuário responde. | RN03 |
| | Não notifica quem responde ao próprio conteúdo. | RN04 |
| | Ignora o evento `CONTEUDO_REMOVIDO`. | — |
| | Depois de desinscrito, deixa de notificar enquanto o TabCoins continua. | — |
| `RegistroDeAtividades (ConcreteObserver - Auditoria)` | Grava um histórico sequencial de todos os eventos. | RN07 |

<p align="center">Tabela 1: Testes automatizados e regras cobertas.<br>Autoria: Leonardo Bonetti, a partir dos testes de Leonardo Bonetti e Guilherme Moura.</p>

Três testes merecem observação:

- O teste da **RN06** foi validado por mutação: ao retirar o `try/catch` do `notificar`, ele falha, o que confirma que verifica de fato o isolamento.
- Os testes da **RN08** também foram validados contra a versão anterior da moderação, sem controle de estado, na qual os três falham.
- O teste da **RN05** lê o código-fonte de `ServicoDeConteudo.js` e verifica que os nomes dos observadores concretos não aparecem. É uma verificação textual e, portanto, frágil, mas objetiva para a regra.

O código completo dos testes é apresentado a seguir:

```javascript
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
const { RepositorioDeConteudo, Conteudo, EstadoDoConteudo } = require("../src/RepositorioDeConteudo");
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
    assert.equal(conteudo.estado, EstadoDoConteudo.PUBLICADO);
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
    conteudos.enviarParaRevisao(postagem.id);
    conteudos.restaurarConteudo(postagem.id);

    const logs = auditoria.listarRegistros();
    assert.match(logs[1], /CONTEUDO_RESTAURADO/);
    assert.equal(postagem.estado, EstadoDoConteudo.PUBLICADO);
  });

  test("enviarParaRevisao só aceita conteúdo publicado", () => {
    const { conteudos, auditoria, postagem } = criarCenario();
    conteudos.enviarParaRevisao(postagem.id);

    assert.equal(postagem.estado, EstadoDoConteudo.EM_REVISAO);
    assert.throws(() => conteudos.enviarParaRevisao(postagem.id), /não está publicado/);
    assert.equal(auditoria.listarRegistros().length, 1);
  });

  test("restaurarConteudo só aceita conteúdo em revisão", () => {
    const { conteudos, auditoria, postagem } = criarCenario();

    assert.throws(() => conteudos.restaurarConteudo(postagem.id), /não está em revisão/);
    assert.equal(auditoria.listarRegistros().length, 0);
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

  test("não debita de novo ao remover um conteúdo que está em revisão", () => {
    const { conteudos, tabcoins, postagem } = criarCenario();
    const comentario = conteudos.publicarComentario("maria", postagem.id, "Resposta");

    conteudos.enviarParaRevisao(comentario.id);
    conteudos.removerConteudo(comentario.id);

    assert.equal(tabcoins.consultarSaldo("maria"), 0);
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
```

## 12. Configuração do projeto

**Arquivo:** [`package.json`](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/blob/main/docs/Base/Relat%C3%B3rios/SubEquipe03/package.json)

```json
{
  "name": "subequipe03-gof-comportamentais-observer",
  "version": "1.0.0",
  "private": true,
  "description": "Exemplo didático do padrão GoF Observer aplicado aos eventos de conteúdo do fórum",
  "scripts": {
    "start": "node src/index.js",
    "test": "node --test"
  },
  "engines": {
    "node": ">=18"
  }
}
```

O `package.json` declara o Node.js 18 ou superior e os scripts `start` e `test`. O projeto não tem dependências. A versão do Node.js também pode ser gerenciada com o `mise`, conforme as [Iniciativas Extras](/Base/1.3.IniciativasExtras.md).

## 13. Execução do programa

Para executar o exemplo e a suíte de testes, utilize o Node.js na versão 18 ou superior. Com o terminal aberto na pasta `docs/Base/Relatórios/SubEquipe03/`, utilize os comandos abaixo.

Para simular o sistema e observar a saída no terminal:

```bash
npm start
```

Para rodar as validações automatizadas:

```bash
npm test
```

Os comandos equivalem a `node src/index.js` e `node --test`. Os procedimentos completos e a saída obtida estão na página [Execução](/Base/Relatórios/SubEquipe03/execução.md).

## 14. Correspondência entre o Diagrama de Classes e o código

A tabela a seguir confirma que cada elemento do [Diagrama de Classes](/Base/Relatórios/SubEquipe03/modelagem.md?id=_3-diagrama-de-classes-uml) existe no código, com o mesmo nome.

| Elemento do diagrama | Membros no diagrama | Implementação | Arquivo |
|---|---|---|---|
| `Sujeito` `<<Subject>>` (abstrata) | `- observadores`, `+ inscrever`, `+ desinscrever`, `# notificar` | `#observadores`, `inscrever`, `desinscrever`, `notificar` (protegido por convenção); o construtor impede a instanciação direta | `src/Sujeito.js` |
| `Observador` `<<Observer>>` (abstrata) | `+ {abstract} atualizar` | `atualizar` lança erro se não for sobrescrito; o construtor impede a instanciação direta | `src/Observador.js` |
| `ServicoDeConteudo` `<<ConcreteSubject>>` | `- repositorio`, `+ publicarComentario`, `+ removerConteudo`, `+ enviarParaRevisao`, `+ restaurarConteudo` | `#repositorio` e os quatro métodos, com os mesmos parâmetros | `src/ServicoDeConteudo.js` |
| `ServicoDeTabCoins` `<<ConcreteObserver>>` | `- saldos`, `+ atualizar`, `+ consultarSaldo`, `- creditar`, `- debitar` | `#saldos` (`Map`), `atualizar`, `consultarSaldo`, `#creditar`, `#debitar` | `src/ServicoDeTabCoins.js` |
| `NotificadorDeResposta` `<<ConcreteObserver>>` | `- notificacoes`, `+ atualizar`, `+ listarNotificacoes`, `- registrar` | `#notificacoes` (array), `atualizar`, `listarNotificacoes`, `#registrar` | `src/NotificadorDeResposta.js` |
| `RegistroDeAtividades` `<<ConcreteObserver>>` | `- registros`, `+ atualizar`, `+ listarRegistros` | `#registros` (array), `atualizar`, `listarRegistros` | `src/RegistroDeAtividades.js` |
| `Notificacao` | `+ destinatario`, `+ mensagem` | `destinatario`, `mensagem` | `src/NotificadorDeResposta.js` |
| `EventoDeConteudo` | `+ tipo`, `+ conteudo`, `+ conteudoPai [0..1]`, `+ ocorridoEm` | Os quatro atributos; `conteudoPai` é `null` por padrão e o objeto é congelado | `src/EventoDeConteudo.js` |
| `TipoDeEvento` (enum) | `COMENTARIO_PUBLICADO`, `CONTEUDO_REMOVIDO`, `CONTEUDO_EM_REVISAO`, `CONTEUDO_RESTAURADO` | Objeto congelado com `Object.freeze` | `src/EventoDeConteudo.js` |
| `Conteudo` | `+ id`, `+ autor`, `+ idPai [0..1]`, `+ corpo`, `+ estado` | Os cinco atributos; `id` e `idPai` são `null` por padrão e `estado` começa em `PUBLICADO` | `src/RepositorioDeConteudo.js` |
| `EstadoDoConteudo` (enum) | `PUBLICADO`, `EM_REVISAO` | Objeto congelado com `Object.freeze` | `src/RepositorioDeConteudo.js` |
| `RepositorioDeConteudo` | `+ salvar`, `+ buscarPorId`, `+ remover` | Os três métodos, sobre um `Map` em memória | `src/RepositorioDeConteudo.js` |
| `ServicoDeConteudo --\|> Sujeito` | Generalização | `class ServicoDeConteudo extends Sujeito` | `src/ServicoDeConteudo.js` |
| Observadores concretos `--\|> Observador` | Generalização | `extends Observador` nas três classes | `src/ServicoDeTabCoins.js`, `src/NotificadorDeResposta.js`, `src/RegistroDeAtividades.js` |
| `Sujeito` notifica `Observador` (`0..*`) | Agregação | Array `#observadores`, preenchido pelo cliente | `src/Sujeito.js` |
| `ServicoDeConteudo` persiste em `RepositorioDeConteudo` (`1`) | Associação | Repositório recebido no construtor | `src/ServicoDeConteudo.js` |
| `ServicoDeConteudo ..> EventoDeConteudo : <<create>>` | Dependência | `new EventoDeConteudo(...)` nos quatro métodos | `src/ServicoDeConteudo.js` |
| `NotificadorDeResposta` registra `Notificacao` (`0..*`) | Composição | As notificações são criadas e guardadas apenas pelo notificador | `src/NotificadorDeResposta.js` |
| `Conteudo` encontra-se em `EstadoDoConteudo` (`1`) | Associação | Atributo `estado` | `src/RepositorioDeConteudo.js` |

<p align="center">Tabela 2: Correspondência entre os elementos do Diagrama de Classes e o código.<br>Autoria: Leonardo Bonetti.</p>

## 15. Considerações sobre a implementação

A implementação demonstra que o `ServicoDeConteudo` consegue publicar, remover e moderar conteúdos sem conhecer quem reage a esses eventos. A inclusão do `RegistroDeAtividades` comprovou isso na prática: a auditoria foi acrescentada sem alterar o sujeito nem os demais observadores, apenas com uma nova subclasse de `Observador` inscrita no cliente. Os testes verificam cada participante isoladamente, com observadores simulados, o que ilustra a testabilidade citada na fundamentação teórica.

Alguns pontos da implementação vão além do que os diagramas mostram:

- **Regras de inscrição.** A rejeição de objetos que não estendem `Observador` e o descarte de inscrições repetidas não constam na modelagem.
- **Conteúdo inexistente.** O lançamento de erro, sem notificação, quando o id não existe não aparece no Diagrama de Sequência, que mostra apenas o caminho principal.
- **Remoção de comentário.** O evento `CONTEUDO_REMOVIDO` é emitido com `conteudoPai` igual a `null`, mesmo quando o conteúdo removido é um comentário, já que nenhum observador atual precisa do pai nesse caso.
- **Valor dos TabCoins.** O crédito e o débito são fixos em 1, e o saldo pode ficar negativo, por exemplo ao remover a postagem inicial, que foi criada sem evento.
- **Demonstração.** A etapa 2 publica dois comentários, e a etapa 6 (RN06) não está no Diagrama de Sequência; ambas foram incluídas para exercitar todos os ramos e regras.

As limitações reconhecidas na modelagem também se aplicam: a notificação é síncrona, executada na ordem de inscrição, e não há fila, nova tentativa ou persistência das falhas, que apenas são registradas com `console.error`. A solução tem finalidade didática e não representa uma integração funcional com o sistema real do Projeto Fórum.

## 16. Pontos de Vista dos Integrantes

Esta seção apresenta as percepções dos integrantes sobre a implementação do padrão Observer.

### Caio Alexandre Ornelas Silva

Como responsável pela modelagem, acompanhei a implementação principalmente pelo ponto de vista da correspondência entre o diagrama e o código. A Tabela 4 da modelagem previa um arquivo para cada classe, e o código seguiu essa organização. Isso permitiu verificar cada participante do GoF diretamente no arquivo correspondente. A decisão de representar o `Observador` como classe base, e não como contrato por convenção, também se mostrou acertada: a verificação com `new.target` e o erro lançado por `atualizar` tornaram explícito, em tempo de execução, um contrato que o JavaScript não oferece por meio de interfaces.

A implementação também expôs lacunas da modelagem original. O primeiro Diagrama de Classes não previa o estado do conteúdo, e a moderação, da forma como foi modelada, permitia créditos duplicados de TabCoins. A falha só apareceu quando o código e os testes exercitaram a sequência de revisão e restauração, e foi corrigida com o `EstadoDoConteudo` (RN08), com a atualização dos diagramas. Do mesmo modo, as regras de inscrição e o tratamento de conteúdo inexistente, listados na seção 15, surgiram no código sem constar no modelo. Aprendi que o diagrama orienta a implementação, mas é a implementação que revela o que o diagrama deixou de dizer, e que os dois artefatos precisam ser revisados juntos.

Por fim, a inclusão do `RegistroDeAtividades` sem nenhuma alteração no `ServicoDeConteudo` confirmou, no código, o argumento central da justificativa do padrão: novas reações a um evento passam a ser uma extensão, e não uma modificação, do serviço de conteúdos.

### Guilherme Moura da Silva Neto

Com a expansão da implementação do padrão Observer, compreendi na prática como ele resolve problemas de acoplamento. A adição do log de auditoria (`RegistroDeAtividades`) e dos fluxos de moderação evidenciou o Princípio Aberto/Fechado (OCP), pois foi possível criar novas reações a eventos sem precisar modificar o serviço central de conteúdos.

Também percebi a importância de aliar a teoria a uma boa documentação de execução e testes. Acompanhar os logs no terminal e comprovar o isolamento de falhas demonstrou na prática como o desacoplamento impede que erros em reações secundárias (como uma falha no disparo de notificações) interrompam o fluxo principal do sistema, garantindo a resiliência da aplicação.

### Leonardo Fachinello Bonetti

Implementar o Observer a partir do Diagrama de Classes mostrou o valor de uma modelagem bem definida: com os nomes, as responsabilidades e as regras já descritos, o código passou a ser uma tradução do diagrama, e qualquer divergência ficava evidente. Como o JavaScript não tem interfaces, a classe base `Observador`, que lança erro quando `atualizar` não é sobrescrito, foi a forma encontrada para garantir o contrato.

O principal ganho percebido foi o desacoplamento. O `ServicoDeConteudo` não importa nenhum observador concreto, o que permitiu acrescentar o `RegistroDeAtividades` e os fluxos de moderação sem alterar a lógica de notificação. Por outro lado, a notificação síncrona exige cuidado: sem o isolamento de falhas do `Sujeito` (RN06), um erro em um observador interromperia os demais.

## 17. Participação e Evidências

Esta seção registra as atividades relacionadas à implementação e à documentação do padrão Observer. As evidências correspondem aos arquivos desenvolvidos e aos commits do repositório.

### Caio Alexandre Ornelas Silva

**Atividades desenvolvidas:**

- Elaboração do Diagrama de Classes, que definiu os participantes do padrão, as classes, os atributos e as operações implementados no código.
- Elaboração do Diagrama de Sequência, que definiu as etapas reproduzidas pelo programa de demonstração (`index.js`).
- Definição da correspondência prevista entre a modelagem e a implementação (Tabela 4 da modelagem), com um arquivo para cada classe.
- Decisões de modelagem adotadas no código: `Observador` como classe base, modelo *push* com o `EventoDeConteudo` e isolamento de falhas entre observadores (RN06).
- Registro do ponto de vista sobre a correspondência entre a modelagem e a implementação e do nível de contribuição nesta página.

**Evidências relacionadas:**

| Evidência | Descrição |
|---|---|
| [Modelagem](https://unbarqdsw2026-2-turma01.github.io/RepositorioTemplateEntrega3-TabNews-Forum/#/Base/Relatórios/SubEquipe03/modelagem) | Documento com os Diagramas de Classes e de Sequência e a Tabela 4 de correspondência com a implementação. |
| [Commit da modelagem](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/9358072fb7ae404b92850deefcd7204ae53b467a) | Criação dos diagramas em PlantUML, das regras modeladas e das decisões de modelagem. |
| [Suporte ao PlantUML](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/2db3b5efbe0a4b78c20dbf7f07a1128a36b97468) | Configuração que permite manter os diagramas como texto versionado junto ao código. |
| [Ponto de vista e nível de contribuição](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/c32a23ac3fd39218b21bd5f4a79b43fd6ac271b5) | Inclusão do ponto de vista e da linha de nível de contribuição nesta página. |

### Guilherme Moura da Silva Neto

**Atividades desenvolvidas:**

* Expansão da implementação com a criação do observador `RegistroDeAtividades` para atuar como log de auditoria (RN07).
* Integração dos fluxos de moderação (Revisão e Restauração) nos arquivos `ServicoDeConteudo` e `ServicoDeTabCoins`.
* Evolução da suíte de testes automatizados (`observer.test.js`) utilizando `node:test` para incluir a validação das regras de negócio de moderação e auditoria.
* Elaboração e estruturação dos documentos referentes ao Código (`codigo.md`) e à Execução (`execucao.md`).

**Evidências relacionadas:**

| Evidência | Descrição |
| --- | --- |
| [`src/RegistroDeAtividades.js`](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/aca6ba0bdfc39196b54449321a6386eb0b72c8cd) | Criação do observador concreto focado no log cronológico de auditoria (RN07). |
| [Fluxos de Moderação](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/756cd77a56de084432fa410c3264b5020c19e91c) | Refatoração de `ServicoDeConteudo` e `ServicoDeTabCoins` para tratar eventos de revisão e restauração. |
| [`test/observer.test.js`](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/fdd9ed166317a1b36b65e50c9a253882ac5a82c1) | Implementação dos cenários de teste automatizados para auditoria e flutuação de moedas na moderação. |
| [`docs/codigo.md`](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/5df1a1dbf755776bb6bff98348d80009ff5b9131) | Estruturação final e formatação do documento de código. |

### Leonardo Fachinello Bonetti

**Atividades desenvolvidas:**

- Implementação da base do padrão: classes `Observador` e `Sujeito`, com o isolamento de falhas entre observadores (RN06), `EventoDeConteudo` imutável, enum `TipoDeEvento` e `RepositorioDeConteudo` e `Conteudo` em memória.
- Implementação do sujeito concreto `ServicoDeConteudo`, que salva o conteúdo antes de notificar, e dos observadores concretos `ServicoDeTabCoins` (RN01 e RN02) e `NotificadorDeResposta` (RN03 e RN04).
- Programa de demonstração (`index.js`) com as etapas do Diagrama de Sequência e uma etapa extra em que um observador falha de propósito (RN06).
- Testes automatizados com `node:test` para as regras RN01 a RN06, `package.json` com os scripts `start` e `test` e `README.md`.
- Correção da moderação: enum `EstadoDoConteudo`, verificação do estado em `enviarParaRevisao` e `restaurarConteudo` e débito apenas de conteúdo publicado (RN08), com novos testes, e alinhamento do código de moderação e auditoria ao padrão do grupo.
- Ampliação desta página: código de todas as classes extraído dos arquivos, participante GoF e regras de cada trecho, Tabela 1 (testes) e Tabela 2 (correspondência com o Diagrama de Classes).
- Criação das seções de pontos de vista, participação e nível de contribuição desta página, com o ponto de vista do Leonardo.

**Evidências relacionadas:**

| Evidência | Descrição |
|---|---|
| [PR #14](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/pull/14) | Pull Request da implementação base do padrão. |
| [`package.json`](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/1506cc21e559beda97b0263923adaa98522d265c) | Configuração do projeto com os scripts `start` e `test`. |
| [`src/Observador.js`](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/c8a2a1cda97356979b6e985b51141c092747c8e4) | Classe base `Observador` com `atualizar` abstrato. |
| [`src/Sujeito.js`](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/7ccde94c38a4efd24295aa3bb2d38cec6ae4aa36) | Classe `Sujeito` com inscrição, desinscrição e isolamento de falhas. |
| [`src/EventoDeConteudo.js`](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/6895635fa5c66252ffb795087272049001e30403) | Evento imutável e enum `TipoDeEvento`. |
| [`src/RepositorioDeConteudo.js`](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/9a9cd19067f658c7a875497a7980681638ff0550) | Repositório em memória e classe `Conteudo`. |
| [`src/ServicoDeConteudo.js`](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/7e4707e9ac49c4fdac21d3f97c83958f340c49e6) | Sujeito concreto que emite os eventos de conteúdo. |
| [`src/ServicoDeTabCoins.js`](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/1b5065f643c4a710c3e474a2df7879819e05247e) | Observador concreto das regras RN01 e RN02. |
| [`src/NotificadorDeResposta.js`](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/9e583fbb5faf706d6c5496743a594f60b5b840b9) | Observador concreto das regras RN03 e RN04. |
| [`src/index.js`](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/6569ee2ac33810dc3544525bc9417f01af18e3c7) | Demonstração das etapas do Diagrama de Sequência. |
| [`test/observer.test.js`](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/d5fa8ad5e4124cdb0c5c6a5712c7c45073a729b6) | Testes automatizados com `node:test`. |
| [`README.md`](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/e8076001e5d94cd83ca75d97f0fe23c27b3ee910) | Instruções de execução. |
| [Controle de estado na moderação](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/825ed4de6c221413c44d41f99563e443ddb9e0f0) | `EstadoDoConteudo`, verificações em `ServicoDeConteudo`, débito condicional em `ServicoDeTabCoins` e testes da RN08. |
| [Documentação do código](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/dc7606d) | Ampliação desta página com todas as classes, a Tabela 1 e a Tabela 2. |
| [Pontos de vista e participação](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/9bb8fd6) | Criação das seções 16 a 18 e ponto de vista do Leonardo. |
| [Estilo da moderação e auditoria](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/dffa00ff35cb9ad9afecce0706e5a6b34a703f32) | Alinhamento do código de `RegistroDeAtividades` e da moderação ao padrão do grupo. |
| [PR #19](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/pull/19) | Pull Request da documentação do código, da execução e da correção da moderação. |

<p align="center">Tabela 3: Evidências de participação na implementação.</p>

## 18. Nível de Contribuição dos Integrantes

| Integrante | Atividades desenvolvidas | Nível de contribuição | Justificativa |
|---|---|---|---|
| [Caio Alexandre Ornelas Silva](https://github.com/bitterteriyaki) | Elaboração do Diagrama de Classes, do Diagrama de Sequência e da correspondência prevista entre modelagem e implementação (Tabela 4 da modelagem), que serviram de base para a organização do código. | 33,33% | A modelagem definiu os participantes, as classes, as regras de negócio e os arquivos implementados, além das decisões de projeto adotadas no código, como a classe base `Observador`, o modelo *push* e o isolamento de falhas (RN06). |
| [Guilherme Moura](github.com/Guilherme-Moura) | Implementação da Moderação/Auditoria, evolução dos testes automatizados e documentação da implementação. | 33,33% | Participação comprovada pela expansão do código (auditoria e moderação), evolução da cobertura de testes e autoria dos artefatos textuais da entrega. |
| [Leonardo Fachinello Bonetti](https://github.com/LeoFacB) | Implementação base do padrão (sujeito, observadores, evento, repositório), demonstração, testes automatizados, correção da moderação (RN08) e ampliação da documentação do código. | 33,33% | As classes que o Guilherme ampliou partiram da base implementada pelo Leonardo; participação comprovada pelos commits da Tabela 3 e pelos PRs [#14](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/pull/14) e [#19](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/pull/19). |

<p align="center">Tabela 4: Nível de contribuição dos integrantes.</p>

## 19. Referências

FREEMAN, Eric; ROBSON, Elisabeth. **Use a Cabeça! Padrões de Projetos**. 2. ed. Rio de Janeiro: Alta Books, 2021.

GAMMA, Erich; HELM, Richard; JOHNSON, Ralph; VLISSIDES, John. **Padrões de Projeto: soluções reutilizáveis de software orientado a objetos**. Porto Alegre: Bookman, 2000.

MOZILLA. **Classes: campos de classe privados**. MDN Web Docs. Disponível em: [https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Classes/Private_properties](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Classes/Private_properties). Acesso em: 17 out. 2026.

MOZILLA. **Object.freeze()**. MDN Web Docs. Disponível em: [https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze). Acesso em: 17 out. 2026.

NODE.JS. **Test runner Documentation**. Disponível em: [https://nodejs.org/api/test.html](https://nodejs.org/api/test.html). Acesso em: 16 out. 2026.

## 20. Histórico de Versões

| Versão | Data | Descrição | Autor(es) | Revisor(es) | Detalhe da Revisão |
|:---:|:---:|:---|:---|:---|:---|
| 1.0 | 16/10/2026 | Criação da documentação e detalhamento da implementação do padrão Observer. | [Guilherme Moura](github.com/Guilherme-Moura) | [Leonardo Bonetti](https://github.com/LeoFacB) | Inclusão dos componentes GoF, código-fonte, suíte de testes e orientações de execução. |
| 1.1 | 17/10/2026 | Ampliação da documentação do código. | [Leonardo Bonetti](https://github.com/LeoFacB) | [Caio Alexandre](https://github.com/bitterteriyaki) | Padronização da página com as demais subequipes: cada classe com seu trecho de código, papel no padrão e regras atendidas, testes automatizados e correspondência entre o diagrama e o código. |
| 1.2 | 18/10/2026 | Participação individual. | [Leonardo Bonetti](https://github.com/LeoFacB) | [Caio Alexandre](https://github.com/bitterteriyaki) | Ponto de vista e nível de contribuição individuais, espaços para os demais integrantes, link do PR da documentação e registro dos revisores das versões anteriores. |
| 1.3 | 18/10/2026 | Participação do Caio. | [Caio Alexandre](https://github.com/bitterteriyaki) | [Leonardo Bonetti](https://github.com/LeoFacB) | Ponto de vista sobre a correspondência entre a modelagem e a implementação e nível de contribuição do Caio. |
| 1.4 | 18/10/2026 | Participação e evidências do Caio. | [Caio Alexandre](https://github.com/bitterteriyaki) | [Leonardo Bonetti](https://github.com/LeoFacB) | Inclusão das atividades desenvolvidas e das evidências do Caio na seção de Participação e Evidências. |
| 1.5 | 18/10/2026 | Participação do Guilherme. | [Guilherme Moura](github.com/Guilherme-Moura) | [Leonardo Bonetti](https://github.com/LeoFacB) | Registro das lições aprendidas (Ponto de Vista), descrição das atividades desenvolvidas na moderação/auditoria e inclusão da tabela de commits de evidências. |
| 1.6 | 19/10/2026 | Autoria das tabelas e participação do Leonardo. | [Leonardo Bonetti](https://github.com/LeoFacB) |  | Inclusão do nome de quem elaborou as Tabelas 1 e 2 e detalhamento das atividades e evidências do Leonardo, para identificar a contribuição individual. |

<p align="center">Tabela 5: Histórico de Versões.</p>
