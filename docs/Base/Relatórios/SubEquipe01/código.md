# 3. Código

Esta seção documenta a implementação demonstrativa do padrão criacional GoF **Builder** para construir uma publicação em JavaScript. A documentação foi conferida com os arquivos presentes nesta pasta: `src/Publicacao.js`, `src/PublicacaoBuilder.js`, `src/index.js`, `test/PublicacaoBuilder.test.js` e `package.json`.

A [seção 8](/Base/Relatórios/SubEquipe01/código.md?id=_8-código-de-factory-method-prototype-e-singleton) documenta o código dos padrões **Factory Method**, **Prototype** e **Singleton**, implementados na mesma pasta, em `src/factory-method/`, `src/prototype/` e `src/singleton/`.

O exemplo pertence ao contexto acadêmico do Projeto Fórum TabNews, mas funciona isoladamente e mantém os dados em memória. Ele constrói um objeto `Publicacao` e imprime sua representação JSON. Não autentica usuários, persiste publicações, comunica-se com o TabNews ou publica conteúdo no sistema real.

## 1. Estrutura do projeto

```text
SubEquipe01/
├── src/
│   ├── Publicacao.js
│   ├── PublicacaoBuilder.js
│   ├── index.js
│   ├── factory-method/
│   │   ├── Conteudo.js
│   │   ├── CriadorDeConteudo.js
│   │   └── index.js
│   ├── prototype/
│   │   ├── ModeloDeConteudo.js
│   │   ├── RegistroDeModelos.js
│   │   └── index.js
│   └── singleton/
│       ├── ConfiguracaoDoForum.js
│       └── index.js
├── test/
│   ├── PublicacaoBuilder.test.js
│   ├── FactoryMethod.test.js
│   ├── Prototype.test.js
│   └── Singleton.test.js
├── assets/
├── package.json
└── README.md
```

| Arquivo | Responsabilidade |
|---|---|
| `src/Publicacao.js` | Produto final: valida os dados obrigatórios, normaliza os campos e define a representação JSON. |
| `src/PublicacaoBuilder.js` | Builder concreto: mantém os valores temporários, configura os campos e instancia `Publicacao` em `build()`. |
| `src/index.js` | Cliente da demonstração: usa o Builder e exibe o resultado. |
| `test/PublicacaoBuilder.test.js` | Testes unitários com o módulo nativo `node:test`. |
| `src/factory-method/` | Factory Method: produtos `Conteudo`, `ConteudoRaiz` e `Comentario`, criadores e demonstração (seção 8). |
| `src/prototype/` | Prototype: `Prototipo`, `ModeloDeConteudo`, `RegistroDeModelos` e demonstração (seção 8). |
| `src/singleton/` | Singleton: `ConfiguracaoDoForum` e demonstração (seção 8). |
| `test/FactoryMethod.test.js`, `test/Prototype.test.js`, `test/Singleton.test.js` | Testes dos três padrões, também com `node:test`. |
| `assets/` | Capturas de terminal da execução, usadas na página de Execução. |
| `package.json` | Metadados do pacote e scripts `start`, `test`, `start:singleton`, `start:factory-method` e `start:prototype`. |

Esta estrutura não contém `DiretorPublicacao.js`, `Usuario.js` ou `CadastroUsuarioBuilder.js`. Esses componentes foram mencionados em versões anteriores da documentação ou em registros de contribuição, mas não fazem parte dos arquivos de código disponíveis nesta pasta; portanto, não são apresentados aqui como código executável desta versão.

## 2. Participantes do Builder

| Papel | Implementação | Responsabilidade |
|---|---|---|
| Cliente | `src/index.js` | Configura os dados e solicita o produto com `build()`. |
| Builder concreto | `PublicacaoBuilder` | Oferece métodos nomeados e encadeáveis e transfere os dados para o produto. |
| Produto | `Publicacao` | Verifica as invariantes e guarda os dados já normalizados. |

Não há uma classe Builder abstrata ou Director na implementação atualmente disponível. O cliente chama diretamente o Builder concreto; não há uma receita de montagem reutilizada que exija um Director.

## 3. Produto `Publicacao`

**Arquivo:** `src/Publicacao.js`

```javascript
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
```

O construtor é o limite de validade do produto: mesmo que `Publicacao` seja instanciada sem o Builder, título, conteúdo e autor precisam estar presentes e não podem conter somente espaços. Os três campos são armazenados sem espaços externos.

As tags são convertidas para string, aparadas, filtradas para remover valores vazios e deduplicadas com `Set`. O array final é novo. `toJSON()` determina quais propriedades são serializadas quando o objeto é passado para `JSON.stringify()`.

As regras são limitadas ao exemplo: não há validação explícita de tipo, comprimento, formato, autorização ou conteúdo, nem persistência. O produto também não é congelado e suas propriedades permanecem mutáveis após a construção.

## 4. Builder concreto `PublicacaoBuilder`

**Arquivo:** `src/PublicacaoBuilder.js`

```javascript
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
```

O Builder mantém em `dados` o estado temporário da montagem. `comTitulo()`, `comConteudo()` e `comAutor()` guardam os respectivos valores; `comTags()` primeiro exige um array e então copia superficialmente a lista fornecida. Cada método de configuração retorna `this`, permitindo encadeamento.

`build()` cria uma instância nova de `Publicacao` com os dados configurados. Ele não replica as validações textuais: essas invariantes pertencem ao produto e são aplicadas pelo seu construtor. O Builder não é reiniciado depois de `build()`, então um Builder reutilizado mantém valores anteriores até que sejam sobrescritos; o cliente de demonstração cria uma instância para cada montagem.

## 5. Cliente e execução demonstrativa

**Arquivo:** `src/index.js`

