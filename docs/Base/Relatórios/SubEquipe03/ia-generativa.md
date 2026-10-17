# 5. IA Generativa

## Descrição

Registro do uso de IA Generativa pela SubEquipe_03 no **FOCO_03 — GoFs Comportamentais & IA Generativa**. O documento reúne os pontos de vista dos integrantes sobre as lições aprendidas durante a entrega e apresenta uma análise crítica sobre o uso de ferramentas de IA Generativa no estudo, na modelagem e na documentação do padrão Observer.

## Objetivo

Registrar as experiências dos integrantes da SubEquipe_03 com o uso de IA Generativa durante a realização das atividades da entrega, destacando as principais lições aprendidas, as contribuições da ferramenta e as limitações identificadas ao longo do processo.

A análise busca evidenciar o uso consciente e crítico da IA Generativa, considerando a necessidade de validação das informações produzidas pela ferramenta com base nos conhecimentos adquiridos, na documentação do projeto e na literatura utilizada pela equipe.

**Todos os integrantes da SubEquipe_03 devem participar.**

## Metodologia

Cada integrante registra, em uma seção própria, suas principais lições aprendidas e uma descrição crítica de como a IA Generativa foi utilizada nas atividades sob sua responsabilidade. Quando utilizada, a ferramenta foi empregada como apoio à compreensão de conceitos, à elaboração de ideias, à revisão ou ao desenvolvimento das atividades, sem substituir a análise e a validação realizadas pelos integrantes da equipe.

As informações e sugestões obtidas por meio da IA Generativa foram analisadas e validadas antes de serem incorporadas à documentação ou aos artefatos do projeto.

## Pontos de Vista dos Integrantes

### Caio Alexandre Ornelas Silva

**Lições aprendidas**

O estudo do Observer mostrou que o valor do padrão não está na estrutura em si, que é simples, mas no problema de acoplamento que ele resolve. Esse problema só ficou evidente ao revisitar os diagramas da Entrega 02, em que o serviço de conteúdos chamava diretamente o serviço de TabCoins. Partir de um artefato já produzido pela equipe, em vez de um exemplo genérico, tornou a justificativa do padrão concreta e rastreável.

A comparação com o código do jogo multiplayer de Filipe Deschamps evidenciou a diferença entre a estrutura canônica do GoF e uma implementação idiomática em JavaScript, na qual os observadores são simples funções. Compreendi que a escolha entre classes e funções não é uma questão de correção, mas de objetivo: a versão com classes foi preferida por tornar cada participante visível no diagrama UML, ainda que a versão com funções seja mais enxuta. Da mesma forma, a ausência de interfaces no JavaScript exigiu decidir explicitamente como garantir o contrato do observador.

Também aprendi que decisões aparentemente secundárias, como o modelo *push* ou *pull*, o isolamento de falhas entre observadores e a desinscrição, são as que distinguem uma aplicação refletida do padrão de uma reprodução do diagrama do livro.

**Uso da IA Generativa e senso crítico**

A IA Generativa foi utilizada com a finalidade de acelerar o desenvolvimento do trabalho, apoiando o levantamento das pendências da entrega, a elaboração dos diagramas UML em PlantUML, a redação da documentação e a automação do versionamento.

As decisões de projeto permaneceram sob responsabilidade do integrante e da equipe. A escolha do padrão Observer foi feita pelo grupo antes do uso da ferramenta. Quando a IA apresentou alternativas, como representar o observador por uma classe base ou por um contrato por convenção, a decisão foi tomada pelo integrante a partir dos prós e contras apresentados. A ferramenta também foi questionada sobre a própria modelagem que havia produzido, o que resultou em ajustes depois que a introdução do documento passou a citar a implementação de referência.

O uso evidenciou limitações que exigiram revisão humana:

