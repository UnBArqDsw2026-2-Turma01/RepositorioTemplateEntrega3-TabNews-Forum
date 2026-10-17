# Padrões GoF Criacionais — Complemento

> **SubEquipe 01 — Projeto Fórum — Entrega 03**
> **Padrões complementares:** Factory Method, Prototype e Singleton.
> **Tecnologia da demonstração:** JavaScript com Node.js.

## 1. Introdução

Este complemento amplia a seção de padrões criacionais da SubEquipe 01, que apresenta o padrão Builder. O catálogo GoF organiza os padrões criacionais em cinco: Abstract Factory, Builder, Factory Method, Prototype e Singleton. Como o Builder já foi tratado, este documento aborda os três restantes que têm aplicação plausível no contexto do fórum: **Factory Method**, **Prototype** e **Singleton**.

Assim como a implementação principal, os exemplos são demonstrativos e independentes do sistema real do fórum. Cada padrão é ilustrado com código executável e testes automatizados.

## 2. Objetivos

### 2.1 Objetivo geral

Compreender e demonstrar a aplicação de três padrões criacionais complementares ao Builder, por meio de implementações executáveis no domínio do fórum.

### 2.2 Objetivos específicos

- Explicar a finalidade de cada padrão e sua classificação como criacional.
- Descrever, para cada padrão, o problema de criação de objetos que ele resolve.
- Implementar um exemplo funcional de cada padrão em JavaScript.
- Validar o comportamento dos exemplos por meio de testes automatizados.
- Comparar os quatro padrões criacionais demonstrados e analisar seus limites.
- Registrar de forma transparente o uso de IA Generativa.

## 3. Identificação dos Padrões

| Padrão | Categoria | Problema que resolve | Exemplo no complemento |
|:---|:---|:---|:---|
| Factory Method | Criacional | Delegar a uma subclasse a decisão de qual tipo concreto criar. | `Publicacao` ou `Comentario` conforme o tipo solicitado |
| Prototype | Criacional | Criar um objeto a partir de uma cópia de um modelo existente. | `ModeloPublicacao` clonado em um novo rascunho |
| Singleton | Criacional | Garantir uma única instância compartilhada de um recurso. | `RegistroAtividade` (registro de eventos) |

## 4. Factory Method

### 4.1 Problema

O fórum possui dois tipos de conteúdo que compartilham autor e texto, mas têm regras diferentes: a publicação exige título, e o comentário exige a publicação à qual pertence. Se o código cliente instanciar diretamente cada classe, ele passa a conhecer todas as regras de criação e precisa ser alterado sempre que um novo tipo for incluído.

### 4.2 Solução

O criador abstrato `ConteudoCreator` define o método `fabricar()`, que as subclasses implementam. `PublicacaoCreator` e `ComentarioCreator` decidem qual produto concreto criar. O cliente trabalha apenas com o criador e com a interface comum `criar()`.

```javascript
const publicacao = obterCreator("publicacao").criar({
    titulo: "Padrões GoF criacionais",
    texto: "Resumo dos padrões.",
    autor: "Autor demonstrativo",
});
```

O método `obterCreator(tipo)` funciona como um ponto de seleção. Tipos desconhecidos geram erro explícito.

### 4.3 Validação

Os testes verificam que cada criador produz o tipo correto, que as regras de cada produto são aplicadas (título obrigatório em `Publicacao`, vínculo obrigatório em `Comentario`) e que o método abstrato não pode ser usado diretamente.

## 5. Prototype

### 5.1 Problema

Um autor pode querer reaproveitar a estrutura de um tutorial ou de uma publicação-modelo, com seções, tags e formatação já definidas. Criar cada novo texto do zero repete trabalho, e copiar manualmente os campos é propenso a erro, principalmente quando há listas (como tags) que não podem ser compartilhadas por referência.

### 5.2 Solução

`ModeloPublicacao` implementa o método `clonar(sobrescritas)`, que cria um novo objeto com cópia independente dos dados. As tags são copiadas, de modo que alterar o clone não altera o original. O clone sempre nasce com status `rascunho`, e campos de estado não são herdados do modelo.

```javascript
const modelo = new ModeloPublicacao({ titulo: "Modelo", tags: ["tutorial"], status: "publicado" });
const rascunho = modelo.clonar({ titulo: "Tutorial de Builder" });
rascunho.tags.push("builder"); // o modelo original permanece com ["tutorial"]
```

### 5.3 Validação

Os testes verificam que o clone é um objeto diferente com os mesmos dados, que a alteração do clone não afeta o original, que o clone sempre nasce como rascunho e que as sobrescritas substituem apenas os campos informados.

### 5.4 Observação sobre o uso

O clone cria um **novo conteúdo em rascunho**. Ele não copia avaliações, TabCoins, comentários nem histórico. Não é recomendável usar o padrão para republicar conteúdo que tenha sido mal avaliado, pois isso configuraria a manipulação de qualificações prevista nos Termos de Uso e na FAQ do TabNews. A aplicação, portanto, está restrita a modelos e rascunhos.

## 6. Singleton

### 6.1 Problema

Alguns recursos devem existir em uma única instância, como o registro de atividades usado para auditoria e monitoramento. Se cada parte do sistema criar seu próprio registro, os eventos ficam espalhados em vários lugares e nenhum deles representa o histórico completo.

### 6.2 Solução

`RegistroAtividade` guarda sua única instância em um atributo estático e a expõe por `getInstance()`. O construtor recebe uma chave privada (um `Symbol` não exportado), o que impede a criação direta de outra instância.

