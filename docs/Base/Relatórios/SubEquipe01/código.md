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

## 8. Aplicação Complementar do Builder no Cadastro de Usuários

### 8.1 Introdução

Além da construção de publicações, o padrão Builder pode ser aplicado à construção de objetos utilizados no cadastro de usuários. Em um fórum, esse processo pode envolver informações como nome, e-mail, nome de usuário e senha.

A utilização do Builder permite configurar esses dados de maneira gradual, separando a definição dos atributos da criação do objeto final. Essa aplicação complementar demonstra outra possibilidade de utilização do padrão no contexto do fórum, sem substituir a implementação principal de construção de publicações.

### 8.2 Objetivo da implementação

O exemplo utiliza a classe `CadastroUsuarioBuilder` para configurar os dados e a classe `Usuario` para representar o objeto construído.

A implementação permite:

- Configurar os dados do usuário de maneira gradual.
- Encadear métodos para facilitar a leitura do código.
- Verificar os campos obrigatórios antes de criar o objeto.
- Retornar os dados públicos do usuário sem incluir a senha na representação JSON.

O exemplo é independente do sistema de autenticação e do banco de dados do fórum.

### 8.3 Classe `Usuario`

A classe `Usuario` representa o objeto final construído pelo Builder. Ela recebe os dados configurados e verifica se as informações obrigatórias foram fornecidas.

Arquivo: `src/Usuario.js`

```javascript
class Usuario {
    constructor({ nome, email, nomeUsuario, senha }) {
        if (
            !nome?.trim() ||
            !email?.trim() ||
            !nomeUsuario?.trim() ||
            !senha?.trim()
        ) {
            throw new Error(
                "Todos os campos obrigatórios devem ser preenchidos."
            );
        }

        this.nome = nome.trim();
        this.email = email.trim();
        this.nomeUsuario = nomeUsuario.trim();
        this.senha = senha;
    }

    toJSON() {
        return {
            nome: this.nome,
            email: this.email,
            nomeUsuario: this.nomeUsuario
        };
    }
}

module.exports = Usuario;
```

A classe verifica a presença dos campos obrigatórios e armazena as informações. O método `toJSON()` retorna apenas os dados públicos do usuário, sem incluir a senha.

Essa implementação realiza validações básicas de preenchimento. Ela não substitui a validação completa dos dados nem os mecanismos de segurança necessários em um cadastro real.

### 8.4 Classe `CadastroUsuarioBuilder`

A classe `CadastroUsuarioBuilder` configura os dados necessários para a construção do usuário. Cada método define uma informação e retorna a própria instância, permitindo o encadeamento de chamadas.

Arquivo: `src/CadastroUsuarioBuilder.js`

```javascript
const Usuario = require("./Usuario");

class CadastroUsuarioBuilder {
    constructor() {
        this.dados = {
            nome: "",
            email: "",
            nomeUsuario: "",
            senha: ""
        };
    }

    comNome(nome) {
        this.dados.nome = nome;
        return this;
    }

    comEmail(email) {
        this.dados.email = email;
        return this;
    }

    comNomeUsuario(nomeUsuario) {
        this.dados.nomeUsuario = nomeUsuario;
        return this;
    }

    comSenha(senha) {
        this.dados.senha = senha;
        return this;
    }

    build() {
        return new Usuario(this.dados);
    }
}

module.exports = CadastroUsuarioBuilder;
```

O método `build()` finaliza o processo de construção e cria uma instância de `Usuario` com os dados configurados. Caso algum campo obrigatório esteja ausente ou vazio, a validação da classe `Usuario` impede a criação do objeto.

### 8.5 Código cliente

O código cliente utiliza o Builder para configurar os dados e construir o usuário.

Arquivo: `src/index.js`

```javascript
const CadastroUsuarioBuilder =
    require("./CadastroUsuarioBuilder");

try {
    const usuario = new CadastroUsuarioBuilder()
        .comNome("Giovana Fontes")
        .comEmail("giovana@example.com")
        .comNomeUsuario("giovanafontes")
        .comSenha("senha-de-exemplo")
        .build();

    console.log("Usuário construído com sucesso:");
    console.log(usuario.toJSON());
} catch (erro) {
    console.error(
        "Erro ao construir usuário:",
        erro.message
    );
}
```

Nesse exemplo, o cliente configura os atributos por meio dos métodos do Builder e chama `build()` para obter o objeto final. O bloco `try/catch` permite tratar erros que possam ocorrer durante a construção.

O endereço de e-mail e a senha utilizados são dados fictícios para demonstração.

### 8.6 Exemplo de validação

O comportamento da implementação pode ser observado quando um campo obrigatório não é informado.

```javascript
const CadastroUsuarioBuilder =
    require("./CadastroUsuarioBuilder");

try {
    const usuario = new CadastroUsuarioBuilder()
        .comNome("Giovana Fontes")
        .comEmail("giovana@example.com")
        .comNomeUsuario("giovanafontes")
        .build();

    console.log(usuario.toJSON());
} catch (erro) {
    console.error(erro.message);
}
```