- **Erros não percebidos pela ferramenta.** Os links internos gerados entre as páginas utilizavam caminhos relativos, que o Docsify resolve a partir da raiz do site, o que os tornava quebrados. O problema foi identificado pelo integrante, e não pela ferramenta.
- **Conteúdo além do pedido.** A primeira versão da introdução reapresentava o TabNews do zero, embora a plataforma já tivesse sido apresentada em entregas anteriores, e foi enxugada a pedido do integrante.
- **Proposições que dependem da equipe.** Algumas regras da modelagem (RN04 e RN06) e a comparação com os padrões descartados foram propostas pela ferramenta e registradas como pendentes de validação pelo grupo, para que não fossem apresentadas como decisões coletivas que não ocorreram.
- **Limites de verificação.** A ferramenta não assistiu aos vídeos da série *Primeiro Jogo Multiplayer*. Por isso, a afirmação de que Filipe Deschamps utilizou o Observer foi verificada diretamente no código-fonte publicado do jogo, e o texto não indica em qual vídeo específico o padrão é apresentado.

Os diagramas foram verificados quanto à sintaxe e conferidos visualmente após a renderização, antes de serem incorporados à documentação, e o conteúdo de cada commit foi revisado antes de ser registrado.


### Guilherme Moura da Silva Neto

**Lições aprendidas**

Com a expansão da implementação do padrão Observer, compreendi na prática como ele resolve problemas de acoplamento. A adição do log de auditoria (RegistroDeAtividades) e dos fluxos de moderação evidenciou o Princípio Aberto/Fechado (OCP), pois foi possível criar novas reações a eventos sem precisar modificar o serviço central de conteúdos.

Também percebi a importância de aliar a teoria a uma boa documentação de execução e testes. Acompanhar os logs no terminal e comprovar o isolamento de falhas demonstrou como o desacoplamento impede que erros em reações secundárias interrompam o fluxo principal do sistema.


**Uso da IA Generativa e senso crítico**

Utilizei a IA Generativa como apoio para formatar a documentação em Markdown, alterar os diagramas em PlantUML e estruturar o boilerplate dos testes automatizados. As respostas ajudaram a acelerar o trabalho braçal, mas exigiram revisão atenta para não comprometer a arquitetura definida pela equipe.

A ferramenta frequentemente sugeria o uso de outras bibliotecas de teste ou alterava regras de negócio. Foi necessário intervir, corrigir as lógicas para o framework correto e garantir a coerência com a modelagem do Fórum. Isso reforçou que a IA é excelente para organizar e acelerar o desenvolvimento, mas a validação e as decisões técnicas devem permanecer inteiramente com o desenvolvedor. 

### Leonardo Fachinello Bonetti

**Lições aprendidas**

PREENCHER

**Uso da IA Generativa e senso crítico**

PREENCHER

## Análise Crítica do Uso de IA Generativa

*Seção a ser consolidada pela SubEquipe_03 a partir dos pontos de vista individuais, reunindo as contribuições e as limitações observadas no uso de IA Generativa durante a entrega.*

## Evidências de Participação