```javascript
const PublicacaoBuilder = require("./PublicacaoBuilder");

const publicacao = new PublicacaoBuilder()
  .comTitulo("Padrões de Projeto GoF")
  .comConteudo("Exemplo didático do padrão Builder aplicado ao Projeto Fórum.")
  .comAutor("Autor demonstrativo")
  .comTags(["GoF", "Arquitetura", "JavaScript", "GoF"])
  .build();

console.log("Publicação construída com sucesso:");
console.log(JSON.stringify(publicacao, null, 2));
```

O cliente informa os quatro campos, chama `build()` e imprime o produto. A lista repete a tag `GoF` intencionalmente; a normalização de `Publicacao` remove essa repetição. O autor é um texto fixo demonstrativo, não uma identidade autenticada.

O fluxo de criação é: cliente instancia o Builder; os métodos `com...()` atualizam `dados` e retornam o mesmo Builder; `build()` chama o construtor do produto; o produto valida e normaliza; por fim, `JSON.stringify()` usa `toJSON()` e o cliente imprime o resultado. Uma exceção durante a configuração de tags ou no construtor interrompe o fluxo normal e impede a mensagem de sucesso.

## 6. Testes automatizados

**Arquivo:** `test/PublicacaoBuilder.test.js`

```javascript
const test = require("node:test");
const assert = require("node:assert/strict");
const PublicacaoBuilder = require("../src/PublicacaoBuilder");

test("constrói uma publicação com dados válidos", () => {
  const publicacao = new PublicacaoBuilder()
    .comTitulo("Título")
    .comConteudo("Conteúdo")
    .comAutor("Autor")
    .comTags(["GoF", "JS"])
    .build();

  assert.equal(publicacao.titulo, "Título");
  assert.equal(publicacao.conteudo, "Conteúdo");
  assert.equal(publicacao.autor, "Autor");
  assert.deepEqual(publicacao.tags, ["GoF", "JS"]);
});

test("remove espaços externos e tags repetidas ou vazias", () => {
  const publicacao = new PublicacaoBuilder()
    .comTitulo("  Título  ")
    .comConteudo("  Conteúdo  ")
    .comAutor("  Autor  ")
    .comTags(["GoF", "GoF", "  JS  ", ""])
    .build();

  assert.equal(publicacao.titulo, "Título");
  assert.deepEqual(publicacao.tags, ["GoF", "JS"]);
});

test("rejeita publicação sem título", () => {
  assert.throws(
    () => new PublicacaoBuilder().comConteudo("Conteúdo").comAutor("Autor").build(),
    /título da publicação é obrigatório/i
  );
});

test("rejeita publicação sem conteúdo", () => {
  assert.throws(
    () => new PublicacaoBuilder().comTitulo("Título").comAutor("Autor").build(),
    /conteúdo da publicação é obrigatório/i
  );
});

test("rejeita tags que não sejam array", () => {
  assert.throws(
    () => new PublicacaoBuilder().comTags("GoF"),
    /tags devem ser informadas em um array/i
  );
});
```

A suíte usa `node:test` e `node:assert/strict`, sem dependências externas. Seus cinco casos verificam construção válida, normalização e deduplicação de tags, ausência de título, ausência de conteúdo e tipo inválido de tags.

O código de `Publicacao` também rejeita autor ausente e normaliza o autor, mas a suíte atual não testa especificamente essas duas condições. Ela também não contém testes dedicados a `toJSON()` ou à reutilização do Builder. Assim, a cobertura descrita aqui corresponde aos casos presentes no arquivo, não a todos os comportamentos possíveis do produto.

## 7. Configuração e comandos

**Arquivo:** `package.json`

```json
{
  "name": "subequipe01-gof-criacionais-builder",
  "version": "1.0.0",
  "private": true,
  "description": "Exemplo didático do padrão GoF Builder aplicado a publicações de fórum",
  "scripts": {
    "start": "node src/index.js",
    "test": "node --test",
    "start:singleton": "node src/singleton/index.js",
    "start:factory-method": "node src/factory-method/index.js",
    "start:prototype": "node src/prototype/index.js"
  },
  "engines": {
    "node": ">=18"
  }
}
```

Com Node.js 18 ou superior, execute os comandos a partir da pasta `docs/Base/Relatórios/SubEquipe01`:

```bash
npm start                      # Builder
npm run start:singleton        # Singleton
npm run start:factory-method   # Factory Method
npm run start:prototype        # Prototype
npm test                       # todos os testes
```

Os comandos equivalentes sem scripts npm são `node src/index.js`, `node src/singleton/index.js`, `node src/factory-method/index.js`, `node src/prototype/index.js` e `node --test`. Não é necessário instalar dependências do projeto.

Na execução verificada da suíte do Builder, os cinco testes passaram e nenhum falhou. Essa verificação valida apenas os cenários unitários acima; não comprova integração com o sistema real do Fórum TabNews.

## 8. Código de Factory Method, Prototype e Singleton