Nesse caso, a senha não foi informada. Como ela é um campo obrigatório, a construção do objeto resulta em um erro.

O exemplo demonstra como a validação pode impedir a criação de instâncias incompletas. Essa validação, entretanto, não abrange requisitos adicionais, como formato de e-mail, unicidade do nome de usuário, armazenamento seguro de senhas ou autenticação.

### 8.7 Relação com o padrão Builder

A implementação complementar apresenta os seguintes participantes:

- **Builder concreto:** `CadastroUsuarioBuilder`, responsável por configurar os dados.
- **Produto:** `Usuario`, objeto criado ao final do processo.
- **Cliente:** código que utiliza os métodos do Builder e solicita a construção por meio de `build()`.

Não é necessária uma classe *Director*, pois o cliente define diretamente a sequência de configuração dos dados.


## 9. Considerações sobre a implementação

A implementação demonstra a aplicação do padrão GoF Builder na construção de objetos relacionados ao contexto de um fórum, contemplando tanto a criação de publicações quanto o cadastro de usuários.

Na construção de publicações, as classes `Publicacao` e `PublicacaoBuilder` demonstram a separação entre o objeto final e o processo de configuração de seus atributos. Já na aplicação complementar, as classes `Usuario` e `CadastroUsuarioBuilder` apresentam a utilização do mesmo padrão para configurar gradualmente informações como nome, e-mail, nome de usuário e senha.

A implementação complementar também demonstra a utilização de métodos encadeados, a validação de campos obrigatórios e a separação de responsabilidades entre o Builder e o objeto construído. O método `toJSON()` da classe `Usuario` retorna os dados públicos do usuário, sem incluir a senha na representação.

O exemplo de validação permite observar que a ausência de um campo obrigatório impede a construção de uma instância válida. Entretanto, as verificações implementadas são básicas e não substituem mecanismos adicionais de segurança, autenticação ou validação de dados necessários em um sistema real.

Dessa forma, as duas implementações contribuem para a compreensão prática do padrão Builder, demonstrando sua utilização em diferentes contextos e a importância da organização do código, da validação dos dados e da separação de responsabilidades. As soluções possuem finalidade didática e não representam uma integração funcional com o sistema real do Projeto Fórum.


## 10. Pontos de Vista dos Integrantes

Esta seção apresenta as percepções dos integrantes sobre a implementação do padrão de projeto GoF Builder, considerando sua aplicação na construção de publicações, a organização das responsabilidades e os conhecimentos relacionados à atividade.

### Arthur Fernandes

A elaboração da implementação permite compreender, na prática, como o padrão Builder organiza a criação de objetos com diferentes atributos. A separação entre `Publicacao` e `PublicacaoBuilder` evidencia a distinção entre o objeto final e o processo utilizado para construí-lo.

Outro aspecto relevante é a utilização de métodos encadeados, que tornam a configuração dos atributos mais legível, além da centralização das validações na classe `Publicacao`. A atividade também permite relacionar os conceitos teóricos dos padrões GoF à implementação em JavaScript, considerando a organização do código, a validação de dados e a possibilidade de testar os comportamentos definidos.

## 11. Participação e Evidências

Esta seção registra as atividades relacionadas à implementação e à documentação do padrão Builder. As evidências devem corresponder aos arquivos desenvolvidos e aos resultados efetivamente obtidos.

### Arthur Fernandes

**Atividades desenvolvidas:**

- Organização da documentação da implementação do padrão Builder.
- Descrição das responsabilidades da classe `Publicacao`.
- Documentação dos métodos da classe `PublicacaoBuilder`.
- Apresentação do programa de demonstração em `src/index.js`.
- Descrição dos procedimentos para execução do programa e dos testes automatizados.
- Organização das informações técnicas sobre validação dos dados e construção do objeto final.

**Evidências relacionadas:**

| Evidência | Descrição |
|---|---|
| `src/Publicacao.js` | Implementação do objeto `Publicacao`, incluindo validação dos campos obrigatórios e tratamento das tags. |
| `src/PublicacaoBuilder.js` | Implementação do Builder e dos métodos utilizados para configurar os atributos da publicação. |
| `src/index.js` | Programa de demonstração da construção de uma publicação e exibição do resultado em JSON. |
| `test/PublicacaoBuilder.test.js` | Arquivo destinado aos testes automatizados do Builder e das validações da publicação. |
| `package.json` | Configuração do projeto e dos comandos de execução, caso corresponda ao arquivo efetivamente utilizado. |
| Capturas de tela do terminal | Evidências da execução do programa e dos testes automatizados, após sua realização. |
| Histórico de commits | [Histórico de commit](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/d96e0b265a936257dbbba7982933105fdb99a34c). |

As evidências devem ser anexadas ou referenciadas no repositório conforme a organização definida pela equipe. A existência dos arquivos, a execução dos testes e os registros de contribuição devem ser verificados antes da entrega.

