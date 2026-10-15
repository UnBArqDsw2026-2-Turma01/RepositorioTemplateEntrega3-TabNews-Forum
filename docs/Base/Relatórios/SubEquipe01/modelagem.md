# 2. Modelagem — Complemento GoF Criacionais

## 1. Introdução

A modelagem do complemento tem como objetivo representar a estrutura e o comportamento dos componentes que implementam três padrões criacionais complementares ao Builder: **Factory Method**, **Prototype** e **Singleton**.

Cada padrão é representado por um conjunto de classes do domínio do fórum. O Factory Method é ilustrado pela criação de `Publicacao` e `Comentario`; o Prototype, pelo `ModeloPublicacao` clonado em rascunhos; e o Singleton, pelo `RegistroAtividade`.

Esta modelagem corresponde à implementação demonstrativa em JavaScript. Ela não representa uma integração já realizada ao sistema principal do Projeto Fórum.

## 2. Diagrama de Classes UML

O diagrama de classes apresenta os componentes da solução, seus atributos, métodos e relacionamentos.

<p align="center">
  <img src="diagrama_classes.png" alt="Diagrama de Classes UML do complemento GoF" width="800">
</p>

<p align="center">
  <strong>Figura 1 — Diagrama de classes UML dos padrões Factory Method, Prototype e Singleton.</strong><br>
  Fonte: elaboração da SubEquipe01.
</p>

### 2.1 Interpretação do diagrama

O diagrama apresenta três agrupamentos:

- **Factory Method:** a classe abstrata `Conteudo` é especializada em `Publicacao` e `Comentario`. A classe abstrata `ConteudoCreator` define o método `fabricar()`, implementado por `PublicacaoCreator` e `ComentarioCreator`. A função `obterCreator()` seleciona o criador concreto a partir do tipo solicitado.
- **Prototype:** `ModeloPublicacao` expõe `clonar()`, que devolve um novo objeto independente.
- **Singleton:** `RegistroAtividade` tem construtor protegido por chave privada e uma única instância acessada por `getInstance()`.

As relações de criação (`PublicacaoCreator` → `Publicacao`, `ComentarioCreator` → `Comentario`) são representadas como dependências, pois o criador apenas instancia o produto durante `fabricar()`, sem manter uma associação permanente.

## 3. Diagrama de Sequência UML

O diagrama de sequência representa a ordem das interações durante a criação de uma publicação pelo Factory Method.

<p align="center">
  <img src="diagrama_sequencia.png" alt="Diagrama de Sequência UML do Factory Method" width="700">
</p>

<p align="center">
  <strong>Figura 2 — Diagrama de sequência do padrão Factory Method aplicado à criação de publicações.</strong><br>
  Fonte: elaboração da SubEquipe01.
</p>

### 3.1 Descrição da sequência

O cliente solicita à fábrica o criador correspondente ao tipo `"publicacao"`. Se o tipo for conhecido, a fábrica devolve um `PublicacaoCreator`; caso contrário, um erro é gerado.

Em seguida, o cliente chama `criar()` com os dados da publicação. O criador delega a `fabricar()`, que instancia `Publicacao`. A validação do título ocorre no construtor do produto: se o título estiver ausente, o erro é propagado de volta ao cliente.

## 4. Participantes dos padrões

### 4.1 Factory Method

| Participante | Papel | Implementação |
|---|---|---|
| Produto | Interface comum dos objetos criados | `Conteudo` (abstrata) |
| Produto concreto | Tipos de conteúdo | `Publicacao`, `Comentario` |
| Criador | Declara a fabricação e a operação comum | `ConteudoCreator` |
| Criador concreto | Decide o produto a criar | `PublicacaoCreator`, `ComentarioCreator` |
| Seletor | Escolhe o criador a partir do tipo | `obterCreator()` |

### 4.2 Prototype

| Participante | Papel | Implementação |
|---|---|---|
| Protótipo | Objeto que sabe se copiar | `ModeloPublicacao` |
| Cliente | Solicita o clone e aplica sobrescritas | `src/index.js` |

### 4.3 Singleton

| Participante | Papel | Implementação |
|---|---|---|
| Singleton | Classe com instância única e acesso global controlado | `RegistroAtividade` |

## 5. Regras de criação e validação

A modelagem considera as seguintes regras:

| Identificador | Regra | Componente responsável |
|---|---|---|
| RN01 | Uma publicação deve ter título não vazio. | `Publicacao` |
| RN02 | Um comentário deve referenciar a publicação a que pertence. | `Comentario` |
| RN03 | Texto e autor são obrigatórios para todo conteúdo. | `Conteudo` |
| RN04 | Tipos de conteúdo desconhecidos não devem gerar criador. | `obterCreator()` |
| RN05 | O clone de um modelo sempre é criado com status `rascunho`. | `ModeloPublicacao` |
| RN06 | Listas do modelo (tags) são copiadas, não compartilhadas, na clonagem. | `ModeloPublicacao` |
| RN07 | A classe `RegistroAtividade` só pode ser instanciada por `getInstance()`. | `RegistroAtividade` |
| RN08 | Eventos sem ação não podem ser registrados. | `RegistroAtividade` |

