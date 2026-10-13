
# Padrões GoF Criacionais

> **SubEquipe 02 — Projeto Fórum — Entrega 03**  
> **Padrão escolhido:** Singleton.  
> **Tecnologia da demonstração:** Python.

## 1. Introdução

Os padrões de projeto são soluções recorrentes para problemas comuns no desenvolvimento de software. O catálogo *Design Patterns: Elements of Reusable Object-Oriented Software*, conhecido como GoF (*Gang of Four*), organiza esses padrões em três categorias: criacionais, estruturais e comportamentais.

Os padrões criacionais estão relacionados à criação de objetos e buscam organizar e simplificar as decisões de instanciação. Este trabalho apresenta o padrão criacional Singleton por meio de exemplos didáticos relacionados ao Projeto Fórum.

## 2. Objetivos

### 2.1 Objetivo geral

Compreender e demonstrar a aplicação do padrão GoF Singleton por meio da modelagem, implementação e execução de soluções para construir objetos de maneira organizada e condizente com o padrão.

### 2.2 Objetivos específicos

- qwert
- qwert
- qwert
- qwert
- qwert
- qwert

## 3. Identificação do Padrão de Projeto

**Nome:** Singleton
**Categoria:** Criacional.

Preencher kk

## 4. Problema Abordado

Preencher kk

## 5. Justificativa da Escolha

Preencher kk

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

## 7. 

### 7.1 Introdução

Introdução kk

### 7.2 Objetivo da implementação

Preencher kk

### 7.3 Classe `Usuario`

Preencher kk

### 7.4 Classe `CadastroUsuarioBuilder`

Preencher kk

### 7.5 Código cliente

Preencher kk

### 7.6 Exemplo de validação

Preencher kk

### 7.7 Relação com o padrão Singleton

A implementação complementar apresenta os seguintes participantes:

- **Singleton concreto:** 
- **Produto:** 
- **Cliente:** 

## 8. Considerações Finais

Prencher kk

## Referências

GAMMA, Erich; HELM, Richard; JOHNSON, Ralph; VLISSIDES, John. *Design Patterns: Elements of Reusable Object-Oriented Software*. Reading, MA: Addison-Wesley, 1994.

## Histórico de Versões

| Versão | Data | Descrição | Autor(es) | Revisor(es) | Detalhe da Revisão |
|---|---|---|---|---|---|
| 1.0 | 13/10/2026 | Criação da documentação inicial sobre o padrão Singleton. | [Isaac Menezes](https://github.com/pratamz250)| A preencher | Versão inicial, a revisar após a execução e a validação do exemplo. |