> **Responsável:** [João Pedro S. Maciel](https://github.com/jopesmp)

Os três padrões estão em subpastas próprias de `src/`, cada uma com seu programa de demonstração (`index.js`), e seus testes ficam em `test/`. Os arquivos do Builder não foram alterados. O único arquivo compartilhado modificado foi o `package.json`, que recebeu três scripts novos. A modelagem desses arquivos está na [seção 9 da Modelagem](/Base/Relatórios/SubEquipe01/modelagem.md?id=_9-modelagem-de-factory-method-prototype-e-singleton).

### 8.1 Singleton — `ConfiguracaoDoForum`

**Arquivo:** `src/singleton/ConfiguracaoDoForum.js`

```javascript
"use strict";

/**
 * Padrão GoF Singleton.
 *
 * ConfiguracaoDoForum concentra parâmetros globais da demonstração do
 * Fórum TabNews (nome da plataforma e limites de caracteres). Todos os
 * componentes que precisam desses valores devem consultar a mesma
 * instância, obtida por ConfiguracaoDoForum.obterInstancia().
 *
 * Os valores são ilustrativos e não foram lidos do sistema real do TabNews.
 */
class ConfiguracaoDoForum {
  static #instancia = null;
  static #criacaoAutorizada = false;
  static #instanciasCriadas = 0;

  constructor() {
    if (!ConfiguracaoDoForum.#criacaoAutorizada) {
      throw new Error(
        "ConfiguracaoDoForum é um Singleton: use ConfiguracaoDoForum.obterInstancia()."
      );
    }

    this.nomeDaPlataforma = "Fórum TabNews (demonstração acadêmica)";
    this.limiteDeCaracteresDoTitulo = 255;
    this.limiteDeCaracteresDoCorpo = 20000;

    ConfiguracaoDoForum.#instanciasCriadas += 1;
    Object.freeze(this);
  }

  static obterInstancia() {
    if (ConfiguracaoDoForum.#instancia === null) {
      ConfiguracaoDoForum.#criacaoAutorizada = true;
      try {
        ConfiguracaoDoForum.#instancia = new ConfiguracaoDoForum();
      } finally {
        ConfiguracaoDoForum.#criacaoAutorizada = false;
      }
    }
    return ConfiguracaoDoForum.#instancia;
  }

  static get instanciasCriadas() {
    return ConfiguracaoDoForum.#instanciasCriadas;
  }

  obter(chave) {
    if (!Object.prototype.hasOwnProperty.call(this, chave)) {
      throw new Error(`Parâmetro de configuração desconhecido: ${chave}.`);
    }
    return this[chave];
  }
}

module.exports = ConfiguracaoDoForum;
```

- **Instância única:** `#instancia` é um campo estático privado, inacessível de fora da classe. `obterInstancia()` cria o objeto apenas no primeiro acesso (inicialização preguiçosa) e devolve sempre a mesma referência.
- **Construtor protegido:** como o JavaScript não tem construtores privados, `#criacaoAutorizada` só fica verdadeiro durante a chamada feita por `obterInstancia()`. Um `new` externo lança erro. O bloco `try/finally` garante que a autorização seja retirada mesmo se o construtor falhar.
- **Somente leitura:** `Object.freeze(this)` impede alterações. Em modo estrito, uma escrita lança `TypeError`.
- **Observabilidade:** `instanciasCriadas` existe para que a demonstração e os testes comprovem que o construtor executou uma única vez.
- **Valores:** os limites de 255 caracteres para o título e 20.000 para o corpo são os mesmos do validador do TabNews.

**Arquivo:** `src/singleton/index.js`

```javascript
"use strict";

const ConfiguracaoDoForum = require("./ConfiguracaoDoForum");

console.log("=== Singleton: ConfiguracaoDoForum ===\n");

console.log(`Instâncias criadas antes do primeiro acesso: ${ConfiguracaoDoForum.instanciasCriadas}`);

const configuracaoDoCriador = ConfiguracaoDoForum.obterInstancia();
const configuracaoDoValidador = ConfiguracaoDoForum.obterInstancia();

console.log(`Instâncias criadas após dois acessos: ${ConfiguracaoDoForum.instanciasCriadas}`);
console.log(`As duas referências apontam para o mesmo objeto? ${configuracaoDoCriador === configuracaoDoValidador}`);

console.log("\nParâmetros disponíveis:");
console.log(`- Plataforma: ${configuracaoDoCriador.obter("nomeDaPlataforma")}`);
console.log(`- Limite do título: ${configuracaoDoCriador.obter("limiteDeCaracteresDoTitulo")} caracteres`);
console.log(`- Limite do corpo: ${configuracaoDoCriador.obter("limiteDeCaracteresDoCorpo")} caracteres`);

console.log("\nTentativa de criar outra instância com new:");
try {
  new ConfiguracaoDoForum();
} catch (erro) {
  console.log(`- Erro: ${erro.message}`);
}

console.log("\nTentativa de alterar um parâmetro em tempo de execução:");
try {
  configuracaoDoCriador.limiteDeCaracteresDoTitulo = 10;
} catch (erro) {
  console.log(`- Erro: ${erro.message}`);
}
console.log(`- Limite do título continua: ${configuracaoDoValidador.limiteDeCaracteresDoTitulo}`);
```

### 8.2 Factory Method — produtos

**Arquivo:** `src/factory-method/Conteudo.js`

```javascript
"use strict";

const ConfiguracaoDoForum = require("../singleton/ConfiguracaoDoForum");

/**
 * Produto abstrato do padrão Factory Method.
 *
 * Reúne o que é comum a qualquer conteúdo do fórum (autor e corpo) e
 * deixa para as subclasses o que muda entre os tipos de conteúdo.
 */
class Conteudo {
  constructor({ autor, corpo }) {
    if (new.target === Conteudo) {
      throw new Error("Conteudo é abstrato: instancie ConteudoRaiz ou Comentario.");
    }
    if (typeof autor !== "string" || !autor.trim()) {
      throw new Error("O autor do conteúdo é obrigatório.");
    }
    if (typeof corpo !== "string" || !corpo.trim()) {
      throw new Error("O corpo do conteúdo é obrigatório.");
    }

    const limite = ConfiguracaoDoForum.obterInstancia().limiteDeCaracteresDoCorpo;
    if (corpo.trim().length > limite) {
      throw new Error(`O corpo do conteúdo excede o limite de ${limite} caracteres.`);
    }

    this.autor = autor.trim();
    this.corpo = corpo.trim();
  }

  get tipo() {
    throw new Error("Subclasses de Conteudo devem definir o tipo.");
  }

  resumo() {
    throw new Error("Subclasses de Conteudo devem implementar resumo().");
  }
}

/**
 * Produto concreto: publicação de nível superior, que exige título.
 * O slug é derivado do título, como ocorre em endereços de publicações.
 */
class ConteudoRaiz extends Conteudo {
  constructor({ autor, titulo, corpo }) {
    super({ autor, corpo });

    if (typeof titulo !== "string" || !titulo.trim()) {
      throw new Error("O título é obrigatório em um conteúdo raiz.");
    }
    const limite = ConfiguracaoDoForum.obterInstancia().limiteDeCaracteresDoTitulo;
    if (titulo.trim().length > limite) {
      throw new Error(`O título excede o limite de ${limite} caracteres.`);
    }

    this.titulo = titulo.trim();
    this.slug = ConteudoRaiz.gerarSlug(this.titulo);
  }

  get tipo() {
    return "conteudo-raiz";
  }

  resumo() {
    return `[${this.tipo}] "${this.titulo}" por ${this.autor} (/${this.autor}/${this.slug})`;
  }

  static gerarSlug(titulo) {
    return titulo
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
}

/**
 * Produto concreto: resposta a outro conteúdo. Não tem título, mas
 * precisa referenciar o conteúdo ao qual responde.
 */
class Comentario extends Conteudo {
  constructor({ autor, corpo, idDoConteudoPai }) {
    super({ autor, corpo });

    if (typeof idDoConteudoPai !== "string" || !idDoConteudoPai.trim()) {
      throw new Error("Um comentário precisa indicar o conteúdo que está respondendo.");
    }

    this.idDoConteudoPai = idDoConteudoPai.trim();
  }

  get tipo() {
    return "comentario";
  }

  resumo() {
    return `[${this.tipo}] resposta de ${this.autor} ao conteúdo ${this.idDoConteudoPai}`;
  }
}

module.exports = { Conteudo, ConteudoRaiz, Comentario };
```

`Conteudo` concentra as regras comuns (autor, corpo e limite do corpo) e impede sua própria instanciação com `new.target`. `ConteudoRaiz` acrescenta a obrigatoriedade e o limite do título e gera o slug, removendo acentos com `normalize("NFD")`. `Comentario` exige o conteúdo pai. As duas subclasses consultam o limite na instância única de `ConfiguracaoDoForum`.

### 8.3 Factory Method — criadores

**Arquivo:** `src/factory-method/CriadorDeConteudo.js`

```javascript
"use strict";

const { Conteudo, ConteudoRaiz, Comentario } = require("./Conteudo");

/**
 * Creator do padrão Factory Method.
 *
 * prepararConteudo() é a operação comum a todos os criadores: ela pede o
 * produto ao método-fábrica criarConteudo(), confere o contrato e registra
 * quantos conteúdos foram preparados. Somente o método-fábrica muda entre
 * os criadores concretos.
 */
class CriadorDeConteudo {
  #conteudosPreparados = 0;

  constructor() {
    if (new.target === CriadorDeConteudo) {
      throw new Error("CriadorDeConteudo é abstrato: use um criador concreto.");
    }
  }

  // Método-fábrica (factory method): implementado pelas subclasses.
  criarConteudo(_dados) {
    throw new Error("Criadores concretos devem implementar criarConteudo().");
  }

  prepararConteudo(dados) {
    const conteudo = this.criarConteudo(dados);

    if (!(conteudo instanceof Conteudo)) {
      throw new TypeError("criarConteudo() deve retornar uma instância de Conteudo.");
    }

    this.#conteudosPreparados += 1;
    return conteudo;
  }

  get conteudosPreparados() {
    return this.#conteudosPreparados;
  }
}

/** ConcreteCreator: decide que o produto é um ConteudoRaiz. */
class CriadorDeConteudoRaiz extends CriadorDeConteudo {
  criarConteudo(dados) {
    return new ConteudoRaiz(dados);
  }
}

/** ConcreteCreator: decide que o produto é um Comentario. */
class CriadorDeComentario extends CriadorDeConteudo {
  criarConteudo(dados) {
    return new Comentario(dados);
  }
}

module.exports = { CriadorDeConteudo, CriadorDeConteudoRaiz, CriadorDeComentario };
```

`criarConteudo()` é o método-fábrica: no criador abstrato, apenas lança erro. `prepararConteudo()` é a operação que o GoF chama de *AnOperation*: ela não conhece as classes concretas, chama o método-fábrica, garante o contrato com `instanceof Conteudo` e mantém um contador privado por criador. Os criadores concretos sobrescrevem uma única linha.

**Arquivo:** `src/factory-method/index.js`

```javascript
"use strict";

const {
  CriadorDeConteudoRaiz,
  CriadorDeComentario
} = require("./CriadorDeConteudo");

/**
 * O cliente conhece apenas a interface de CriadorDeConteudo.
 * Ele não sabe qual classe concreta de conteúdo será instanciada.
 */
function enviarConteudo(criador, dados) {
  const conteudo = criador.prepararConteudo(dados);
  console.log(`- Criado por ${criador.constructor.name}: ${conteudo.resumo()}`);
  return conteudo;
}

console.log("=== Factory Method: criação de conteúdos do fórum ===\n");

const criadorDeRaiz = new CriadorDeConteudoRaiz();
const criadorDeComentario = new CriadorDeComentario();

console.log("1. Mesma operação, criadores diferentes:");
const publicacao = enviarConteudo(criadorDeRaiz, {
  autor: "joaopedro",
  titulo: "Como o Factory Method organiza a criação de conteúdos",
  corpo: "Cada criador concreto decide qual tipo de conteúdo instanciar."
});

const resposta = enviarConteudo(criadorDeComentario, {
  autor: "giovana",
  corpo: "Ótima explicação! Ficou claro o papel do método-fábrica.",
  idDoConteudoPai: publicacao.slug
});

console.log("\n2. Produtos resultantes:");
console.log(`- ${publicacao.constructor.name}: tipo="${publicacao.tipo}", slug="${publicacao.slug}"`);
console.log(`- ${resposta.constructor.name}: tipo="${resposta.tipo}", responde a "${resposta.idDoConteudoPai}"`);

console.log("\n3. Regras específicas de cada produto:");
try {
  enviarConteudo(criadorDeRaiz, { autor: "arthur", corpo: "Conteúdo raiz sem título." });
} catch (erro) {
  console.log(`- CriadorDeConteudoRaiz recusou: ${erro.message}`);
}
try {
  enviarConteudo(criadorDeComentario, { autor: "arthur", corpo: "Comentário sem conteúdo pai." });
} catch (erro) {
  console.log(`- CriadorDeComentario recusou: ${erro.message}`);
}

console.log("\n4. Contagem por criador:");
console.log(`- ${criadorDeRaiz.constructor.name}: ${criadorDeRaiz.conteudosPreparados} conteúdo(s)`);
console.log(`- ${criadorDeComentario.constructor.name}: ${criadorDeComentario.conteudosPreparados} conteúdo(s)`);
```

A função `enviarConteudo()` representa o cliente do padrão: recebe qualquer `CriadorDeConteudo` e não contém nenhum `if` sobre o tipo de conteúdo.

### 8.4 Prototype — protótipos

**Arquivo:** `src/prototype/ModeloDeConteudo.js`

```javascript
"use strict";

/**
 * Prototype abstrato: declara a operação de clonagem.
 */
class Prototipo {
  constructor() {
    if (new.target === Prototipo) {
      throw new Error("Prototipo é abstrato: use um protótipo concreto.");
    }
  }

  clonar() {
    throw new Error("Protótipos concretos devem implementar clonar().");
  }
}

/**
 * ConcretePrototype: modelo de rascunho de publicação.
 *
 * Um modelo guarda uma estrutura pronta (título sugerido e seções) que o
 * autor copia e preenche. Como as seções são objetos dentro de um array,
 * clonar() faz cópia profunda: alterar o clone não altera o modelo.
 */
class ModeloDeConteudo extends Prototipo {
  constructor({ nome, tituloSugerido, secoes = [] }) {
    super();

    if (typeof nome !== "string" || !nome.trim()) {
      throw new Error("O nome do modelo é obrigatório.");
    }
    if (typeof tituloSugerido !== "string" || !tituloSugerido.trim()) {
      throw new Error("O título sugerido do modelo é obrigatório.");
    }
    if (!Array.isArray(secoes)) {
      throw new TypeError("As seções do modelo devem ser informadas em um array.");
    }

    this.nome = nome.trim();
    this.tituloSugerido = tituloSugerido.trim();
    this.secoes = secoes.map((secao) => ({
      titulo: String(secao.titulo).trim(),
      texto: String(secao.texto ?? "").trim()
    }));
  }

  clonar() {
    return new ModeloDeConteudo({
      nome: this.nome,
      tituloSugerido: this.tituloSugerido,
      secoes: structuredClone(this.secoes)
    });
  }

  adicionarSecao(titulo, texto = "") {
    this.secoes.push({ titulo: String(titulo).trim(), texto: String(texto).trim() });
    return this;
  }

  preencherSecao(titulo, texto) {
    const secao = this.secoes.find((item) => item.titulo === titulo);
    if (!secao) {
      throw new Error(`A seção "${titulo}" não existe no modelo "${this.nome}".`);
    }
    secao.texto = String(texto).trim();
    return this;
  }

  montarCorpo() {
    return this.secoes
      .map((secao) => `## ${secao.titulo}\n\n${secao.texto || "(a preencher)"}`)
      .join("\n\n");
  }
}