```javascript
const registro = RegistroAtividade.getInstance();
registro.registrar({ acao: "conteudo_criado", tipo: "publicacao" });

// Em qualquer outro ponto do código:
RegistroAtividade.getInstance().listar(); // inclui o evento acima
```

Em Node.js, o sistema de módulos já devolve a mesma instância de um módulo exportado, o que dispensa a classe para esse fim. A implementação com `getInstance()` foi mantida porque torna a intenção explícita e ilustra o padrão clássico.

### 6.3 Validação

Os testes verificam que `getInstance()` devolve sempre a mesma instância, que a construção direta é bloqueada, que registros feitos em um ponto aparecem em outro e que eventos sem ação são rejeitados.

## 7. Comparação entre os padrões criacionais demonstrados

| Aspecto | Builder | Factory Method | Prototype | Singleton |
|:---|:---|:---|:---|:---|
| Pergunta que responde | Como montar um objeto complexo passo a passo? | Qual classe concreta deve ser criada? | Como criar um objeto copiando outro? | Como garantir uma única instância? |
| Quem decide o tipo | O cliente, por meio de métodos de configuração | Uma subclasse do criador | O próprio objeto modelo | A própria classe |
| Relação com o cliente | Encadeamento de métodos e `build()` | Chamada única a `criar()` | Chamada a `clonar()` | Chamada a `getInstance()` |
| Principal ganho | Legibilidade na configuração | Desacoplamento da classe concreta | Reaproveitamento sem recriar campos | Ponto único de acesso ao recurso |
| Principal risco | Classes extras para objetos simples | Hierarquia de criadores que cresce | Cópia rasa de estruturas aninhadas | Estado global difícil de testar |

## 8. Limitações

- **Factory Method:** para dois tipos de conteúdo, uma função com `switch` seria suficiente. A hierarquia de criadores se justifica quando novos tipos e regras de criação forem previstos.
- **Prototype:** `clonar()` faz cópia rasa de objetos aninhados. Para estruturas profundas, seria necessária uma cópia profunda específica.
- **Singleton:** o estado global dificulta testes isolados, pois os registros persistem entre os casos de teste. Os testes deste complemento limpam o registro para contornar isso. Em uma aplicação real, a instância costuma ser injetada como dependência.
- Os três exemplos são demonstrativos. Não implementam persistência, autenticação, controle de acesso nem integração com o banco de dados do fórum.
- A existência destes exemplos não significa que os padrões devam ser usados em todo o sistema. A escolha deve considerar a complexidade real de cada criação.

## 9. Considerações finais

Os três padrões demonstram soluções distintas para problemas de criação de objetos. O Factory Method desacopla o cliente das classes concretas, o Prototype reaproveita modelos sem recriar seus campos e o Singleton garante um ponto único de acesso a um recurso compartilhado.

Assim como o Builder, cada padrão deve ser adotado quando o problema justificar. O complemento não afirma que os padrões tenham sido integrados ao Projeto Fórum, e eventuais integrações deverão ser avaliadas separadamente.

## Referências

GAMMA, Erich; HELM, Richard; JOHNSON, Ralph; VLISSIDES, John. *Design Patterns: Elements of Reusable Object-Oriented Software*. Reading, MA: Addison-Wesley, 1994.

REFACTORING.GURU. *Factory Method*. Disponível em: https://refactoring.guru/design-patterns/factory-method. Acesso em: preencher após consultar a página.

REFACTORING.GURU. *Prototype*. Disponível em: https://refactoring.guru/design-patterns/prototype. Acesso em: preencher após consultar a página.

REFACTORING.GURU. *Singleton*. Disponível em: https://refactoring.guru/design-patterns/singleton. Acesso em: preencher após consultar a página.

NODE.JS. *Node.js Documentation — Test runner*. Disponível em: https://nodejs.org/api/test.html. Acesso em: preencher após consultar a documentação.

TABNEWS. *FAQ — Perguntas frequentes*. Disponível em: https://www.tabnews.com.br/faq. Acesso em: preencher após consultar a página.

## Uso de Inteligência Artificial Generativa

O código, os testes e a redação deste complemento foram elaborados com apoio do Claude (Anthropic). Os exemplos foram executados e validados com `node --test` antes da inclusão no documento. Registro da conversa: preencher.


## Histórico de Versões

| Versão | Data | Descrição | Autor(es) | Revisor(es) | Detalhe da Revisão |
|---|---|---|---|---|---|
| 1.0 | 08/10/2026 | Criação da documentação inicial sobre o padrão Builder. | [Arthur Fernandes](https://github.com/arthurfernandesj)| [Giovana Fontes](https://github.com/GiovanaFontesS) | Versão inicial, a revisar após a execução e a validação do exemplo. |
| 1.1 | 10/10/2026 | Inclusão de exemplo complementar de construção de usuário com Builder. | [Giovana Fontes](https://github.com/GiovanaFonteS) | [Giovana Fontes](https://github.com/GiovanaFontesS) | Versão inicial de exemplo complementar |
| 1.2 | 13/10/2026 | Inclusão e correção de Exemplos | [Giovana Fontes](https://github.com/GiovanaFonteS) |  [Arthur Fernandes](https://github.com/arthurfernandesj) | Correção de exemplos citados na "Aplicação Complementar do Builder no Cadastro de Usuários" |
| 1.3 | 14/10/2026 | Criação do complemento sobre os padrões criacionais Factory Method, Prototype e Singleton. | [João Pedro S. Maciel](https://github.com/jopesmp) | [Arthur Fernandes](https://github.com/arthurfernandesj) | Implementação dos três padrões com testes automatizados, comparação com o Builder e análise de limitações. |
