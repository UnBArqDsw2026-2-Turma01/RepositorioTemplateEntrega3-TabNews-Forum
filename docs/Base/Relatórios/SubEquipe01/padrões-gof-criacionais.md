
# Padrões GoF Criacionais

> **SubEquipe 01 — Projeto Fórum — Entrega 03**  
> **Padrão escolhido:** Builder (Construtor).  
> **Tecnologia da demonstração:** JavaScript com Node.js.

## 1. Introdução

Os padrões de projeto são soluções recorrentes para problemas comuns de projeto de software. O catálogo *Design Patterns: Elements of Reusable Object-Oriented Software*, conhecido como GoF (*Gang of Four*), organiza os padrões em três categorias: criacionais, estruturais e comportamentais.

Os padrões criacionais tratam de aspectos relacionados à criação de objetos e ajudam a organizar decisões de instanciação. Este trabalho demonstra o padrão criacional Builder em cenários didáticos relacionados ao Projeto Fórum.

A implementação principal aborda a construção de uma publicação composta por título, conteúdo, autor e tags. Como aplicação complementar, também é apresentado um exemplo de construção de um objeto de usuário, contendo informações utilizadas em um cadastro.

As duas implementações têm caráter demonstrativo e são independentes do sistema principal do fórum. Seu objetivo é permitir a modelagem, a execução e a validação do padrão sem pressupor que ele já esteja integrado à aplicação real.

## 2. Objetivos

### 2.1 Objetivo geral

Compreender e demonstrar a aplicação do padrão GoF Builder por meio da modelagem, implementação e execução de soluções para construir objetos de maneira organizada.

### 2.2 Objetivos específicos

- Explicar a finalidade do Builder e sua classificação como padrão criacional.
- Descrever problemas de construção de objetos que possam ser tratados pelo padrão.
- Representar a solução principal por meio de um diagrama UML.
- Implementar o padrão em JavaScript.
- Demonstrar sua aplicação na construção de publicações e de objetos de usuário.
- Validar o comportamento das implementações.
- Analisar benefícios, limitações e adequação do padrão aos cenários propostos.
- Registrar de maneira transparente o uso de IA Generativa.

## 3. Identificação do Padrão de Projeto

**Nome:** Builder (Construtor).  
**Categoria:** Criacional.

O Builder separa o processo de construção de um objeto de sua representação final. A construção ocorre por etapas, por meio de operações que configuram os dados antes da criação do objeto definitivo.

Na implementação principal, `PublicacaoBuilder` reúne os valores fornecidos e o método `build()` cria uma instância de `Publicacao`. Na aplicação complementar, `CadastroUsuarioBuilder` configura os dados necessários para criar uma instância de `Usuario`.

As duas implementações utilizam métodos específicos para definir os atributos e permitem encadear chamadas, tornando a construção mais explícita e legível.

Trata-se de uma versão simplificada do padrão, sem uma classe *Director*, porque os cenários não exigem uma sequência de construção predefinida reutilizada por diferentes clientes.

## 4. Problema Abordado

A construção de objetos pode se tornar menos legível quando envolve diversos atributos, principalmente quando são utilizados muitos argumentos posicionais ou quando a configuração está espalhada por diferentes trechos de código.

No contexto de um fórum, uma publicação pode reunir título, conteúdo, autor e tags. Já um objeto de usuário pode conter informações como nome, e-mail, nome de usuário e senha.

O cenário proposto é organizar a montagem desses objetos por meio de métodos nomeados, permitindo configurar os atributos individualmente e solicitar a criação do objeto final por meio de `build()`.

Esses problemas são apresentados como exemplos acadêmicos. Não se afirma que tenham sido identificados no código existente do Projeto Fórum.

## 5. Justificativa da Escolha

O Builder foi escolhido por oferecer uma demonstração clara de um padrão criacional em um domínio relacionado ao Projeto Fórum. A construção gradual é fácil de acompanhar no diagrama, no código e durante a apresentação.

A implementação principal demonstra a construção de publicações, enquanto o exemplo complementar explora a aplicação do mesmo padrão na configuração dos dados de um usuário.

Os exemplos também permitem demonstrar validação de campos obrigatórios e a separação entre a configuração dos atributos e a criação do objeto final. O Node.js possibilita a execução das demonstrações sem dependências externas específicas do padrão.

O Builder não é necessário para todos os objetos. Quando há poucos atributos e nenhuma complexidade relevante na construção, uma abordagem mais simples pode ser suficiente. A escolha deve ser justificada pelo problema que se pretende resolver.

## 6. Fundamentação Teórica

Os padrões criacionais organizam decisões relativas à criação de objetos. No catálogo GoF, essa categoria inclui Abstract Factory, Builder, Factory Method, Prototype e Singleton.

O Builder concentra-se na construção gradual de um objeto. A configuração ocorre por meio de métodos que definem seus atributos, enquanto a operação `build()` solicita a criação do produto final.

Neste trabalho, o padrão é demonstrado em dois cenários:

