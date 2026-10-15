# Padrões GoF Estruturais

> **SubEquipe 02 — Projeto Fórum — Entrega 03**  
> **Padrão escolhido:** Facade.
> **Tecnologia da demonstração:** Python.

## 1. Introdução

Os padrões de projeto são soluções recorrentes para problemas comuns de projeto de software. O catálogo *Design Patterns: Elements of Reusable Object-Oriented Software*, conhecido como GoF (*Gang of Four*), organiza os padrões em três categorias: criacionais, estruturais e comportamentais.

Os padrões estruturais tratam de como classes e objetos são compostos para formar estruturas maiores e mais complexas. Eles ajudam a garantir que, quando um sistema cresce, essas estruturas permaneçam flexíveis e eficientes. Este trabalho demonstra o padrão estrutural Facade (Fachada) em cenários didáticos relacionados ao Projeto TabNews.

A implementação principal (teórica) aborda a orquestração do processo de renderização da tela inicial, que envolve autorização de conteúdo e propagandas, atualização de postagens e validação de paramentros.

As duas implementações têm caráter demonstrativo e são independentes do sistema principal do TabNews. Seu objetivo é permitir a modelagem, a execução e a validação do padrão sem pressupor que ele já esteja integrado à aplicação real.

## 2. Objetivos

### 2.1 Objetivo geral

Compreender e demonstrar a aplicação do padrão GoF Facade por meio da modelagem, implementação e execução de soluções para simplificar a interação com subsistemas complexos.

### 2.2 Objetivos específicos

- Explicar a finalidade do Facade e sua classificação como padrão estrutural.
- Descrever problemas de acoplamento e complexidade que possam ser tratados pelo padrão.
- Representar a solução por meio da orquestração de múltiplas classes.
- Implementar o padrão estrutural em Python.
- Demonstrar sua aplicação no registro de usuários e publicações no contexto do TabNews.
- Validar o comportamento das implementações.
- Analisar benefícios, limitações e adequação do padrão aos cenários propostos.
- Registrar de maneira transparente o uso de IA Generativa.

## 3. Identificação do Padrão de Projeto

**Nome:** Facade.  
**Categoria:** Estrutural.

O Facade fornece uma interface unificada e de alto nível para um conjunto de interfaces em um subsistema. Ele define uma interface simplificada que torna o subsistema mais fácil de ser utilizado pelo código cliente.

Na implementação teórica, uma classe `PublicacaoFacade` orquestra as classes `FiltroSpam`, `RepositorioPostagem`, e `ServicoNotificacao`. Na aplicação complementar prática, a classe `RegistroUsuarioFacade` coordena as validações de dados, a persistência e o envio de e-mails de boas-vindas.

A Fachada não "esconde" as classes complexas de forma obrigatória (se o cliente precisar, ainda pode acessá-las diretamente), mas oferece um caminho padronizado e direto para as operações mais comuns.

## 4. Problema Abordado

A execução de tarefas de negócio frequentemente requer a interação com múltiplas classes e serviços distintos. Isso obriga o código cliente (como um controlador de API ou interface de usuário) a conhecer detalhes íntimos de implementação, gerando alto acoplamento.

No contexto do TabNews, carregar conteúdo não é apenas renderizar qualquer coisa na tela. É preciso validar se há spam ou conteúdo impróprio, salvar no banco de dados e disparar alertas. Da mesma forma, carregar um postagem patrocinada envolve validação da mesma.

O cenário proposto é organizar esse fluxo criando uma classe intermediária (Facade) que possui métodos simples (ex: `carregar_dados()`), enquanto, por baixo dos panos, ela instancia e coordena todos os microsserviços necessários. 

Esses problemas são apresentados como exemplos acadêmicos para demonstrar a utilidade do padrão.

## 5. Justificativa da Escolha

O Facade foi escolhido por ser um dos padrões estruturais mais intuitivos e aplicáveis em arquiteturas baseadas em serviços e rotas de API, muito comuns no ecossistema do TabNews.

Assim como o Facade, a tela incial serve como uma porta de acesso a diversas funções do programa. Por esse paralelo o facade se enquadra como o mais adepto a representar o foco da demonstração.

Python possibilita a execução dessas demonstrações de forma limpa, sem a necessidade de configurações complexas, destacando o papel arquitetural da Fachada.