### Giovana Fontes

**Atividades desenvolvidas:**

- Desenvolvimento integral da aplicação complementar do padrão GoF Builder para o cadastro de usuários, documentada na seção 8.
- Implementação da classe `Usuario`, responsável por representar o objeto final e validar o preenchimento dos campos obrigatórios.
- Implementação da classe `CadastroUsuarioBuilder`, com métodos para configurar nome, e-mail, nome de usuário e senha, além do método `build()` para construir o objeto.
- Desenvolvimento do código cliente para demonstrar a construção de usuários por meio do Builder.
- Elaboração do exemplo de validação, demonstrando o erro gerado quando um campo obrigatório não é informado.
- Pesquisa e estudo sobre o padrão de projeto GoF Builder, com foco nos padrões criacionais e em sua aplicação ao cadastro de usuários.
- Documentação e explicação da relação entre o Builder concreto, o produto e o cliente.
- Revisão e correção de documentos relacionados à implementação e à documentação do trabalho.

**Evidências relacionadas:**

| Evidência | Descrição |
|---|---|
| `src/Usuario.js` | Implementação da classe `Usuario`, incluindo a validação dos campos obrigatórios e o método `toJSON()`, que não inclui a senha no retorno. |
| `src/CadastroUsuarioBuilder.js` | Implementação do Builder para configurar gradualmente os dados do usuário e construir o objeto final. |
| `src/index.js` | Código cliente que demonstra a utilização do `CadastroUsuarioBuilder`, o encadeamento de métodos e o tratamento de erros. |
| Exemplo de validação da seção 8.6 | Demonstração da tentativa de construção de um usuário sem informar a senha e do erro resultante. |
| Documentação da seção 8 | Registro da introdução, dos objetivos, das classes, do código cliente, da validação e da relação entre os participantes do padrão Builder. |
| Pesquisa sobre padrões criacionais | Fundamentação teórica utilizada para compreender e explicar a aplicação do padrão GoF Builder. |
| Revisão e correção da documentação | Alterações realizadas para melhorar a organização, a clareza e a correspondência entre a implementação e sua documentação. |
| Histórico de alterações no GitHub | [Pull Request #3 — Repositório Entrega 3](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/pull/3). |

As evidências registram as atividades desenvolvidas na implementação complementar e na documentação. O histórico do Pull Request pode ser consultado para verificar as alterações e os registros de contribuição relacionados à entrega.

## 12. Nível de Contribuição dos Integrantes

O nível de contribuição considera as atividades realizadas pelos integrantes, incluindo implementação, pesquisa, documentação e revisão dos materiais, conforme as evidências disponíveis.

| Integrante | Atividades desenvolvidas | Nível de contribuição | Justificativa |
|---|---|---|---|
| [Arthur Fernandes](https://github.com/arthurfernandesj) | Organização e documentação técnica da implementação do padrão Builder para construção de publicações. | 33,33% | Participação na implementação e na documentação técnica da construção de publicações, conforme as atividades realizadas. |
| [Giovana Fontes](https://github.com/GiovanaFontesS) | Implementação complementar do Builder para cadastro de usuários, pesquisa sobre padrões criacionais, documentação da seção 8 e revisão e correção dos documentos. | 33,33% | Desenvolvimento das classes `Usuario` e `CadastroUsuarioBuilder`, elaboração do código cliente e do exemplo de validação, além da pesquisa teórica e da documentação da aplicação complementar. |

**Observação:** os percentuais devem ser compatíveis com os critérios de avaliação e a distribuição de atividades acordada pela equipe. As evidências e o histórico de alterações devem corresponder às contribuições efetivamente realizadas.

## 13. Referências

GAMMA, Erich et al. *Design Patterns: Elements of Reusable Object-Oriented Software*. Boston: Addison-Wesley, 1994.

NODE.JS. *Node.js Documentation*. Disponível em: <https://nodejs.org/docs/latest/api/>. Acesso em: 08 out. 2026.

MERMAID. *Mermaid Documentation*. Disponível em: <https://mermaid.js.org/>. Acesso em: 08 out. 2026.

## 13. Histórico de Versões

| Versão | Data | Descrição | Autor(es) | Revisor(es) | Detalhe da Revisão |
|:---:|:---:|:---|:---|:---|:---|
| 1.0 | 08/10/2026 | Documentação da implementação didática do padrão Builder para construção de publicações. | [Arthur Fernandes](https://github.com/arthurfernandesj) |  [Giovana Fontes](https://github.com/GiovanaFontesS)  | Organização da documentação técnica, descrição das classes, procedimentos de execução, testes, participação e contribuição. |
| 1.1 | 16/10/2026 | Documentação da implementação didática do padrão Builder para construção de cadastro. | [Giovana Fontes](https://github.com/GiovanaFontesS) | — |  Padrão Biulder para construção de cadastro, participação e contribuição. |