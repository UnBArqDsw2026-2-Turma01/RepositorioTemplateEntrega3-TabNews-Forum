# 3. Código

Esta seção apresenta a implementação do padrão de projeto GoF **Observer**, utilizado para desacoplar o serviço responsável pelo ciclo de vida de conteúdos das diversas reações provocadas por seus eventos (como crédito de moedas, notificações e auditoria). O exemplo foi desenvolvido em JavaScript com Node.js, sem dependências externas, demonstrando a aplicação do padrão no contexto do Projeto Fórum.

A implementação é didática e independente do sistema real. Ela não realiza persistência em banco de dados real nem integração com usuários externos.

## 1. Organização dos arquivos

A estrutura do projeto está organizada da seguinte forma:

```text
src/
├── EventoDeConteudo.js
├── NotificadorDeResposta.js
├── Observador.js
├── RegistroDeAtividades.js
├── RepositorioDeConteudo.js
├── ServicoDeConteudo.js
├── ServicoDeTabCoins.js
├── Sujeito.js
└── index.js

test/
└── observer.test.js

package.json
```

## 2. Componentes Base do Padrão

**Arquivo:** `src/Sujeito.js`
A classe abstrata `Sujeito` gerencia a lista de inscritos e implementa o isolamento de falhas (RN06) para que o erro de um observador não interrompa a notificação dos demais.

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

  notificar(evento) {
    for (const observador of [...this.#observadores]) {
      try {
        observador.atualizar(evento);
      } catch (erro) {
        console.error(`[Sujeito] Falha em ${observador.constructor.name}: ${erro.message}`);
      }
    }
  }
}

module.exports = Sujeito;
```

**Arquivo:** `src/Observador.js`
Define o contrato de atualização em tempo de execução, obrigando as subclasses a sobrescreverem o método `atualizar`.

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

## 3. Sujeito Concreto

**Arquivo:** `src/ServicoDeConteudo.js`
Responsável pelo ciclo de vida do conteúdo (publicação, remoção e fluxos de moderação). Ele emite os eventos sem conhecer nenhuma das classes concretas que os escutam.

```javascript
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

  enviarParaRevisao(id) {
    const conteudo = this.#repositorio.buscarPorId(id);
    if (!conteudo) throw new Error(`Conteúdo ${id} não encontrado.`);

    console.log(`\n[Conteudo] ${id} de ${conteudo.autor} foi enviado para revisão (Oculto)`);
    this.notificar(new EventoDeConteudo({ tipo: TipoDeEvento.CONTEUDO_EM_REVISAO, conteudo }));
  }

  restaurarConteudo(id) {
    const conteudo = this.#repositorio.buscarPorId(id);
    if (!conteudo) throw new Error(`Conteúdo ${id} não encontrado.`);

    console.log(`\n[Conteudo] ${id} de ${conteudo.autor} foi restaurado pela moderação`);
    this.notificar(new EventoDeConteudo({ tipo: TipoDeEvento.CONTEUDO_RESTAURADO, conteudo }));
  }
}

module.exports = ServicoDeConteudo;
```

## 4. Observadores Concretos

O sistema possui três reações independentes aos eventos:

1. **`ServicoDeTabCoins.js`**: Credita pontos em publicações, suspende em revisões e debita em remoções (RN01, RN02).
2. **`NotificadorDeResposta.js`**: Gera notificações para autores quando recebem respostas (RN03, RN04).
3. **`RegistroDeAtividades.js`** (Auditoria): Grava um histórico imutável de todas as ações (RN07).

**Arquivo:** `src/RegistroDeAtividades.js` (Exemplo de efetivação do Princípio Aberto/Fechado)

```javascript
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
```

## 5. Programa de demonstração

**Arquivo:** `src/index.js`
Este arquivo compõe os objetos, injetando as dependências e inscrevendo os observadores em tempo de execução, para então simular todo o fluxo de publicação, moderação e falhas (ver documentação de execução para a saída detalhada).

```javascript
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

## 6. Testes automatizados

**Arquivo:** `test/observer.test.js`

Os testes automatizados foram construídos utilizando o módulo nativo `node:test` e `node:assert/strict`. A suíte de testes comprova o baixo acoplamento e mapeia cada Regra de Negócio (RN01 a RN07) da documentação em um cenário validado em tempo de execução.

Os cenários validados incluem:
1. Impossibilidade de instanciar diretamente as classes abstratas `Sujeito` e `Observador`.
2. Tolerância a falhas (RN06), comprovando que o erro de um observador "Mock" não bloqueia a esteira.
3. Suspensão e restauração matemática do saldo de TabCoins em eventos de moderação (RN01, RN02).
4. Verificação de notificações e auto-respostas (RN03, RN04).
5. Confirmação do sequenciamento cronológico e integridade do `RegistroDeAtividades` (RN07).

## 7. Configuração do projeto

**Arquivo:** `package.json`

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

## 8. Execução do programa

Para executar o exemplo e a suíte de testes, utilize o Node.js na versão 18 ou superior. Com o terminal aberto na raiz do projeto, utilize os comandos abaixo:

Para simular o sistema e observar a saída no terminal:
```bash
npm start
```

Para rodar as validações automatizadas:
```bash
npm test
```


## 9. Nível de Contribuição dos Integrantes

| Integrante | Atividades desenvolvidas | Nível de contribuição | Justificativa |
|---|---|---|---|
| [Caio Alexandre] | | | |
| [Guilherme Moura](github.com/Guilherme-Moura) | Implementação da Moderação/Auditoria, evolução dos testes automatizados e documentação da implementação. | 33,33% | A classificação deve considerar a participação comprovada na implementação, na documentação e nas atividades relacionadas à entrega. |
| [Leonardo Fachinello Bonetti] | | | |

## 10. Referências

GAMMA, Erich et al. *Design Patterns: Elements of Reusable Object-Oriented Software*. Boston: Addison-Wesley, 1994.

NODE.JS. *Test runner Documentation*. Disponível em: <https://nodejs.org/api/test.html>. Acesso em: 16 out. 2026.

## 11. Histórico de Versões

| Versão | Data | Descrição | Autor(es) | Revisor(es) | Detalhe da Revisão |
|:---:|:---:|:---|:---|:---|:---|
| 1.0 | 16/10/2026 | Criação da documentação e detalhamento da implementação do padrão Observer. | [Guilherme Moura](github.com/Guilherme-Moura) | — | Inclusão dos componentes GoF, código-fonte, suíte de testes e orientações de execução. |