# 3. Código

Esta seção apresenta a implementação do padrão de projeto GoF Builder, utilizado para construir objetos `Publicacao` de maneira gradual e organizada. O exemplo foi desenvolvido em JavaScript com Node.js, sem dependências externas, com o objetivo de demonstrar a aplicação do padrão no contexto de publicações de um fórum.

A implementação é didática e independente do sistema real do Projeto Fórum. Ela não realiza persistência em banco de dados nem integração com usuários reais.

## 1. Organização dos arquivos

A estrutura do projeto está organizada da seguinte forma:

```text
src/
├── Publicacao.js
├── PublicacaoBuilder.js
└── index.js

test/
└── PublicacaoBuilder.test.js

package.json
```

## 2. Classe `Publicacao`

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

    this.tags = [
      ...new Set(
        tags.map((tag) => String(tag).trim()).filter(Boolean)
      )
    ];
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

A classe `Publicacao` representa o produto final construído pelo Builder. Sua responsabilidade é armazenar os dados da publicação e garantir que os campos obrigatórios sejam válidos.

A implementação realiza as seguintes operações:

- Verifica se o título, o conteúdo e o autor foram informados.
- Impede a criação de uma publicação quando algum campo obrigatório está vazio.
- Remove espaços em branco no início e no final dos textos.
- Remove tags vazias e duplicadas.
- Implementa o método `toJSON()`, que define a representação dos dados da publicação em formato JSON.

Dessa forma, as regras de validação ficam centralizadas na classe que representa o objeto final.

## 3. Classe `PublicacaoBuilder`

**Arquivo:** `src/PublicacaoBuilder.js`

```javascript
const Publicacao = require("./Publicacao");

class PublicacaoBuilder {
  constructor() {
    this.dados = {
      titulo: "",
      conteudo: "",
      autor: "",
      tags: []
    };
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

A classe `PublicacaoBuilder` implementa o padrão GoF Builder. Sua responsabilidade é permitir a configuração gradual dos atributos necessários para a criação de uma publicação.

Cada método de configuração recebe um valor, armazena-o no objeto interno `dados` e retorna `this`. Esse retorno permite encadear chamadas de métodos, tornando a construção mais legível.

O método `comTags()` verifica se as tags foram fornecidas em um array. Já o método `build()` instancia a classe `Publicacao`, transferindo a ela a responsabilidade de validar os campos obrigatórios e construir o objeto final.

A separação entre Builder e produto permite organizar o processo de construção sem concentrar toda a lógica em uma única chamada de construtor.

## 4. Programa de demonstração

**Arquivo:** `src/index.js`

```javascript
const PublicacaoBuilder = require("./PublicacaoBuilder");

const publicacao = new PublicacaoBuilder()
  .comTitulo("Padrões de Projeto GoF")
  .comConteudo(
    "Exemplo didático do padrão Builder aplicado ao Projeto Fórum."
  )
  .comAutor("Autor demonstrativo")
  .comTags(["GoF", "Arquitetura", "JavaScript", "GoF"])
  .build();

console.log("Publicação construída com sucesso:");
console.log(JSON.stringify(publicacao, null, 2));
```

O arquivo `index.js` demonstra a utilização do Builder na construção de uma publicação. Os métodos são encadeados para definir o título, o conteúdo, o autor e as tags.

Ao final, o método `build()` retorna uma instância de `Publicacao`, e o resultado é exibido no terminal em formato JSON.

O exemplo também inclui uma tag duplicada, permitindo observar o comportamento de remoção de duplicatas implementado na classe `Publicacao`.

O autor informado é apenas demonstrativo. A implementação não realiza autenticação, persistência em banco de dados ou integração com usuários reais.

## 5. Testes automatizados

**Arquivo:** `test/PublicacaoBuilder.test.js`

Os testes automatizados verificam o comportamento esperado do Builder e as validações realizadas pela classe `Publicacao`.

A implementação utiliza o módulo nativo `node:test` do Node.js e a biblioteca `node:assert/strict`, sem necessidade de instalar dependências externas.

Os testes devem contemplar os seguintes cenários:

1. Construção de uma publicação com os dados válidos.
2. Rejeição de uma publicação sem título.
3. Rejeição de uma publicação sem conteúdo.
4. Rejeição de uma publicação sem autor.
5. Rejeição de tags informadas em um formato diferente de array.

**Importante:** para que esta seção represente fielmente o código do projeto, o conteúdo de `PublicacaoBuilder.test.js` deve ser incluído integralmente na documentação. Os cenários acima descrevem os comportamentos esperados, mas não substituem o código dos testes.

## 6. Configuração do projeto

**Arquivo:** `package.json`

A configuração do projeto deve declarar o uso do Node.js e disponibilizar comandos para executar o programa e os testes automatizados.

Exemplo de configuração:

```json
{
  "name": "gof-builder-publicacao",
  "version": "1.0.0",
  "description": "Exemplo didático do padrão GoF Builder aplicado à construção de publicações.",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "test": "node --test"
  },
  "engines": {
    "node": ">=18"
  }
}
```

Caso o arquivo `package.json` do projeto já exista, deve-se preservar sua configuração real e verificar se os comandos apresentados correspondem aos scripts definidos nele.

## 7. Execução do programa

Para executar o exemplo, é necessário ter o Node.js instalado, com versão 18 ou superior.

Na raiz do projeto, execute:

```bash
node src/index.js
```

Para executar os testes automatizados:

```bash
node --test
```

Se os scripts correspondentes estiverem configurados no `package.json`, também será possível utilizar:

```bash
npm start
npm test
```

A execução deve ser registrada com evidências reais, como capturas de tela do terminal, mostrando o resultado do programa e a execução dos testes.

## 8. Considerações sobre a implementação

A implementação demonstra a aplicação do padrão GoF Builder na construção de um objeto que reúne diferentes informações de uma publicação.

O principal benefício está na separação entre o processo de configuração dos dados e a criação do objeto final. O Builder permite definir os atributos por meio de chamadas encadeadas, enquanto a classe `Publicacao` concentra as validações necessárias para a criação do objeto.

O exemplo também demonstra a importância de validar os dados, manter responsabilidades separadas e utilizar testes automatizados para verificar comportamentos esperados.

Por se tratar de uma implementação didática, a solução não representa uma integração funcional com o sistema real do Projeto Fórum. Seu objetivo é demonstrar o funcionamento do padrão de projeto e sua possível aplicação em um contexto de publicações.

## 9. Referências

GAMMA, Erich et al. *Design Patterns: Elements of Reusable Object-Oriented Software*. Boston: Addison-Wesley, 1994.

NODE.JS. *Node.js Documentation*. Disponível em: <https://nodejs.org/docs/latest/api/>. Acesso em: 08 out. 2026.

MERMAID. *Mermaid Documentation*. Disponível em: <https://mermaid.js.org/>. Acesso em: 08 out. 2026.

## 10. Histórico de Versões

| Versão | Data | Descrição | Autor(es) | Revisor(es) | Detalhe da Revisão |
|:---:|:---:|:---|:---|:---|:---|
| 1.0 | 08/10/2026 | Documentação da implementação didática do padrão Builder para construção de publicações. | [Arthur Fernandes](https://github.com/arthurfernandesj) | — | Organização da documentação do código, descrição das classes e registro dos procedimentos de execução e testes. |