| Integrante | Atividade/Contribuição | Evidência |
|:---|:---|:---|
| [Caio Alexandre](https://github.com/bitterteriyaki) | Modelagem UML do padrão Observer, documento de Padrões GoF Comportamentais, iniciativas extras de suporte a PlantUML e padronização do ambiente local, e registro do uso de IA Generativa. | [Modelagem](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/9358072fb7ae404b92850deefcd7204ae53b467a) · [Padrões Comportamentais](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/fd46c42a4220ac56a7f2ec7f9aeaee8f0a670089) · [PlantUML](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/2db3b5efbe0a4b78c20dbf7f07a1128a36b97468) · [mise](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/f9884403eaf8943188a1f2afacc2e3925dcaddf9) |
| [Leonardo Bonetti](https://github.com/LeoFacB) | Implementação do padrão Observer (classes, demonstração e testes automatizados), revisão da modelagem e da rastreabilidade com a Entrega 02, seção de Metodologia e registro do uso de IA Generativa. | [PR #14 — Implementação](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/pull/14) · [Sujeito](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/7ccde94c38a4efd24295aa3bb2d38cec6ae4aa36) · [Testes](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/d5fa8ad5e4124cdb0c5c6a5712c7c45073a729b6) · PR da documentação: INSERIR LINK |


<p align="center">Tabela 1: Evidências de participação dos integrantes.</p>

## Evidências do Uso de IA Generativa

| Integrante | Ferramenta | Finalidade | Evidência |
|:---|:---|:---|:---|
| Caio Alexandre Ornelas Silva | Claude (Claude Code) | Levantamento das pendências da entrega, elaboração dos diagramas UML em PlantUML, redação da documentação do padrão Observer e automação do versionamento (organização dos commits e redação das mensagens). | [Histórico de commits](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commits/main?author=bitterteriyaki) |
| [Guilherme Moura](github.com/Guilherme-Moura) | Gemini | Apoio na formatação da documentação, realização de ajustes nos diagramas UML via PlantUML e geração de boilerplate para a suíte de testes automatizados. | |
| [Leonardo Bonetti](https://github.com/LeoFacB) | Claude (Claude Code) | Apoio na implementação das classes e dos testes a partir do Diagrama de Classes, na conferência da consistência entre diagramas, código e documentação, na redação das páginas e na organização dos commits. | [PR #14 — Implementação](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/pull/14) · PR da documentação: INSERIR LINK |

<p align="center">Tabela 2: Evidências do uso de IA Generativa.</p>

## Referências

ANTHROPIC. **Claude Code overview**. Claude Code Docs. Disponível em: [https://code.claude.com/docs/en/overview](https://code.claude.com/docs/en/overview). Acesso em: 14 out. 2026.

GOOGLE. **Gemini**. Disponível em: [https://gemini.google.com/](https://gemini.google.com/). Acesso em: 17 out. 2026.

NODE.JS. **Node.js Documentation**. Disponível em: [https://nodejs.org/docs/latest/api/](https://nodejs.org/docs/latest/api/). Acesso em: 17 out. 2026.

NODE.JS. **Test runner (node:test)**. Node.js Documentation. Disponível em: [https://nodejs.org/api/test.html](https://nodejs.org/api/test.html). Acesso em: 17 out. 2026.

PLANTUML. **PlantUML**. Disponível em: [https://plantuml.com/](https://plantuml.com/). Acesso em: 14 out. 2026.

## Histórico de Versões

| Versão | Data | Descrição | Autor(es) | Revisor(es) | Detalhe da Revisão |
|:------:|:----:|:----------|:----------|:------------|:-------------------|
| 1.0 | 14/10/2026 | Criação do documento de IA Generativa da SubEquipe_03 e registro da experiência individual do integrante. | [Caio Alexandre](https://github.com/bitterteriyaki) |  | Estrutura baseada no documento de IA Generativa da Entrega 02, com seções individuais por integrante e tabelas de evidências. |
| 1.1 | 14/10/2026 | Inclusão da seção de referências. | [Caio Alexandre](https://github.com/bitterteriyaki) |  | Criação da seção de referências, com a documentação do Claude Code, ferramenta de IA Generativa utilizada, e do PlantUML, ferramenta utilizada na elaboração dos diagramas. |
| 1.2 | 16/10/2026 | Adição do ponto de vista | [Guilherme Moura](github.com/Guilherme-Moura) |  | |
| 1.3 | 17/10/2026 | Seção e evidências do Leonardo. | [Leonardo Bonetti](https://github.com/LeoFacB) |  | Seção do Leonardo (a preencher por ele), linhas dele nas Tabelas 1 e 2 e inclusão do Gemini, do Node.js e do `node:test` nas referências. |

<p align="center">Tabela 3: Histórico de Versões.</p>

Ver também: [Padrões GoF Comportamentais](/Base/Relatórios/SubEquipe03/padrões-gof-comportamentais.md) · [Modelagem](/Base/Relatórios/SubEquipe03/modelagem.md)
