# 1. Padrões GoF Comportamentais

> **SubEquipe 03 — Projeto Fórum — Entrega 03**  
> **Padrão escolhido:** Observer (Observador).  
> **Tecnologia da demonstração:** JavaScript com Node.js.

## 1. Introdução

Os padrões de projeto são soluções recorrentes para problemas comuns de projeto de software. O catálogo *Design Patterns: Elements of Reusable Object-Oriented Software*, conhecido como GoF (*Gang of Four*), organiza 23 padrões em três categorias: criacionais, estruturais e comportamentais (GAMMA et al., 2000).

Os padrões **comportamentais** tratam de algoritmos e da atribuição de responsabilidades entre objetos. Mais do que descrever objetos ou classes isoladamente, eles descrevem os padrões de comunicação entre eles, caracterizando fluxos de controle que seriam difíceis de acompanhar em tempo de execução (GAMMA et al., 2000). Entre eles, o **Observer** define uma dependência um-para-muitos entre objetos, de modo que, quando um objeto muda de estado, todos os seus dependentes são notificados e atualizados automaticamente. Trata-se de um dos padrões mais adotados no desenvolvimento de software: sua ideia central está presente desde os eventos do navegador e do Node.js até sistemas distribuídos que utilizam o modelo *publish/subscribe* do Redis e filas de mensagens como o RabbitMQ.