module.exports = { Prototipo, ModeloDeConteudo };
```

`clonar()` cria um novo `ModeloDeConteudo` e passa as seções por `structuredClone`, uma função nativa do Node.js 17+ que faz cópia profunda. O construtor também recria cada seção. Assim, nem o array nem os objetos de seção são compartilhados entre o modelo e a cópia. Os métodos de edição retornam `this` para permitir encadeamento.

### 8.5 Prototype — registro de modelos

**Arquivo:** `src/prototype/RegistroDeModelos.js`

```javascript
"use strict";

const { Prototipo } = require("./ModeloDeConteudo");

/**
 * Registro de protótipos (prototype manager, descrito pelo GoF como
 * variação de implementação do padrão).
 *
 * Guarda os modelos originais e entrega apenas cópias. Assim, o cliente
 * cria novos rascunhos sem conhecer a classe concreta do modelo e sem
 * risco de modificar o original.
 */
class RegistroDeModelos {
  #prototipos = new Map();

  registrar(chave, prototipo) {
    if (typeof chave !== "string" || !chave.trim()) {
      throw new Error("A chave do modelo é obrigatória.");
    }
    if (!(prototipo instanceof Prototipo)) {
      throw new TypeError("Somente objetos do tipo Prototipo podem ser registrados.");
    }
    this.#prototipos.set(chave.trim(), prototipo);
    return this;
  }