- **Construção de publicações:** utiliza `PublicacaoBuilder` para configurar título, conteúdo, autor e tags antes de criar uma instância de `Publicacao`.
- **Construção de usuários:** utiliza `CadastroUsuarioBuilder` para configurar nome, e-mail, nome de usuário e senha antes de criar uma instância de `Usuario`.

Nas duas implementações, os métodos de configuração retornam o próprio Builder, permitindo o encadeamento de chamadas.

### 6.1 Benefícios

- Métodos nomeados tornam a construção mais legível.
- A configuração é separada da criação final.
- Os campos obrigatórios podem ser validados no objeto produzido.
- Novos atributos podem ser adicionados sem ampliar uma lista de argumentos posicionais.
- O mesmo padrão pode ser aplicado a diferentes tipos de objetos quando a construção gradual for útil.

### 6.2 Limitações

- Adiciona classes e código de suporte.
- Pode ser excessivo para objetos simples.
- Não substitui validações completas de negócio, segurança ou validação no servidor.
- Não implementa, por si só, persistência, autenticação ou integração com a aplicação real.
- A existência de dois exemplos demonstrativos não significa que seja necessário utilizar Builder em todos os objetos do sistema.

## 7. Aplicação Complementar do Builder no Cadastro de Usuários

### 7.1 Introdução

Além da construção de publicações, o padrão Builder pode ser aplicado à construção de objetos utilizados no cadastro de usuários. Em um fórum, esse processo pode envolver informações como nome, e-mail, nome de usuário e senha.

A utilização do Builder permite configurar esses dados de maneira gradual, separando a definição dos atributos da criação do objeto final. Essa aplicação complementar demonstra outra possibilidade de utilização do padrão no contexto do fórum, sem substituir a implementação principal de construção de publicações.

### 7.2 Objetivo da implementação

O exemplo utiliza a classe `CadastroUsuarioBuilder` para configurar os dados e a classe `Usuario` para representar o objeto construído.

A implementação permite:

- Configurar os dados do usuário de maneira gradual.
- Encadear métodos para facilitar a leitura do código.
- Verificar os campos obrigatórios antes de criar o objeto.
- Retornar os dados públicos do usuário sem incluir a senha na representação JSON.

O exemplo é independente do sistema de autenticação e do banco de dados do fórum.

### 7.3 Classe `Usuario`

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

### 7.4 Classe `CadastroUsuarioBuilder`

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

### 7.5 Código cliente

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

### 7.6 Exemplo de validação

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

### 7.7 Relação com o padrão Builder

A implementação complementar apresenta os seguintes participantes:

- **Builder concreto:** `CadastroUsuarioBuilder`, responsável por configurar os dados.
- **Produto:** `Usuario`, objeto criado ao final do processo.
- **Cliente:** código que utiliza os métodos do Builder e solicita a construção por meio de `build()`.

Não é necessária uma classe *Director*, pois o cliente define diretamente a sequência de configuração dos dados.

## 8. Considerações Finais

Os cenários apresentados demonstram como o Builder pode organizar a construção de diferentes objetos relacionados ao contexto de um fórum. A implementação principal aborda a construção de publicações, enquanto o exemplo complementar explora a configuração dos dados de um usuário.

As demonstrações permitem relacionar fundamentação teórica e implementação executável, evidenciando a construção gradual, o encadeamento de métodos e a validação de campos obrigatórios.

Entretanto, a escolha do padrão deve considerar a complexidade real da construção e não ser feita apenas para inserir um padrão no código. A construção de um objeto de usuário não equivale à implementação completa de um cadastro: funcionalidades como validação avançada, criptografia de senhas, armazenamento no banco de dados, verificação de duplicidade e autenticação precisam ser tratadas por componentes específicos.

A eventual integração dessas implementações ao Projeto Fórum deverá ser avaliada e realizada separadamente. Este trabalho não afirma que tal integração já ocorreu.

## Referências

GAMMA, Erich; HELM, Richard; JOHNSON, Ralph; VLISSIDES, John. *Design Patterns: Elements of Reusable Object-Oriented Software*. Reading, MA: Addison-Wesley, 1994.

REFACTORING.GURU. *Builder*. Disponível em: https://refactoring.guru/design-patterns/builder. Acesso em: preencher após consultar a página.

NODE.JS. *Node.js Documentation*. Disponível em: https://nodejs.org/docs/latest/api/. Acesso em: preencher após consultar a documentação.

## Histórico de Versões

| Versão | Data | Descrição | Autor(es) | Revisor(es) | Detalhe da Revisão |
|---|---|---|---|---|---|
| 1.0 | 08/10/2026 | Criação da documentação inicial sobre o padrão Builder. | [Arthur Fernandes](https://github.com/arthurfernandesj)| A preencher | Versão inicial, a revisar após a execução e a validação do exemplo. |
| 1.1 | 10/10/2026 | Inclusão de exemplo complementar de construção de usuário com Builder. | [Giovana Fontes](https://github.com/GiovanaFonteS) | A preencher | Versão inicial de exemplo complementar |