O Facade não é necessário para operações triviais de CRUD (Create, Read, Update, Delete) em apenas uma tabela. A escolha deve ser justificada quando há um fluxo coordenado envolvendo múltiplas regras de negócio ou serviços paralelos.

## 6. Fundamentação Teórica

Os padrões estruturais lidam com a composição de classes e objetos. No catálogo GoF, essa categoria inclui Adapter, Bridge, Composite, Decorator, Facade, Flyweight e Proxy.

O Facade concentra-se em fornecer uma interface limpa para um subsistema complexo. 

Neste trabalho, o padrão é discutido no cenário de renderização da tela inicial e tudo que o acompanha, como diferentes categorias de publicações, propaganda, validação de parametros e filtragem de conteúdo

### 6.1 Benefícios

- Isola o código cliente da complexidade dos subsistemas.
- Promove baixo acoplamento entre a interface/controladores e as regras de negócio.
- Facilita a manutenção: se a biblioteca de envio de e-mail mudar, apenas o Facade (ou o próprio serviço) é ajustado, sem quebrar o cliente.
- Centraliza o fluxo de execução das tarefas complexas do sistema.

### 6.2 Limitações

- A classe Facade pode se tornar um "God Object" (Objeto Deus) se acabar agregando métodos de absolutamente todos os subsistemas da aplicação.
- Adiciona uma camada extra de abstração que pode ser desnecessária para fluxos muito simples.
- Não substitui uma arquitetura em camadas bem definida; atua como um facilitador estrutural.

## 7. Aplicação Complementar do Facade na tela inicial

### 7.1 Introdução

No contexto do TabNews, a tela inicial é o ponto principal e que envolve diversos componentes do sistema. Em vez de deixar o controlador da rota lidar com a validação de segurança, filtragem de conteúdo e organização das postagens, utilizamos o padrão Facade para orquestrar essa sequência.

Essa aplicação demonstra como o código cliente se torna limpo e legível ao delegar as complexidades para a `carregar_dados()`.

### 7.2 Objetivo da implementação

O exemplo utiliza classes independentes que representam subsistemas (`Conteudo`, `validador`, `Publicidade`) e a `RegistroUsuarioFacade` para coordenar essas ações de forma estruturada.

A implementação permite:
- Executar múltiplas etapas de uma regra de negócio através de uma única chamada de método.
- Isolar as regras de validação, banco e comunicação.
- Gerenciar exceções (como dados inválidos) de forma centralizada.

### 7.3 Classe `Usuario`

Preencher kk

### 7.4 Classe `CadastroUsuarioBuilder`

Preencher kk

### 7.5 Código cliente

Preencher kk

### 7.6 Exemplo de validação

Preencher kk

### 7.7 Relação com o padrão Facade

A implementação complementar apresenta os seguintes participantes:

- **Facade concreto:** 
- **Produto:** 
- **Cliente:** 

## 8. Considerações Finais

Prencher kk

## Referências

GAMMA, Erich; HELM, Richard; JOHNSON, Ralph; VLISSIDES, John. *Design Patterns: Elements of Reusable Object-Oriented Software*. Reading, MA: Addison-Wesley, 1994.

REFACTORING.GURU. *Facade*. Disponível em: https://refactoring.guru/pt-br/design-patterns/facade. Acesso em: 15 out. 2026.

## Histórico de Versões

| Versão | Data | Descrição | Autor(es) | Revisor(es) | Detalhe da Revisão |
|---|---|---|---|---|---|
| 1.0 | 13/10/2026 | Criação da documentação inicial sobre o padrão Facade. | [Isaac Menezes](https://github.com/pratamz250) | [Pedro Ramos](https://github.com/PedroRSR) | Conteúdo fala sobre padrão criacional e não estrutural |
| 1.1 | 15/10/2026 | Correção e adição de novas informações. | [Pedro Ramos](https://github.com/PedroRSR) | [Pablo Rodrigues](https://github.com/Pablo-R-L) | Adição de novos conteúdos referente ao padrão Facade do tópico 1 ao 7 |
| 1.2 | 15/10/2026 | Correções referentes ao foco do projeto e código | [Pablo Rodrigues](https://github.com/Pablo-R-L) |  |  |