  criar(chave) {
    const prototipo = this.#prototipos.get(chave);
    if (!prototipo) {
      throw new Error(`Modelo não registrado: ${chave}.`);
    }
    return prototipo.clonar();
  }

  listarChaves() {
    return [...this.#prototipos.keys()];
  }
}

module.exports = RegistroDeModelos;
```

O registro aceita somente instâncias de `Prototipo` e nunca devolve o objeto registrado, apenas `prototipo.clonar()`. O mapa é privado (`#prototipos`), de modo que o cliente não consegue obter o original.

**Arquivo:** `src/prototype/index.js`

```javascript
"use strict";

const { ModeloDeConteudo } = require("./ModeloDeConteudo");
const RegistroDeModelos = require("./RegistroDeModelos");
const { CriadorDeConteudoRaiz } = require("../factory-method/CriadorDeConteudo");

console.log("=== Prototype: modelos de rascunho de publicação ===\n");

const registro = new RegistroDeModelos()
  .registrar(
    "duvida",
    new ModeloDeConteudo({
      nome: "Dúvida técnica",
      tituloSugerido: "Dúvida: ",
      secoes: [
        { titulo: "Contexto" },
        { titulo: "O que já tentei" },
        { titulo: "Mensagem de erro" }
      ]
    })
  )
  .registrar(
    "tutorial",
    new ModeloDeConteudo({
      nome: "Tutorial",
      tituloSugerido: "Tutorial: ",
      secoes: [
        { titulo: "Introdução" },
        { titulo: "Passo a passo" },
        { titulo: "Conclusão" }
      ]
    })
  );

console.log(`1. Modelos registrados: ${registro.listarChaves().join(", ")}`);

const rascunho = registro.criar("tutorial");
rascunho.tituloSugerido = "Tutorial: aplicando o padrão Prototype em JavaScript";
rascunho
  .preencherSecao("Introdução", "O Prototype cria objetos copiando um modelo existente.")
  .preencherSecao("Passo a passo", "Registre os modelos e peça cópias ao registro.")
  .preencherSecao("Conclusão", "O modelo original continua intacto para o próximo autor.")
  .adicionarSecao("Referências", "GAMMA et al. Design Patterns, 1994.");

console.log("\n2. Rascunho clonado e preenchido:");
console.log(`- Título: ${rascunho.tituloSugerido}`);
console.log(`- Seções: ${rascunho.secoes.map((secao) => secao.titulo).join(" | ")}`);

const outraCopia = registro.criar("tutorial");
console.log("\n3. Nova cópia do mesmo modelo (o original não foi alterado):");
console.log(`- Título: ${outraCopia.tituloSugerido}`);
console.log(`- Seções: ${outraCopia.secoes.map((secao) => secao.titulo).join(" | ")}`);
console.log(`- Texto da Introdução: ${outraCopia.secoes[0].texto || "(vazio)"}`);
console.log(`- Rascunho e nova cópia são objetos distintos? ${rascunho !== outraCopia}`);
console.log(`- Compartilham o array de seções? ${rascunho.secoes === outraCopia.secoes}`);

console.log("\n4. Rascunho enviado ao Factory Method como conteúdo raiz:");
const conteudo = new CriadorDeConteudoRaiz().prepararConteudo({
  autor: "joaopedro",
  titulo: rascunho.tituloSugerido,
  corpo: rascunho.montarCorpo()
});
console.log(`- ${conteudo.resumo()}`);
console.log(`- Corpo com ${conteudo.corpo.length} caracteres e ${rascunho.secoes.length} seções`);

console.log("\n5. Modelo inexistente:");
try {
  registro.criar("pitch");
} catch (erro) {
  console.log(`- Erro: ${erro.message}`);
}
```

A etapa 4 integra os padrões: o rascunho copiado é transformado em `ConteudoRaiz` pelo Factory Method, que, por sua vez, consulta o Singleton.

### 8.6 Testes automatizados

**Arquivo:** `test/Singleton.test.js`

```javascript
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const ConfiguracaoDoForum = require("../src/singleton/ConfiguracaoDoForum");

test("Singleton: não cria a instância antes do primeiro acesso (criação preguiçosa)", () => {
  assert.equal(ConfiguracaoDoForum.instanciasCriadas, 0);
  ConfiguracaoDoForum.obterInstancia();
  assert.equal(ConfiguracaoDoForum.instanciasCriadas, 1);
});

test("Singleton: acessos sucessivos devolvem a mesma instância", () => {
  const primeira = ConfiguracaoDoForum.obterInstancia();
  const segunda = ConfiguracaoDoForum.obterInstancia();

  assert.equal(primeira, segunda);
  assert.equal(ConfiguracaoDoForum.instanciasCriadas, 1);
});

test("Singleton: impede a criação direta com new", () => {
  assert.throws(() => new ConfiguracaoDoForum(), /use ConfiguracaoDoForum\.obterInstancia/);
  assert.equal(ConfiguracaoDoForum.instanciasCriadas, 1);
});

test("Singleton: os parâmetros são somente leitura", () => {
  const configuracao = ConfiguracaoDoForum.obterInstancia();

  assert.ok(Object.isFrozen(configuracao));
  assert.throws(() => {
    configuracao.limiteDeCaracteresDoTitulo = 10;
  }, TypeError);
  assert.equal(configuracao.limiteDeCaracteresDoTitulo, 255);
});

test("Singleton: obter() devolve parâmetros existentes e rejeita chaves desconhecidas", () => {
  const configuracao = ConfiguracaoDoForum.obterInstancia();

  assert.equal(configuracao.obter("limiteDeCaracteresDoCorpo"), 20000);
  assert.throws(() => configuracao.obter("limiteDeTags"), /Parâmetro de configuração desconhecido/);
});
```

**Arquivo:** `test/FactoryMethod.test.js`

```javascript
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { Conteudo, ConteudoRaiz, Comentario } = require("../src/factory-method/Conteudo");
const {
  CriadorDeConteudo,
  CriadorDeConteudoRaiz,
  CriadorDeComentario
} = require("../src/factory-method/CriadorDeConteudo");

test("Factory Method: CriadorDeConteudoRaiz produz um ConteudoRaiz", () => {
  const conteudo = new CriadorDeConteudoRaiz().prepararConteudo({
    autor: "joaopedro",
    titulo: "Padrões Criacionais",
    corpo: "Corpo da publicação."
  });

  assert.ok(conteudo instanceof ConteudoRaiz);
  assert.ok(conteudo instanceof Conteudo);
  assert.equal(conteudo.tipo, "conteudo-raiz");
});

test("Factory Method: CriadorDeComentario produz um Comentario", () => {
  const conteudo = new CriadorDeComentario().prepararConteudo({
    autor: "giovana",
    corpo: "Resposta.",
    idDoConteudoPai: "padroes-criacionais"
  });

  assert.ok(conteudo instanceof Comentario);
  assert.equal(conteudo.tipo, "comentario");
  assert.equal(conteudo.idDoConteudoPai, "padroes-criacionais");
});

test("Factory Method: o cliente usa a mesma operação para qualquer criador", () => {
  const dados = { autor: "arthur", titulo: "Título", corpo: "Corpo", idDoConteudoPai: "pai" };
  const criadores = [new CriadorDeConteudoRaiz(), new CriadorDeComentario()];

  const tipos = criadores.map((criador) => criador.prepararConteudo(dados).tipo);

  assert.deepEqual(tipos, ["conteudo-raiz", "comentario"]);
});

test("Factory Method: classes abstratas não podem ser instanciadas", () => {
  assert.throws(() => new CriadorDeConteudo(), /CriadorDeConteudo é abstrato/);
  assert.throws(() => new Conteudo({ autor: "a", corpo: "b" }), /Conteudo é abstrato/);
});

test("Factory Method: prepararConteudo() rejeita método-fábrica que não devolve Conteudo", () => {
  class CriadorInvalido extends CriadorDeConteudo {
    criarConteudo() {
      return { titulo: "objeto qualquer" };
    }
  }

  assert.throws(() => new CriadorInvalido().prepararConteudo({}), TypeError);
});

test("Factory Method: aplica as regras específicas de cada produto", () => {
  assert.throws(
    () => new CriadorDeConteudoRaiz().prepararConteudo({ autor: "a", corpo: "b" }),
    /título é obrigatório/
  );
  assert.throws(
    () => new CriadorDeComentario().prepararConteudo({ autor: "a", corpo: "b" }),
    /conteúdo que está respondendo/
  );
});

test("Factory Method: usa os limites do Singleton de configuração", () => {
  assert.throws(
    () =>
      new CriadorDeConteudoRaiz().prepararConteudo({
        autor: "a",
        titulo: "x".repeat(256),
        corpo: "b"
      }),
    /limite de 255 caracteres/
  );
});

test("Factory Method: gera slug sem acentos a partir do título", () => {
  assert.equal(ConteudoRaiz.gerarSlug("Padrões de Projeto: Criação!"), "padroes-de-projeto-criacao");
});

test("Factory Method: cada criador conta apenas os conteúdos que preparou", () => {
  const criadorDeRaiz = new CriadorDeConteudoRaiz();
  const criadorDeComentario = new CriadorDeComentario();

  criadorDeRaiz.prepararConteudo({ autor: "a", titulo: "T1", corpo: "c" });
  criadorDeRaiz.prepararConteudo({ autor: "a", titulo: "T2", corpo: "c" });
  assert.throws(() => criadorDeComentario.prepararConteudo({ autor: "a", corpo: "c" }));

  assert.equal(criadorDeRaiz.conteudosPreparados, 2);
  assert.equal(criadorDeComentario.conteudosPreparados, 0);
});
```

**Arquivo:** `test/Prototype.test.js`

```javascript
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { Prototipo, ModeloDeConteudo } = require("../src/prototype/ModeloDeConteudo");
const RegistroDeModelos = require("../src/prototype/RegistroDeModelos");

function criarModeloTutorial() {
  return new ModeloDeConteudo({
    nome: "Tutorial",
    tituloSugerido: "Tutorial: ",
    secoes: [{ titulo: "Introdução" }, { titulo: "Passo a passo" }]
  });
}

test("Prototype: clonar() cria um objeto novo com os mesmos dados", () => {
  const original = criarModeloTutorial();
  const copia = original.clonar();

  assert.notEqual(copia, original);
  assert.ok(copia instanceof ModeloDeConteudo);
  assert.deepEqual(copia, original);
});

test("Prototype: a cópia é profunda e não compartilha as seções", () => {
  const original = criarModeloTutorial();
  const copia = original.clonar();

  copia.preencherSecao("Introdução", "Texto do autor.");
  copia.adicionarSecao("Referências");

  assert.notEqual(copia.secoes, original.secoes);
  assert.notEqual(copia.secoes[0], original.secoes[0]);
  assert.equal(original.secoes[0].texto, "");
  assert.equal(original.secoes.length, 2);
});

test("Prototype: o registro devolve cópias, nunca o protótipo registrado", () => {
  const modelo = criarModeloTutorial();
  const registro = new RegistroDeModelos().registrar("tutorial", modelo);

  const primeira = registro.criar("tutorial");
  const segunda = registro.criar("tutorial");

  assert.notEqual(primeira, modelo);
  assert.notEqual(primeira, segunda);
  assert.deepEqual(registro.listarChaves(), ["tutorial"]);
});

test("Prototype: alterar uma cópia não afeta as cópias seguintes", () => {
  const registro = new RegistroDeModelos().registrar("tutorial", criarModeloTutorial());

  const rascunho = registro.criar("tutorial");
  rascunho.tituloSugerido = "Tutorial: alterado";
  rascunho.preencherSecao("Passo a passo", "Alterado");

  const novaCopia = registro.criar("tutorial");
  assert.equal(novaCopia.tituloSugerido, "Tutorial:");
  assert.equal(novaCopia.secoes[1].texto, "");
});

test("Prototype: o registro rejeita chave desconhecida e objeto que não é Prototipo", () => {
  const registro = new RegistroDeModelos();

  assert.throws(() => registro.criar("pitch"), /Modelo não registrado: pitch/);
  assert.throws(() => registro.registrar("qualquer", { clonar() {} }), TypeError);
});

test("Prototype: Prototipo é abstrato e o modelo valida seus dados", () => {
  assert.throws(() => new Prototipo(), /Prototipo é abstrato/);
  assert.throws(
    () => new ModeloDeConteudo({ nome: "", tituloSugerido: "T" }),
    /nome do modelo é obrigatório/
  );
  assert.throws(
    () => criarModeloTutorial().preencherSecao("Inexistente", "x"),
    /não existe no modelo/
  );
});

test("Prototype: montarCorpo() gera o corpo em Markdown a partir das seções", () => {
  const corpo = criarModeloTutorial().clonar().preencherSecao("Introdução", "Olá").montarCorpo();

  assert.equal(corpo, "## Introdução\n\nOlá\n\n## Passo a passo\n\n(a preencher)");
});
```

| Arquivo | Testes | Regras verificadas ([Modelagem, Tabela 9.2](/Base/Relatórios/SubEquipe01/modelagem.md?id=_96-regras-modeladas)) |
|:---|:---:|:---|
| `test/Singleton.test.js` | 5 | SG01 a SG05 |
| `test/FactoryMethod.test.js` | 9 | FM01 a FM08 |
| `test/Prototype.test.js` | 7 | PT01 a PT05 |

O teste de criação preguiçosa do Singleton depende de ser o primeiro a acessar a configuração no processo. Isso é garantido porque o executor `node --test` roda cada arquivo de teste em um processo separado.

## 9. Vídeo de apresentação

O vídeo abaixo apresenta a implementação do padrão Builder, a organização dos arquivos e a execução da demonstração:

<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/jCWn04HwIA0"
  title="Apresentação da implementação e execução do padrão Builder"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen>
</iframe>

<p align="center"><strong>Fonte: elaboração da SubEquipe 01.</strong></p>

## 10. Participação e evidências

Esta página documenta a implementação de publicações que está presente nos arquivos listados na seção 1. Os registros de participação individual, contribuições adicionais e comprobatórios da equipe estão consolidados em [Participações (Padrões de Projeto)](/Base/1.2.ParticipacoesPadroesDeProjeto.md) e em [IA Generativa](/Base/Relatórios/SubEquipe01/ia-generativa.md), evitando repetir esses relatos técnicos nesta seção.

## 11. Referências

GAMMA, Erich; HELM, Richard; JOHNSON, Ralph; VLISSIDES, John. *Design Patterns: Elements of Reusable Object-Oriented Software*. Reading, MA: Addison-Wesley, 1994.

NODE.JS. *Test runner*. Disponível em: <https://nodejs.org/api/test.html>. Acesso em: 19 out. 2026.

GAMMA, Erich; HELM, Richard; JOHNSON, Ralph; VLISSIDES, John. *Padrões de Projeto: soluções reutilizáveis de software orientado a objetos*. Porto Alegre: Bookman, 2000.

MDN WEB DOCS. *structuredClone()*. Disponível em: <https://developer.mozilla.org/pt-BR/docs/Web/API/Window/structuredClone>. Acesso em: 19 out. 2026.

MDN WEB DOCS. *Private class features*. Disponível em: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties>. Acesso em: 19 out. 2026.

## 12. Histórico de Versões

| Versão | Data | Descrição | Autor(es) | Revisor(es) | Detalhe da Revisão |
|:---:|:---:|:---|:---|:---:|:---|
| 1.0 | 08/10/2026 | Documentação da implementação didática do padrão Builder para construção de publicações. | [Arthur Fernandes](https://github.com/arthurfernandesj) | [Giovana Fontes](https://github.com/GiovanaFontesS) | Organização da documentação técnica, descrição das classes, procedimentos de execução, testes, participação e contribuição. |
| 1.1 | 16/10/2026 | Documentação da implementação didática do padrão Builder para construção de cadastro. | [Giovana Fontes](https://github.com/GiovanaFontesS) | [Arthur Fernandes](https://github.com/arthurfernandesj) | Registro da aplicação complementar do Builder para cadastro, participação e contribuição. |
| 1.2 | 17/10/2026 | Inclusão do complemento com Director opcional, testes do complemento e contribuição de João Pedro S. Maciel. | [João Pedro S. Maciel](https://github.com/jopesmp) | [Arthur Fernandes](https://github.com/arthurfernandesj) | Registro histórico do complemento e das revisões correspondentes. |
| 1.3 | 19/10/2026 | Reorganização e complementação da documentação do código, alinhada aos arquivos presentes na SubEquipe 01. | [Arthur Fernandes](https://github.com/arthurfernandesj) | [Giovana Fontes](https://github.com/GiovanaFontesS) | Inclusão do código completo disponível, cobertura real dos testes, configuração efetiva do pacote, comandos de execução e distinção entre arquivos presentes e complementos registrados anteriormente. |
| 1.4 | 19/10/2026 | Código de Factory Method, Prototype e Singleton. | [João Pedro S. Maciel](https://github.com/jopesmp) | — | Inclusão da seção 8 com o código completo, a explicação e os testes dos três padrões; atualização da estrutura do projeto, do `package.json` e dos comandos de execução. |
