# 5. IA Generativa

## Descrição

Este documento registra o uso de IA Generativa como recurso de apoio às atividades da SubEquipe 02 na Entrega 03, com foco na aplicação do padrão GoF Facade para organizar o carregamento dos dados da tela inicial do fórum.

O registro aborda a compreensão do padrão, a elaboração e revisão da documentação e a análise crítica das sugestões geradas. A implementação considerada é didática: a classe `TelaInicialFacade` coordena os serviços de publicações relevantes, publicações recentes e estatísticas, consolidando os resultados para o cliente.

## Objetivo

Registrar como a IA Generativa apoiou a documentação e a compreensão da aplicação do padrão Facade, considerando:

- a classificação do Facade como padrão estrutural;
- a relação entre a fachada, os subsistemas e o cliente;
- a simplificação do acesso aos serviços e a redução do acoplamento;
- a documentação do fluxo de carregamento e do tratamento de falhas;
- a análise crítica das sugestões produzidas pela ferramenta.

A IA é utilizada como apoio, sem substituir a compreensão do código, as decisões técnicas ou a responsabilidade dos integrantes pela verificação dos resultados.

## Metodologia

As sugestões da IA Generativa foram utilizadas como apoio à organização e à redação do conteúdo sobre o Facade. A análise foi relacionada à implementação existente: `TelaInicialFacade` coordena três serviços e devolve os dados em uma estrutura consolidada, enquanto `main.py` interage com a fachada, sem importar diretamente os subsistemas.

As explicações foram confrontadas com os arquivos de código, com os testes automatizados e com a execução da demonstração. Essa verificação é necessária para distinguir as características gerais do padrão do comportamento que está efetivamente implementado. Sugestões que não correspondam ao código ou que apresentem como real uma funcionalidade apenas hipotética não devem ser incorporadas como fatos.

## Pontos de Vista dos Integrantes

### Isaac Menezes Pereira

**Lições aprendidas**

Com o padrão Facade, consegui compreender melhor como uma única classe pode centralizar o acesso a diferentes serviços, simplificando o código que utiliza esses componentes. Também percebi como a separação de responsabilidades facilita a organização e a manutenção do sistema. Apesar de ser um exemplo simples, a implementação em Python ajudou a entender como o padrão pode ser aplicado na prática e como poderia ser adaptado para um sistema real.

**Uso da IA Generativa e senso crítico**

A inteligência artificial foi útil para esclarecer dúvidas sobre o funcionamento do padrão Facade e auxiliar na organização da documentação. Entretanto, percebi a importância de conferir se as respostas realmente correspondem ao código desenvolvido, pois sugestões geradas podem misturar conceitos ou apresentar informações que não se aplicam à implementação. Por isso, considero importante analisar as soluções propostas, compará-las com os arquivos do projeto e compreender o que está sendo feito, em vez de aceitar as respostas automaticamente. Dessa forma, a IA serve como uma ferramenta de apoio ao aprendizado, sem substituir o estudo e a análise crítica.

### Pablo Rodrigues Lima

**Lições aprendidas**

Com o padrão Facade, eu entendi como a centralização do acesso a diferentes serviços pode simplificar a relação entre os componentes e tornar o código mais organizado e facil de fazer a manutenção. Também pude analisar o codigo  mais uma vez e praticar como identificar corretamente as responsabilidades de cada classe, evitando adicionar complexidade desnecessária ao sistema.

**Uso da IA Generativa e senso crítico**

O uso da inteligência artificial se mostro ser útil mais uma vez. Tanto para auxiliar no desenvolvimento do projeto quanto para tirar dúvidas, mas também é importante avaliar as respostas geradas, normalmente prefiro entrar diretamente no site que a IA usou para gerar a resposta. Não apenas para verificar a veracidade da resposta mas também para compreender as soluções propostas, aprendendo muito mais sobre o assunto e evitando sugestões automaticamente, garantindo que o uso da IA não vai atrasar o meu aprendizado.