A escolha do Observer dialoga com a trajetória de **Filipe Deschamps**, criador do TabNews, plataforma que serve de referência ao Projeto Fórum. Antes do TabNews, ele já havia utilizado esse padrão na série de vídeos [Primeiro Jogo Multiplayer](https://www.youtube.com/playlist?list=PLMdYygf53DP5SVQQrkKCVWDS0TwYLVitL), iniciada pelo vídeo [*Como foi programar meu Primeiro Jogo Multiplayer*](https://youtu.be/0sTfIZvjYJk), na qual desenvolve um jogo multiplayer em JavaScript com o objetivo declarado de ensinar arquitetura e padrões de projeto. No [código-fonte do jogo](https://github.com/filipedeschamps/meu-primeiro-jogo-multiplayer), o padrão aparece em mais de um ponto: o módulo que escuta o teclado mantém uma lista de observadores e os avisa a cada tecla pressionada, por meio das funções `subscribe` e `notifyAll`, e o próprio jogo notifica seus observadores a cada mudança de estado. Um desses observadores é o servidor, que repassa os comandos a todos os jogadores conectados.

```javascript
// playground/1st-release/public/keyboard-listener.js (trecho)
function subscribe(observerFunction) {
    state.observers.push(observerFunction)
}

function notifyAll(command) {
    for (const observerFunction of state.observers) {
        observerFunction(command)
    }
}
```

O trecho evidencia os mesmos elementos descritos pelo GoF: um sujeito que mantém uma coleção de observadores, uma operação de inscrição e uma operação de notificação que percorre essa coleção. A diferença está na forma: em vez de classes e interfaces, o jogo representa os observadores como funções, um estilo idiomático em JavaScript.

Este trabalho aplica o mesmo padrão a um problema do domínio do fórum: desacoplar o serviço responsável pelos conteúdos dos componentes que reagem aos seus eventos, como o crédito de TabCoins e a notificação de respostas. A implementação tem caráter demonstrativo e é independente do sistema real do TabNews; ela não afirma que a plataforma utilize o padrão dessa forma. A modelagem da solução está descrita em [Modelagem](/Base/Relatórios/SubEquipe03/modelagem.md).

## 2. Objetivos

### 2.1 Objetivo geral

Compreender e demonstrar a aplicação do padrão GoF Observer por meio da modelagem, da implementação e da execução de uma solução que desacopla o serviço de conteúdos do fórum dos componentes que reagem aos seus eventos.

### 2.2 Objetivos específicos

- Explicar a finalidade do Observer e sua classificação como padrão comportamental.
- Identificar, a partir dos artefatos da Entrega 02, um problema de acoplamento que possa ser tratado pelo padrão.
- Representar a solução por meio de diagramas UML de classes e de sequência.
- Implementar o padrão em JavaScript, com Node.js e sem dependências externas.
- Demonstrar, em execução, um mesmo evento provocando reações independentes em mais de um observador.
- Validar o comportamento da implementação por meio de testes automatizados.
- Comparar a solução com a implementação de referência de Filipe Deschamps e com a estrutura canônica descrita pelo GoF.
- Analisar criticamente os benefícios, as limitações e a adequação do padrão ao cenário proposto.
- Registrar de maneira transparente o uso de IA Generativa.

## 3. Identificação do Padrão de Projeto

**Nome:** Observer (Observador).  
**Também conhecido como:** *Dependents* (Dependentes), *Publish-Subscribe* (Publicação-Assinatura).  
**Categoria:** Comportamental.  
**Escopo:** Objeto.

**Intenção:** definir uma dependência um-para-muitos entre objetos, de modo que, quando um objeto muda de estado, todos os seus dependentes são notificados e atualizados automaticamente (GAMMA et al., 2000).

O escopo é de **objeto** porque as relações entre o sujeito e seus observadores são estabelecidas em tempo de execução, por meio da inscrição, e não fixadas por herança em tempo de compilação.

Gamma et al. (2000) classificam os padrões por escopo conforme o mecanismo que define as relações entre os participantes. Nos padrões de **classe**, essas relações são estabelecidas por herança e ficam fixas em tempo de compilação, como no *Template Method*. Nos padrões de **objeto**, elas são estabelecidas por composição e podem mudar em tempo de execução. Na solução, existe herança (`ServicoDeConteudo` estende `Sujeito`, e cada observador concreto estende `Observador`), mas ela apenas reaproveita o mecanismo de inscrição e define o contrato de atualização. A relação que caracteriza o padrão, isto é, quais observadores são notificados por qual sujeito, é montada pelo cliente com `inscrever` e pode ser desfeita com `desinscrever` durante a execução, como mostra a etapa de desinscrição do [Diagrama de Sequência](/Base/Relatórios/SubEquipe03/modelagem.md?id=_4-diagrama-de-sequência-uml). Por isso, o uso de herança não muda o escopo do padrão.

Na solução proposta, os participantes do padrão correspondem às seguintes classes:

| Participante (GoF) | Classe na solução | Responsabilidade |
|---|---|---|
| *Subject* | `Sujeito` | Mantém a coleção de observadores e oferece as operações de inscrição, desinscrição e notificação. |
| *Observer* | `Observador` | Define a operação `atualizar`, pela qual os observadores recebem as notificações. |
| *ConcreteSubject* | `ServicoDeConteudo` | Publica, remove, envia para revisão e restaura conteúdos e notifica os observadores quando esses eventos ocorrem. |
| *ConcreteObserver* | `ServicoDeTabCoins` | Credita e debita TabCoins em reação aos eventos de conteúdo. |
| *ConcreteObserver* | `NotificadorDeResposta` | Notifica o autor de um conteúdo quando ele recebe uma resposta. |
| *ConcreteObserver* | `RegistroDeAtividades` | Grava um log de auditoria sequencial de todos os eventos do sistema, independentemente do tipo. |

<p align="center">Tabela 1: Participantes do padrão Observer na solução proposta.</p>

## 4. Problema Abordado

Na Entrega 02, a SubEquipe_03 modelou o fluxo de [publicação de um comentário](https://unbarqdsw2026-2-turma01.github.io/RepositorioTemplateEntrega2-TabNews-Forum/#/Base/Relatórios/SubEquipe_03/ModelagemDinamica) na Página da postagem. No Diagrama de Sequência daquela entrega, o serviço de conteúdos, após persistir o comentário, chama diretamente o serviço de TabCoins para creditar o autor. No Diagrama de Estados da mesma entrega, o ciclo de vida do conteúdo exige ações secundárias em múltiplas transições: a remoção debita os créditos, a entrada no estado *Em Revisão* suspende os créditos, e a aprovação pela moderação os restaura.

O [Diagrama de Implantação](https://unbarqdsw2026-2-turma01.github.io/RepositorioTemplateEntrega2-TabNews-Forum/#/Base/Relatórios/SubEquipe_03/ModelagemEstatica) da mesma entrega, por sua vez, já previa o nó externo **Serviço de e-mail**, acionado para notificar o autor de um conteúdo quando ele recebe uma resposta, mas sem indicar qual componente decide acioná-lo. Mantida a estrutura da Entrega 02, essa decisão também caberia ao serviço de conteúdos, que passaria a depender do envio de e-mails. Nesta solução, ela é assumida pelo `NotificadorDeResposta`, um observador concreto.

Em ambos os casos, o serviço de conteúdos **conhece e invoca diretamente** cada componente interessado nos seus eventos. Com uma única reação, esse acoplamento é tolerável. O problema surge com a evolução do sistema: um fórum acumula naturalmente novas reações aos mesmos eventos, como notificar o autor de uma publicação respondida, registrar a atividade do usuário, atualizar contadores ou alimentar um ranking. Mantida a estrutura original, cada nova reação exigiria:

1. **alterar o serviço de conteúdos**, acrescentando uma nova chamada ao seu fluxo de publicação ou remoção;
2. **acrescentar uma nova dependência** a esse serviço, aumentando o número de componentes que precisam estar disponíveis para que ele funcione e seja testado;
3. **misturar responsabilidades**, já que um serviço cuja função é gerenciar conteúdos passa a coordenar regras de TabCoins, de notificações e de quaisquer outras reações.

O problema, portanto, é **manter a consistência entre objetos relacionados sem torná-los fortemente acoplados**, exatamente a motivação que Gamma et al. (2000) apresentam para o Observer.

O cenário é apresentado como exemplo acadêmico, derivado dos artefatos de modelagem da própria equipe. Não se afirma que esse problema tenha sido identificado no código do TabNews.

## 5. Justificativa da Escolha

O Observer foi escolhido entre os padrões comportamentais pelos seguintes motivos:

- **Aderência ao domínio.** Eventos de conteúdo são, por natureza, difundidos para múltiplos interessados: uma única publicação afeta saldos, notificações e contadores. O padrão não precisa ser forçado sobre o problema; ele descreve a forma que o problema já tem.
- **Continuidade e rastreabilidade com a Entrega 02.** O problema não foi criado para justificar o padrão, mas identificado nos diagramas de sequência e de estados produzidos pela própria SubEquipe_03. Isso permite comparar o fluxo anterior ao fluxo refatorado e evidenciar o efeito do padrão.
- **Referência concreta no ecossistema do projeto.** Como apresentado na introdução, o criador da plataforma de referência já empregou o padrão em JavaScript, o que oferece uma implementação real para comparação com a estrutura canônica do GoF.
- **Ampla adoção na indústria.** A ideia do padrão é a base de mecanismos utilizados diariamente no desenvolvimento de software, como os eventos do navegador e do Node.js, o *Pub/Sub* do Redis e as filas de mensagens do RabbitMQ. Compreendê-lo em sua forma original, dentro de um único processo, prepara a equipe para entender essas ferramentas e para decidir quando elas são necessárias.
- **Demonstrabilidade.** O efeito do padrão é observável em execução: uma única chamada a `publicarComentario` produz, no terminal, reações independentes de cada observador. Isso favorece a gravação do vídeo exigido pela entrega.

Outros padrões comportamentais foram considerados e descartados para este cenário:

| Padrão | Motivo do descarte |
|---|---|
| *Mediator* | Centraliza a comunicação entre vários objetos que interagem entre si. No cenário, a comunicação é unidirecional, do serviço de conteúdos para os interessados, e um mediador acrescentaria um intermediário sem benefício. |
| *Chain of Responsibility* | Repassa uma requisição ao longo de uma cadeia até que *um* objeto a trate. No cenário, *todos* os interessados devem reagir ao evento, e não apenas o primeiro capaz de fazê-lo. |
| *Strategy* | Permite trocar o algoritmo utilizado por um objeto. O problema não é variar a forma como uma única operação é realizada, mas acrescentar novas reações a um evento. |

<p align="center">Tabela 2: Padrões comportamentais considerados e motivos do descarte.</p>

O Observer não é necessário em todos os casos. Quando um evento tem um único interessado, estável e conhecido, a chamada direta é mais simples e mais fácil de acompanhar. A adoção do padrão se justifica, neste cenário, pela multiplicidade e pela variabilidade das reações aos eventos de conteúdo.

## 6. Fundamentação Teórica

O Observer está entre os padrões mais difundidos do catálogo GoF. Gamma et al. (2000) apontam como sua origem a arquitetura **Model-View-Controller** (MVC) do Smalltalk, na qual o modelo notifica as visões sempre que seus dados mudam, permitindo que várias representações de um mesmo dado coexistam sem que o modelo conheça nenhuma delas.

A estrutura do padrão é composta por quatro participantes. O **Subject** conhece seus observadores e oferece uma interface para inscrevê-los e desinscrevê-los; o **Observer** define a interface de atualização; o **ConcreteSubject** armazena o estado de interesse e notifica os observadores quando ele muda; e o **ConcreteObserver** mantém uma referência ao estado de seu interesse e implementa a atualização. A colaboração entre eles ocorre em duas fases: os observadores se inscrevem no sujeito e, a cada mudança, o sujeito percorre a sua coleção e chama a operação de atualização de cada um.

O padrão se relaciona diretamente a dois princípios de projeto orientado a objetos:

- **Princípio Aberto/Fechado** (MEYER, 1988; MARTIN, 2003): o sujeito permanece fechado para modificação e aberto para extensão, pois novas reações a um evento são adicionadas por meio de novos observadores, sem alteração do sujeito.
- **Princípio da Inversão de Dependência** (MARTIN, 2003): o sujeito depende da abstração `Observador`, e não das classes concretas que reagem aos eventos.

Freeman e Robson (2021) resumem o padrão no princípio de projeto de **buscar baixo acoplamento entre objetos que interagem**: o sujeito sabe apenas que seus observadores implementam uma interface, e ambos podem variar de forma independente.

Gamma et al. (2000) também discutem questões de implementação que influenciaram diretamente a [modelagem](/Base/Relatórios/SubEquipe03/modelagem.md) desta solução, entre elas:

- **Modelos *push* e *pull*:** o sujeito pode enviar aos observadores os dados detalhados da mudança (*push*) ou apenas avisá-los, deixando que consultem o sujeito (*pull*). O modelo *push* torna o sujeito menos reutilizável, por presumir o que os observadores precisam; o *pull* pode ser ineficiente, por obrigar cada observador a descobrir o que mudou.
- **Consistência antes da notificação:** o sujeito deve estar em um estado consistente antes de notificar os observadores, pois eles podem consultá-lo durante a atualização. Na solução, a notificação ocorre somente após a persistência do conteúdo.
- **Especificação dos eventos de interesse:** os observadores podem receber todas as notificações ou apenas as dos tipos que lhes interessam. Na solução, o tipo do evento é transportado na notificação e cada observador decide a quais tipos reage.

### 6.1 Adoção do padrão no desenvolvimento de software

O Observer é um dos padrões GoF mais presentes no cotidiano do desenvolvimento, frequentemente sem ser nomeado. Sua ideia aparece em diferentes escalas:

| Contexto | Mecanismo | Correspondência com o Observer |
|---|---|---|
| Navegador | [`addEventListener`](https://developer.mozilla.org/pt-BR/docs/Web/API/EventTarget/addEventListener) do DOM | Elementos da página são sujeitos; as funções registradas são observadores notificados a cada evento, como um clique. |
| Node.js | [`EventEmitter`](https://nodejs.org/api/events.html) | O emissor mantém a lista de *listeners* (`on`) e os notifica de forma síncrona (`emit`). |
| Redis | [*Pub/Sub*](https://redis.io/docs/latest/develop/interact/pubsub/) | Clientes assinam canais (`SUBSCRIBE`) e recebem as mensagens publicadas neles (`PUBLISH`) por outros clientes. |
| RabbitMQ | [*Exchanges* do tipo *fanout*](https://www.rabbitmq.com/tutorials/tutorial-three-javascript) | Uma mensagem publicada em um *exchange* é entregue a todas as filas vinculadas a ele, cada uma consumida por um serviço interessado. |

<p align="center">Tabela 3: Exemplos de adoção da ideia do Observer no desenvolvimento de software.</p>

É importante distinguir o Observer, tal como descrito pelo GoF, do ***publish/subscribe*** utilizado por ferramentas como o Redis e o RabbitMQ. Embora o GoF cite *Publish-Subscribe* como um nome alternativo do padrão, as duas abordagens diferem em um ponto essencial:

- No **Observer**, o sujeito **conhece diretamente** seus observadores, ainda que apenas por meio de uma abstração, e os notifica em geral de forma síncrona, dentro do mesmo processo.
- No ***publish/subscribe***, um **intermediário** (*broker*) se coloca entre quem publica e quem assina. Publicadores e assinantes não se conhecem, podem estar em processos ou máquinas diferentes, e a entrega costuma ser assíncrona. Hohpe e Woolf (2003) descrevem essa forma como o padrão de integração *Publish-Subscribe Channel*.

O *publish/subscribe* pode ser entendido, portanto, como a evolução do Observer para sistemas distribuídos: o desacoplamento que o padrão estabelece entre objetos é estendido a serviços independentes. Em contrapartida, ferramentas como o RabbitMQ acrescentam garantias que o Observer não oferece, como a persistência das mensagens e a entrega a consumidores que estavam temporariamente indisponíveis, ao custo de uma infraestrutura adicional para operar.

A solução desta entrega implementa o Observer em sua forma original, em um único processo. A escolha é deliberada: o objetivo é evidenciar os participantes do padrão, o que um *broker* esconderia atrás de sua própria interface.

### 6.2 Benefícios

- **Acoplamento abstrato entre sujeito e observadores:** o sujeito conhece apenas uma lista de objetos que estendem a classe abstrata `Observador`, sem depender de suas classes concretas.
- **Comunicação por difusão (*broadcast*):** a notificação é enviada a todos os observadores inscritos, sem que o sujeito precise saber quantos são.
- **Extensibilidade:** novos observadores podem ser adicionados ou removidos em tempo de execução, sem modificar o sujeito nem os demais observadores.
- **Testabilidade:** o sujeito pode ser testado com observadores simulados, e cada observador pode ser testado isoladamente, apenas com eventos construídos para o teste.
- **Efetivação do Princípio Aberto/Fechado:** a presença do `RegistroDeAtividades` ilustra como requisitos secundários (como auditoria) são isolados em observadores dedicados, mantendo o `ServicoDeConteudo` focado e inalterado.

### 6.3 Limitações

- **Atualizações inesperadas:** como os observadores desconhecem uns aos outros, uma operação aparentemente simples sobre o sujeito pode desencadear uma série de atualizações cujo custo e efeito não são evidentes (GAMMA et al., 2000).
- **Fluxo de controle implícito:** ao ler apenas o código do sujeito, não é possível saber quais efeitos uma mudança produz. Por isso, o diagrama de sequência é um complemento necessário ao diagrama de classes.
- **Ordem de notificação:** o padrão não garante a ordem em que os observadores são notificados, e a solução não deve depender dela.
- **Tratamento de falhas:** em uma notificação síncrona, uma exceção lançada por um observador pode interromper a notificação dos seguintes, o que exige uma decisão explícita de projeto.
- **Referências pendentes:** observadores que não são desinscritos continuam referenciados pelo sujeito, o que pode provocar notificações indevidas ou retenção de memória.

## 7. Considerações Finais

O cenário apresentado mostra como o Observer desacopla o serviço de conteúdos das reações aos seus eventos. O `ServicoDeConteudo` apenas anuncia que um comentário foi publicado, que um conteúdo foi removido ou que passou pela moderação, e cada observador decide como reagir: o `ServicoDeTabCoins` atualiza os saldos, o `NotificadorDeResposta` avisa o autor respondido e o `RegistroDeAtividades` grava a auditoria. Novas reações passam a ser acrescentadas por meio de novos observadores, sem alterar o sujeito.

A solução parte de um problema identificado nos artefatos da própria equipe na Entrega 02, o que permite comparar o fluxo com chamadas diretas ao fluxo com notificação e evidenciar o efeito do padrão. A [Modelagem](/Base/Relatórios/SubEquipe03/modelagem.md) detalha a estrutura e a colaboração entre os participantes, e as páginas de [Código](/Base/Relatórios/SubEquipe03/código.md) e de [Execução](/Base/Relatórios/SubEquipe03/execução.md) demonstram o comportamento descrito.

Entretanto, a escolha do padrão deve considerar a quantidade e a variabilidade das reações a cada evento, e não ser feita apenas para inserir um padrão no código. Com um único interessado estável, a chamada direta continua sendo a opção mais simples. Em um sistema real, operações lentas, como o envio de e-mails, poderiam exigir a evolução da notificação síncrona para um intermediário de mensagens, mantendo a mesma separação de responsabilidades.

A eventual integração dessa implementação ao Projeto Fórum deverá ser avaliada e realizada separadamente.

## Referências

DESCHAMPS, Filipe. **Como foi programar meu Primeiro Jogo Multiplayer (playlist sobre Desenvolvimento de Jogos)**. YouTube. Disponível em: [https://youtu.be/0sTfIZvjYJk](https://youtu.be/0sTfIZvjYJk). Acesso em: 14 out. 2026.

DESCHAMPS, Filipe. **Primeiro Jogo Multiplayer** (playlist). YouTube. Disponível em: [https://www.youtube.com/playlist?list=PLMdYygf53DP5SVQQrkKCVWDS0TwYLVitL](https://www.youtube.com/playlist?list=PLMdYygf53DP5SVQQrkKCVWDS0TwYLVitL). Acesso em: 14 out. 2026.

DESCHAMPS, Filipe. **meu-primeiro-jogo-multiplayer**. GitHub. Disponível em: [https://github.com/filipedeschamps/meu-primeiro-jogo-multiplayer](https://github.com/filipedeschamps/meu-primeiro-jogo-multiplayer). Acesso em: 14 out. 2026.

FREEMAN, Eric; ROBSON, Elisabeth. **Use a Cabeça! Padrões de Projetos**. 2. ed. Rio de Janeiro: Alta Books, 2021.

GAMMA, Erich; HELM, Richard; JOHNSON, Ralph; VLISSIDES, John. **Padrões de Projeto: soluções reutilizáveis de software orientado a objetos**. Porto Alegre: Bookman, 2000.

HOHPE, Gregor; WOOLF, Bobby. **Enterprise Integration Patterns: Designing, Building, and Deploying Messaging Solutions**. Boston: Addison-Wesley, 2003.

MARTIN, Robert C. **Agile Software Development: Principles, Patterns, and Practices**. Upper Saddle River: Prentice Hall, 2003.

MEYER, Bertrand. **Object-Oriented Software Construction**. Englewood Cliffs: Prentice Hall, 1988.

MOZILLA. **EventTarget.addEventListener()**. MDN Web Docs. Disponível em: [https://developer.mozilla.org/pt-BR/docs/Web/API/EventTarget/addEventListener](https://developer.mozilla.org/pt-BR/docs/Web/API/EventTarget/addEventListener). Acesso em: 14 out. 2026.

NODE.JS. **Events**. Node.js Documentation. Disponível em: [https://nodejs.org/api/events.html](https://nodejs.org/api/events.html). Acesso em: 14 out. 2026.

RABBITMQ. **Publish/Subscribe (JavaScript)**. RabbitMQ Tutorials. Disponível em: [https://www.rabbitmq.com/tutorials/tutorial-three-javascript](https://www.rabbitmq.com/tutorials/tutorial-three-javascript). Acesso em: 14 out. 2026.

REDIS. **Redis Pub/Sub**. Redis Documentation. Disponível em: [https://redis.io/docs/latest/develop/interact/pubsub/](https://redis.io/docs/latest/develop/interact/pubsub/). Acesso em: 14 out. 2026.

REFACTORING.GURU. **Observer**. Disponível em: [https://refactoring.guru/pt-br/design-patterns/observer](https://refactoring.guru/pt-br/design-patterns/observer). Acesso em: 14 out. 2026.

SUBEQUIPE_03. **Modelagem Estática na Notação UML**. Entrega 02 — Projeto Fórum. Disponível em: [https://unbarqdsw2026-2-turma01.github.io/RepositorioTemplateEntrega2-TabNews-Forum/#/Base/Relatórios/SubEquipe_03/ModelagemEstatica](https://unbarqdsw2026-2-turma01.github.io/RepositorioTemplateEntrega2-TabNews-Forum/#/Base/Relatórios/SubEquipe_03/ModelagemEstatica). Acesso em: 17 out. 2026.

SUBEQUIPE_03. **Modelagem Dinâmica na Notação UML**. Entrega 02 — Projeto Fórum. Disponível em: [https://unbarqdsw2026-2-turma01.github.io/RepositorioTemplateEntrega2-TabNews-Forum/#/Base/Relatórios/SubEquipe_03/ModelagemDinamica](https://unbarqdsw2026-2-turma01.github.io/RepositorioTemplateEntrega2-TabNews-Forum/#/Base/Relatórios/SubEquipe_03/ModelagemDinamica). Acesso em: 14 out. 2026.

## Histórico de Versões

| Versão | Data | Descrição | Autor(es) | Revisor(es) | Detalhe da Revisão |
|:------:|:----:|:----------|:----------|:------------|:-------------------|
| 1.0 | 14/10/2026 | Criação do documento e da introdução sobre padrões comportamentais e o padrão Observer. | [Caio Alexandre](https://github.com/bitterteriyaki) |  | Contextualização dos padrões comportamentais segundo o GoF, e relação com o uso prévio do Observer por Filipe Deschamps na série Primeiro Jogo Multiplayer, com trecho do código-fonte do jogo. |
| 1.1 | 14/10/2026 | Adição dos objetivos, identificação do padrão, problema abordado, justificativa da escolha e fundamentação teórica. | [Caio Alexandre](https://github.com/bitterteriyaki) |  | Definição dos objetivos geral e específicos, mapeamento dos participantes do GoF para as classes da solução, descrição do problema de acoplamento a partir dos artefatos da Entrega 02, comparação com os padrões Mediator, Chain of Responsibility e Strategy, e fundamentação teórica com benefícios e limitações do padrão. |
| 1.2 | 14/10/2026 | Inclusão da adoção do padrão no desenvolvimento de software. | [Caio Alexandre](https://github.com/bitterteriyaki) |  | Menção à ampla adoção do padrão na introdução e na justificativa da escolha; criação da subseção 6.1, com exemplos de adoção (DOM, Node.js, Redis Pub/Sub e RabbitMQ) e a distinção entre o Observer e o modelo publish/subscribe com intermediário. |
| 1.3 | 16/10/2026 | Expansão do escopo do padrão para englobar Moderação e Auditoria. | [Guilherme Moura](https://github.com/Guilherme-Moura) | | Inclusão do `RegistroDeAtividades` como novo ConcreteObserver; alinhamento do `ServicoDeConteudo` com o ciclo completo do Diagrama de Estados da Entrega 02 (fluxos *Em Revisão* e *Restaurado*). |
| 1.4 | 17/10/2026 | Relação do problema abordado com o Diagrama de Implantação da Entrega 02. | [Leonardo Bonetti](https://github.com/LeoFacB) |  | Na seção 4 (Problema Abordado), inclusão de um parágrafo sobre o nó externo Serviço de e-mail do Diagrama de Implantação da Entrega 02, que já previa a notificação do autor de uma resposta sem definir o componente responsável, e de como essa responsabilidade passa ao `NotificadorDeResposta`. Inclusão da página de Modelagem Estática da Entrega 02 nas referências. Motivo: mostrar que a notificação de respostas não é uma reação inventada para a demonstração, mas uma responsabilidade já prevista pela equipe. |
| 1.5 | 17/10/2026 | Inclusão das considerações finais. | [Leonardo Bonetti](https://github.com/LeoFacB) |  | Criação da seção 7 (Considerações Finais), presente nas páginas de padrões das SubEquipes 01 e 02 e ausente nesta, com a síntese de como o Observer desacopla o `ServicoDeConteudo` dos três observadores, a ligação com a Entrega 02 e com as páginas de Modelagem, Código e Execução, os limites de adoção do padrão e a ressalva de que a solução não está integrada ao Projeto Fórum. Motivo: alinhar a estrutura da página à das demais subequipes, que fecham o documento com essa seção. |
| 1.6 | 17/10/2026 | Aprofundamento do escopo de objeto e ajustes na identificação do padrão. | [Leonardo Bonetti](https://github.com/LeoFacB) |  | Na seção 3, inclusão de um parágrafo que explica a classificação por escopo de Gamma et al. (2000): padrões de classe fixam as relações por herança em tempo de compilação, e padrões de objeto as estabelecem por composição em tempo de execução. Como a solução usa herança (`Sujeito` e `Observador`), o parágrafo esclarece que ela só reaproveita o mecanismo de inscrição e o contrato de atualização, enquanto a relação que caracteriza o padrão é montada e desfeita em execução, o que evita a leitura equivocada de que o padrão seria de classe. Na Tabela 1, a responsabilidade do `ServicoDeConteudo` passou a incluir a revisão e a restauração. Na seção 6.2, inclusão do ponto final que faltava no item do Princípio Aberto/Fechado. |

<p align="center">Tabela 4: Histórico de Versões.</p>
