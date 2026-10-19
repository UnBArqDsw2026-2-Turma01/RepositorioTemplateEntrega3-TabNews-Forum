# 3. Código

Esta seção documenta a implementação demonstrativa do padrão criacional GoF **Builder** para construir uma publicação em JavaScript. A documentação foi conferida com os arquivos presentes nesta pasta: `src/Publicacao.js`, `src/PublicacaoBuilder.js`, `src/index.js`, `test/PublicacaoBuilder.test.js` e `package.json`.

O exemplo pertence ao contexto acadêmico do Projeto Fórum TabNews, mas funciona isoladamente e mantém os dados em memória. Ele constrói um objeto `Publicacao` e imprime sua representação JSON. Não autentica usuários, persiste publicações, comunica-se com o TabNews ou publica conteúdo no sistema real.

## 1. Estrutura do projeto

```text
SubEquipe01/
├── src/
│   ├── Publicacao.js
│   ├── PublicacaoBuilder.js
│   └── index.js
├── test/
│   └── PublicacaoBuilder.test.js
├── package.json
└── README.md
```

| Arquivo | Responsabilidade |
|---|---|
| `src/Publicacao.js` | Produto final: valida os dados obrigatórios, normaliza os campos e define a representação JSON. |
| `src/PublicacaoBuilder.js` | Builder concreto: mantém os valores temporários, configura os campos e instancia `Publicacao` em `build()`. |
| `src/index.js` | Cliente da demonstração: usa o Builder e exibe o resultado. |
| `test/PublicacaoBuilder.test.js` | Testes unitários com o módulo nativo `node:test`. |
| `package.json` | Metadados do pacote e scripts `start` e `test`. |

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
    "test": "node --test"
  },
  "engines": {
    "node": ">=18"
  }
}
```

Com Node.js 18 ou superior, execute os comandos a partir da pasta `docs/Base/Relatórios/SubEquipe01`:

```bash
npm start
npm test
```

Os comandos equivalentes sem scripts npm são `node src/index.js` e `node --test`. Não é necessário instalar dependências do projeto.

Na execução verificada da suíte do Builder, os cinco testes passaram e nenhum falhou. Essa verificação valida apenas os cenários unitários acima; não comprova integração com o sistema real do Fórum TabNews.

## 8. Vídeo de apresentação

O vídeo apresenta a implementação do padrão Builder, a organização dos arquivos e a execução da demonstração:

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

## 9. Participação e evidências

Esta página documenta a implementação de publicações que está presente nos arquivos listados na seção 1. Os registros de participação individual, contribuições adicionais e comprobatórios da equipe estão consolidados em [Participações (Padrões de Projeto)](/Base/1.2.ParticipacoesPadroesDeProjeto.md) e em [IA Generativa](/Base/Relatórios/SubEquipe01/ia-generativa.md), evitando repetir esses relatos técnicos nesta seção.

## 10. Referências

GAMMA, Erich; HELM, Richard; JOHNSON, Ralph; VLISSIDES, John. *Design Patterns: Elements of Reusable Object-Oriented Software*. Reading, MA: Addison-Wesley, 1994.

NODE.JS. *Test runner*. Disponível em: <https://nodejs.org/api/test.html>. Acesso em: 19 out. 2026.

## 11. Histórico de Versões

| Versão | Data | Descrição | Autor(es) | Revisor(es) | Detalhe da Revisão |
|:---:|:---:|:---|:---|:---:|:---|
| 1.0 | 08/10/2026 | Documentação da implementação didática do padrão Builder para construção de publicações. | [Arthur Fernandes](https://github.com/arthurfernandesj) | [Giovana Fontes](https://github.com/GiovanaFontesS) | Organização da documentação técnica, descrição das classes, procedimentos de execução, testes, participação e contribuição. |
| 1.1 | 16/10/2026 | Documentação da implementação didática do padrão Builder para construção de cadastro. | [Giovana Fontes](https://github.com/GiovanaFontesS) | [Arthur Fernandes](https://github.com/arthurfernandesj) | Registro da aplicação complementar do Builder para cadastro, participação e contribuição. |
| 1.2 | 17/10/2026 | Inclusão do complemento com Director opcional, testes do complemento e contribuição de João Pedro S. Maciel. | [João Pedro S. Maciel](https://github.com/jopesmp) | [Arthur Fernandes](https://github.com/arthurfernandesj) | Registro histórico do complemento e das revisões correspondentes. |
| 1.3 | 19/10/2026 | Reorganização e complementação da documentação do código, alinhada aos arquivos presentes na SubEquipe 01. | [Arthur Fernandes](https://github.com/arthurfernandesj) | [Giovana Fontes](https://github.com/GiovanaFontesS) | Inclusão do código completo disponível, cobertura real dos testes, configuração efetiva do pacote, comandos de execução e distinção entre arquivos presentes e complementos registrados anteriormente. |