### Pedro Ramos Sousa Reis

**Lições aprendidas**

O trabalho com o padrão Facade ajudou a compreender como uma interface de alto nível pode coordenar subsistemas e entregar seus resultados ao cliente sem exigir que ele conheça os detalhes de cada serviço.

Também aprendi a diferença entre o Facade e outros tipos de padrões GoF. Por ser estrutural, organiza a relação entre o cliente e os subsistemas e não tem como objetivo principal criar ou configurar objetos, como acontece em padrões criacionais.

**Uso da IA Generativa e senso crítico**

Utilizei a IA Generativa como apoio para organizar e revisar a documentação sobre o padrão Facade, incluindo a explicação das responsabilidades da fachada, dos subsistemas e do cliente. As sugestões foram comparadas com os arquivos da implementação e com os resultados da demonstração e dos testes, para evitar descrever comportamentos que não estão presentes no código.

A ferramenta pode produzir explicações genéricas ou confundir o objetivo de padrões diferentes. Por isso, as respostas foram tratadas como sugestões, e não como fonte definitiva. A escolha do padrão, a interpretação do código e a validação da solução permanecem sob responsabilidade do integrante.

## Análise Crítica do Uso de IA Generativa

A IA Generativa pode facilitar a organização da documentação e oferecer explicações iniciais sobre conceitos de projeto. No caso do Facade, esse apoio é útil para estruturar a descrição dos papéis da fachada, dos subsistemas e do cliente, mas não garante que o texto corresponda à implementação desenvolvida.

Uma resposta pode, por exemplo, atribuir à fachada funcionalidades não implementadas, como chamadas reais a banco de dados ou serviços externos. A implementação deste trabalho utiliza dados simulados; portanto, afirmações sobre integrações reais não seriam corretas. Também é necessário verificar se as descrições dos testes correspondem aos cenários efetivamente cobertos.

Assim, a IA foi considerada uma ferramenta auxiliar de redação e compreensão. A conferência do código e dos testes, a avaliação da adequação do padrão e a responsabilidade pelas decisões técnicas continuam sendo humanas.

## Evidências de Participação

