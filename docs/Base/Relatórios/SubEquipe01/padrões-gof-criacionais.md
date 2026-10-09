# Padrões GoF Criacionais

> **SubEquipe 01 — Projeto Fórum — Entrega 03**  
> **Padrão escolhido:** Builder (Construtor).  
> **Tecnologia da demonstração:** JavaScript com Node.js.

## 1. Introdução

Os padrões de projeto são soluções recorrentes para problemas comuns de projeto de software. O catálogo *Design Patterns: Elements of Reusable Object-Oriented Software*, conhecido como GoF (*Gang of Four*), organiza os padrões em três categorias: criacionais, estruturais e comportamentais.

Os padrões criacionais tratam de aspectos relacionados à criação de objetos e ajudam a organizar decisões de instanciação. Este trabalho demonstra o padrão criacional Builder em um cenário didático relacionado ao Projeto Fórum: a construção de uma publicação composta por título, conteúdo, autor e tags.

A implementação é independente e tem como objetivo permitir a modelagem, a execução e a validação do padrão sem pressupor que ele já esteja integrado ao sistema principal do fórum.

## 2. Objetivos

### 2.1 Objetivo geral

Compreender e demonstrar a aplicação do padrão GoF Builder por meio da modelagem, implementação e execução de uma solução para construir publicações de fórum de maneira organizada.

### 2.2 Objetivos específicos

- Explicar a finalidade do Builder e sua classificação como padrão criacional.
- Descrever um problema de construção de objetos que possa ser tratado pelo padrão.
- Representar a solução por meio de um diagrama UML.
- Implementar o padrão em JavaScript.
- Validar o comportamento com testes automatizados.
- Analisar benefícios, limitações e adequação do padrão ao cenário.
- Registrar de maneira transparente o uso de IA Generativa.

## 3. Identificação do Padrão de Projeto

**Nome:** Builder (Construtor).  
**Categoria:** Criacional.

O Builder separa o processo de construção de um objeto de sua representação final. A construção ocorre por etapas, por meio de operações que configuram os dados antes da criação do objeto definitivo.

Neste exemplo, `PublicacaoBuilder` reúne os valores fornecidos e o método `build()` cria uma instância de `Publicacao`. A classe `Publicacao` realiza validações básicas dos campos obrigatórios.

Trata-se de uma versão simplificada do padrão, sem uma classe *Director*, porque o cenário não exige uma sequência de construção predefinida reutilizada por diferentes clientes.

## 4. Problema Abordado

Uma publicação de fórum pode reunir atributos como título, conteúdo, autor e tags. Quando a construção de um objeto possui vários atributos, a criação direta pode ficar menos legível, principalmente quando se utilizam muitos argumentos posicionais ou quando a configuração está espalhada por diferentes trechos de código.

O cenário proposto é organizar a montagem de uma publicação com campos obrigatórios e opcionais, utilizando métodos nomeados para deixar explícita a intenção de cada operação. Ao final, o método `build()` solicita a criação do objeto.

Esse problema é apresentado como exemplo acadêmico. Não se afirma que ele tenha sido identificado no código existente do Projeto Fórum.

## 5. Justificativa da Escolha

O Builder foi escolhido por oferecer uma demonstração clara de um padrão criacional em um domínio relacionado ao Projeto Fórum. A construção gradual é fácil de acompanhar no diagrama, no código e durante a apresentação.

O exemplo também permite demonstrar validação de campos obrigatórios e testes automatizados. O Node.js possibilita a execução sem dependências externas.

O Builder não é necessário para todos os objetos. Quando há poucos atributos e nenhuma complexidade relevante na construção, uma abordagem mais simples pode ser suficiente. A escolha deve ser justificada pelo problema que se pretende resolver.

## 6. Fundamentação Teórica

Os padrões criacionais organizam decisões relativas à criação de objetos. No catálogo GoF, essa categoria inclui Abstract Factory, Builder, Factory Method, Prototype e Singleton.

O Builder concentra-se na construção gradual de um objeto. Neste exemplo, `PublicacaoBuilder` fornece os métodos `comTitulo`, `comConteudo`, `comAutor` e `comTags`, que retornam o próprio Builder para permitir o encadeamento. O método `build()` cria a publicação final.

A classe `Publicacao` representa o objeto resultante e valida os campos obrigatórios. Essa divisão permite distinguir a configuração progressiva da validação do objeto final.

### Benefícios

- métodos nomeados tornam a construção mais legível;
- a configuração é separada da criação final;
- os campos obrigatórios são validados no objeto produzido;
- novos atributos podem ser adicionados sem ampliar uma lista de argumentos posicionais.

### Limitações

- adiciona uma classe e código de suporte;
- pode ser excessivo para objetos simples;
- não substitui validações de negócio, segurança ou validação no servidor;
- o exemplo não inclui persistência, autenticação nem integração com a aplicação real.

## 7. Considerações Finais

O cenário proposto demonstra como o Builder pode organizar a construção de uma publicação de fórum. A solução permite configurar atributos por etapas e validar os campos essenciais no objeto final.

A demonstração relaciona fundamentação teórica e implementação executável. Ainda assim, a escolha do padrão deve considerar a complexidade real da construção e não ser feita apenas para inserir um padrão no código.

A eventual integração ao Projeto Fórum deverá ser avaliada e implementada separadamente. Este trabalho não afirma que tal integração já ocorreu.

## Referências

GAMMA, Erich; HELM, Richard; JOHNSON, Ralph; VLISSIDES, John. *Design Patterns: Elements of Reusable Object-Oriented Software*. Reading, MA: Addison-Wesley, 1994.

REFACTORING.GURU. *Builder*. Disponível em: https://refactoring.guru/design-patterns/builder. Acesso em: preencher após consultar a página.

NODE.JS. *Node.js Documentation*. Disponível em: https://nodejs.org/docs/latest/api/. Acesso em: preencher após consultar a documentação.

## Histórico de Versões

| Versão | Data | Descrição | Autor(es) | Revisor(es) | Detalhe da Revisão |
|:---:|:---:|---|---|---|---|
| 1.0 | 08/10/2026 | Criação da documentação inicial sobre o padrão Builder. | [Arthur Fernandes](https://github.com/arthurfernandesj)| A preencher | Versão inicial, a revisar após a execução e a validação do exemplo. |