Essas regras correspondem ao código da demonstração. Elas não substituem regras de negócio, controles de segurança ou validações exigidas por uma aplicação real.

## 6. Correspondência entre modelagem e implementação

| Elemento da modelagem | Arquivo | Implementação |
|---|---|---|
| Conteúdo, Publicação, Comentário, criadores e `obterCreator()` | `src/factoryMethod.js` | Factory Method com validações de cada produto. |
| `ModeloPublicacao` | `src/prototype.js` | Clonagem com cópia independente das tags e status `rascunho`. |
| `RegistroAtividade` | `src/singleton.js` | Instância única protegida por chave privada. |
| Cliente | `src/index.js` | Demonstração dos três padrões. |
| Testes automatizados | `test/padroes.test.js` | Verifica criação, validação, clonagem e unicidade da instância (14 testes). |

Caso sejam adicionados novos tipos de conteúdo, métodos ou classes, os diagramas e as regras deverão ser revisados.

## 7. Justificativa das decisões de modelagem

A hierarquia `Conteudo` foi adotada para concentrar os atributos comuns (texto e autor), deixando em `Publicacao` e `Comentario` apenas as regras próprias de cada tipo.

O `ConteudoCreator` mantém a lógica comum de criação em `criar()` e delega a escolha do produto a `fabricar()`. Isso permite incluir novos tipos de conteúdo criando um novo criador concreto, sem alterar o cliente.

O `ModeloPublicacao` foi representado com `clonar()` retornando um novo objeto, e não com uma hierarquia de protótipos, porque o exemplo possui um único tipo de modelo.

O `RegistroAtividade` usa construtor protegido por chave privada, de modo que a unicidade da instância não depende apenas de convenção. A classe foi mantida mesmo com o sistema de módulos do Node.js, por tornar explícita a intenção do padrão.

## 8. Manutenibilidade, extensibilidade e limitações

A separação entre criadores e produtos facilita a inclusão de novos tipos de conteúdo, como enquetes ou anexos, que exigiriam apenas um novo produto e um novo criador concreto.

Algumas limitações devem ser consideradas:

- Para apenas dois tipos de conteúdo, uma função com `switch` seria suficiente. A hierarquia se justifica quando novos tipos forem previstos.
- `clonar()` faz cópia rasa de objetos aninhados. Para estruturas mais profundas, seria necessária uma cópia profunda específica.
- O Singleton mantém estado global, o que dificulta testes isolados. Os testes deste complemento limpam o registro antes de cada verificação.
- O clone cria um novo rascunho e não copia avaliações nem histórico. Ele não deve ser usado para republicar conteúdo mal avaliado, conforme os Termos de Uso do TabNews.

## 9. Considerações finais

A modelagem apresentada demonstra como três padrões criacionais complementares ao Builder podem organizar a criação de conteúdos, a clonagem de modelos e o acesso a um recurso compartilhado.

Os diagramas são coerentes com a implementação e com os testes automatizados. Eventuais integrações ao Projeto Fórum deverão ser avaliadas e realizadas separadamente.

## 10. Referências

GAMMA, Erich; HELM, Richard; JOHNSON, Ralph; VLISSIDES, John. *Design Patterns: Elements of Reusable Object-Oriented Software*. Reading, MA: Addison-Wesley, 1994.

OBJECT MANAGEMENT GROUP (OMG). *OMG Unified Modeling Language (OMG UML)*. Disponível em: https://www.omg.org/spec/UML/. Acesso em: preencher após consultar a documentação.

REFACTORING.GURU. *Factory Method*, *Prototype* e *Singleton*. Disponíveis em: https://refactoring.guru/design-patterns. Acesso em: preencher após consultar as páginas.


## Histórico de Versões

| Versão | Data | Descrição | Autor(es) | Revisor(es) | Detalhe da Revisão |
|:---:|:---:|---|---|---|---|
| 1.0 | 08/10/2026 | Criação inicial da modelagem do padrão Builder. | [Arthur Fernandes](https://github.com/arthurfernandesj) | [Giovana Fontes](https://github.com/GiovanaFontesS) | Versão inicial com diagrama de classes, participantes e fluxo de construção. |
| 1.1 | 08/10/2026 | Ampliação da modelagem e alinhamento com a implementação demonstrativa. | [Arthur Fernandes](https://github.com/arthurfernandesj) | [Giovana Fontes](https://github.com/GiovanaFontesS) | Inclusão dos diagramas de sequência e atividades, regras de validação, correspondência com os arquivos de código e referências. |
| 1.2 | 10 /10/2026 | Adição de considerações sobre a aplicabilidade do padrão Builder | [Giovana Fontes](https://github.com/GiovanaFontesS) | [Arthur Fernandes](https://github.com/arthurfernandesj) | Comparação com a construção tradicional e análise de manutenibilidade, extensibilidade e limitações da solução. |
| 1.3 | 14/10/2026 | Criação inicial da modelagem do complemento GoF criacional (Factory Method, Prototype e Singleton). | [João Pedro S. Maciel](https://github.com/jopesmp) | preencher | Diagramas de classes e de sequência, participantes, regras de validação, correspondência com a implementação e análise de limitações. |