| Integrante | Atividade/Contribuição | Evidência |
|---|---|---|
| [Isaac Menezes](https://github.com/pratamz250) | Elaboração inicial da documentação e da demonstração didática do padrão Facade. | [Padrões GoF estruturais](./padrões-gof-estruturais.md), [subsistemas](./src/subsistemas.py) e [fachada da tela inicial](./src/tela_inicial_facade.py). |
| [Pablo Rodrigues](https://github.com/Pablo-R-L) | Organização, elaboração e correção da documentação sobre o padrão Facade, o uso de IA Generativa e planejamento da implementação. | [Padrões GoF estruturais](./padrões-gof-estruturais.md), [modelagem](./modelagem.md), [Código](./código.md), [ia-generativa](./ia-generativa.md), [Execução](./execução.md) . |
| [Pedro Ramos](https://github.com/PedroRSR) | Organização da documentação técnica, descrição dos procedimentos de execução e criação dos testes automatizados. | [Código](./código.md), [execução](./execução.md), [IA Generativa](./ia-generativa.md), [modelagem](./modelagem.md) e [testes automatizados](./src/test_facade.py). |

## Evidências do Uso de IA Generativa

| Integrante | Ferramenta | Finalidade | Evidência |
|---|---|---|---|
| [Isaac Menezes](https://github.com/pratamz250) | ChatGPT | Auxílio na compreensão do padrão Facade | [Contribuição no repositório](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/f5f6df47536e2cae4499061fd2696128958a9b0c) |
| [Pablo Rodrigues](https://github.com/Pablo-R-L) | GPT e Copilot | Copreender o padrão Facade, tirar dúvidas e ter uma noção geral do que fazer no projeto. Apoio à redação e correção dentro da documentação | [Padrões GoF estruturais](./padrões-gof-estruturais.md), [modelagem](https://chatgpt.com/share/6ad52525-66c0-83ea-8e5f-4ad405f44e5d), [Execução](https://chatgpt.com/share/6ad524e3-b104-83e8-90fe-efb6787dcfea) |
| [Pedro Ramos](https://github.com/PedroRSR) | Assistente de IA no VS Code (Copilot) e Gemini | Apoio à organização, redação, revisão crítica da documentação e aprendizado sobre o padrão Facade. | 1. [test_facade.py](./src/test_facade.py), 2. [execução.md](./execução.md), 3. [ia-generativa.md](./ia-generativa.md) e 4. [modelagem.md](./modelagem.md) |

## Nível de Contribuição dos Integrantes

| Nome | % de Contribuição |
|:---|:---:|
| [Isaac Menezes](https://github.com/pratamz250) | 33,33% |
| [Pablo Rodrigues](https://github.com/Pablo-R-L) | 33,33% |
| [Pedro Ramos](https://github.com/PedroRSR) | 33,33% |

<p align="center">Tabela 1: Contribuição dos integrantes.</p>

## Referências

GAMMA, Erich; HELM, Richard; JOHNSON, Ralph; VLISSIDES, John. *Design Patterns: Elements of Reusable Object-Oriented Software*. Reading: Addison-Wesley, 1994.

REFACTORING.GURU. *Facade*. Disponível em: <https://refactoring.guru/pt-br/design-patterns/facade>. Acesso em: 16 out. 2026.

PYTHON SOFTWARE FOUNDATION. *unittest — Unit testing framework*. Disponível em: <https://docs.python.org/3/library/unittest.html>. Acesso em: 16 out. 2026.

## Histórico de Versões

| Versão | Data       | Descrição                                                                 | Autor(es) | Revisor(es) | Detalhe da Revisão |
|:------:|:----------:|---------------------------------------------------------------------------|-----------|:-----------:|--------------------|
| 1.0 | 16/10/2026 | Elaboração da documentação sobre o uso de IA Generativa na aplicação do padrão Facade. | [Pedro Ramos](https://github.com/PedroRSR) | [Pablo Rodrigues](https://github.com/Pablo-R-L) | Organização do objetivo, da metodologia, do ponto de vista individual, da análise crítica e das evidências. |
| 1.1 | 16/10/2026 | Complementação da documentação sobre o uso de IA Generativa. | [Pedro Ramos](https://github.com/PedroRSR) | Preencher | Preencher |
| 1.2 | 16/10/2026 | Adição do meu ponto de vista e senso crítico. | [Pablo Rodrigues](https://github.com/Pablo-R-L) | Preencher | Preencher |
| 1.3 | 16/10/2026 | Minhas impressões sobre IA Generativa | [Isaac Menezes](https://github.com/pratamz250) | [Pedro Ramos](https://github.com/PedroRSR) | Adição do ponto de vista de Isaac sobre IA Generativa. |
| 1.4 | 18/10/2026 | Preenchimento da tabela sobre evidência de uso de IA Generativa | [Pedro Ramos](https://github.com/PedroRSR) | [Pablo Rodrigues](https://github.com/Pablo-R-L) | Adição das evidencias sobre onde IA generativa foi usada |
| 1.5 | 18/10/2026 | Preenchimento da tabela sobre evidência de uso de IA Generativa | [Pablo Rodrigues](https://github.com/Pablo-R-L) | [Pedro Ramos](https://github.com/PedroRSR) | Adição das evidencias sobre onde IA generativa foi usada |
| 1.6 | 18/10/2026 | Preenchimento da tabela sobre participações | [Pedro Ramos](https://github.com/PedroRSR) | Preencher | Preencher |

<p align="center">Tabela 2: Histórico de Versões.</p>