# 5. IA Generativa

## Descrição

Registro do uso de IA Generativa pela SubEquipe 01 durante o desenvolvimento da Entrega 03, com foco na aplicação do padrão GoF Builder na construção de publicações de fórum.

O documento apresenta a experiência individual de Arthur Fernandes, as contribuições da IA para a compreensão do padrão e a organização da implementação, além da análise crítica sobre a necessidade de verificar as sugestões produzidas pela ferramenta.

## Objetivo

Registrar a utilização da IA Generativa como ferramenta de apoio às atividades da SubEquipe 01, considerando:

- a compreensão do padrão GoF Builder;
- a organização da implementação em JavaScript;
- a identificação de validações necessárias para a construção de publicações;
- o planejamento de testes automatizados;
- a elaboração e revisão da documentação;
- a análise crítica das sugestões fornecidas pela ferramenta.

A utilização da IA tem como finalidade apoiar o desenvolvimento e o aprendizado, sem substituir as decisões técnicas, a compreensão do código ou a responsabilidade do integrante pela solução produzida.

## Metodologia

A IA Generativa foi utilizada como apoio à organização das informações e à elaboração da documentação referente ao padrão Builder.

A implementação considerada utiliza a classe `Publicacao` para representar uma publicação de fórum e a classe `PublicacaoBuilder` para configurar seus atributos antes da construção do objeto.

O processo de documentação foi organizado de forma a explicar o propósito do padrão, as responsabilidades dos componentes e os critérios que devem ser considerados na avaliação da implementação.

As sugestões da ferramenta devem ser confrontadas com o código desenvolvido e com os conceitos estudados na disciplina. A execução do programa e dos testes é necessária para confirmar o comportamento da solução.

## Pontos de Vista dos Integrantes

### Arthur Fernandes

**Lições aprendidas**

Durante a elaboração da Entrega 03, utilizei o ChatGPT como apoio à organização da documentação e à compreensão dos aspectos relacionados ao padrão GoF Builder. A ferramenta auxiliou na estruturação dos tópicos e na explicação das responsabilidades dos componentes envolvidos na construção de publicações de fórum.

Uma das principais lições aprendidas foi a importância de relacionar a explicação teórica do padrão à implementação proposta. A documentação precisa apresentar não apenas o conceito do Builder, mas também explicar como ele é aplicado ao objeto `Publicacao` e qual é a responsabilidade da classe `PublicacaoBuilder`.

**Uso da IA Generativa e senso crítico**

Utilizei o ChatGPT como apoio à elaboração e à revisão do conteúdo sobre o padrão Builder, à organização das informações técnicas e à estruturação da análise crítica da implementação.

As respostas foram utilizadas como apoio para organizar as explicações sobre a construção de objetos, as validações dos atributos e os testes previstos. Foi necessário manter atenção à diferença entre uma sugestão apresentada pela ferramenta e uma funcionalidade efetivamente implementada no código.

A experiência reforçou que a IA Generativa pode facilitar a organização das atividades e a compreensão dos conceitos, mas suas respostas precisam ser analisadas antes de serem incorporadas à documentação. A responsabilidade pelas decisões técnicas e pela verificação da implementação permanece com o integrante.

## Lições aprendidas

Durante a elaboração da Entrega 03, utilizei o ChatGPT como apoio ao desenvolvimento do código complementar do padrão GoF Builder, relacionado ao cadastro de usuários. A ferramenta auxiliou na organização das classes `Usuario` e `CadastroUsuarioBuilder`, na implementação dos métodos de construção e na validação dos campos obrigatórios.

Uma das principais lições aprendidas foi compreender melhor como o padrão Builder permite construir objetos de forma gradual e organizada, separando as responsabilidades entre o objeto final e seu processo de construção.

### Giovana Fontes 

## Uso da IA Generativa e senso crítico

Utilizei o ChatGPT como apoio à implementação do código, à compreensão dos conceitos do padrão Builder e à revisão da documentação. As sugestões fornecidas foram analisadas para verificar sua adequação à proposta da atividade e à implementação realizada.

A experiência reforçou que a IA Generativa pode facilitar o desenvolvimento e o aprendizado, mas suas respostas precisam ser avaliadas criticamente. É importante conferir o código, compreender as soluções propostas e garantir que a documentação corresponda ao que foi efetivamente implementado.

**Link do chat com IA:** [ChatGPT — apoio ao desenvolvimento da Entrega 03](https://chatgpt.com/share/6ad265c4-4bb8-83ea-9326-b3c0554cd62c)

### João Pedro S. Maciel

**Lições aprendidas**

Durante a Entrega 03, utilizei o Claude para apoiar a elaboração de conteúdos complementares sobre padrões criacionais: um complemento com os padrões Factory Method, Prototype e Singleton, uma contribuição de revisão para a modelagem do Builder e a redação.

A principal lição foi perceber que os diagramas são parte da evidência, isto é, uma modelagem escrita sem vê-los pode descrever componentes que não correspondem ao que a equipe produziu.

Outra lição foi que um exemplo executável vale mais do que uma descrição. Os exemplos que escrevi foram acompanhados de testes com `node --test`, o que permitiu confirmar o comportamento das classes e encontrar um defeito visual nos diagramas de atividades, que foi corrigido antes da entrega.

**Uso da IA Generativa e senso crítico**

O Claude foi utilizado para sugerir a estrutura dos complementos, escrever os exemplos em JavaScript e revisar a redação dos documentos.

As respostas foram verificadas antes de serem incorporadas. Os exemplos foram executados e testados, e os diagramas foram renderizados e conferidos visualmente. Também foram verificadas as inconsistências dos textos da equipe, como um título em branco na seção de padrões criacionais e numeração repetida na modelagem, que foram apontadas para revisão e não alteradas sem autorização.

Houve também um cuidado específico com o conteúdo. Ao propor um exemplo de Prototype, a ferramenta observou que o clone não deveria ser usado para republicar conteúdo mal avaliado, porque isso configuraria manipulação de qualificações segundo a FAQ do TabNews. A observação foi incorporada à documentação como uma limitação do uso do padrão.

Por fim, a experiência mostrou que a IA acelera o levantamento, a estruturação e a revisão, mas as decisões de modelagem, a escolha dos padrões e a validação técnica permanecem sob responsabilidade do integrante.


## Análise Crítica do Uso de IA Generativa

A utilização do ChatGPT contribuiu para organizar a documentação da aplicação do padrão Builder e estruturar a explicação dos componentes envolvidos na construção de publicações de fórum.

Entretanto, respostas geradas por IA podem apresentar informações genéricas ou descrever comportamentos que ainda não foram implementados. Por isso, é necessário verificar se as explicações correspondem às responsabilidades reais das classes e aos comportamentos previstos no código.

No contexto da atividade, a análise deve considerar a separação entre a representação da publicação e o processo de construção do objeto, as validações dos atributos obrigatórios e o tratamento das tags.

A IA Generativa foi utilizada como ferramenta de apoio à documentação e à compreensão técnica. A avaliação da adequação do padrão, das decisões de implementação e dos resultados dos testes deve permanecer sob responsabilidade dos integrantes.

## Evidências de Participação

| Integrante | Atividade/Contribuição | Evidência |
|---|---|---|
| [Arthur Fernandes](https://github.com/arthurfernandesj) | Organização e elaboração da documentação sobre a aplicação do padrão Builder e o uso de IA Generativa. | [2. Modelagem](https://unbarqdsw2026-2-turma01.github.io/RepositorioTemplateEntrega3-TabNews-Forum/#/Base/Relat%C3%B3rios/SubEquipe01/modelagem), [3. Código](https://unbarqdsw2026-2-turma01.github.io/RepositorioTemplateEntrega3-TabNews-Forum/#/Base/Relat%C3%B3rios/SubEquipe01/c%C3%B3digo), [4. Execução](https://unbarqdsw2026-2-turma01.github.io/RepositorioTemplateEntrega3-TabNews-Forum/#/Base/Relat%C3%B3rios/SubEquipe01/execu%C3%A7%C3%A3o) |
| [Giovana Fontes](https://github.com/GiovanaFontesS) | Organização e elaboração da documentação sobre a aplicação do padrão Builder e o uso de IA Generativa. | [3. Código](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/6f64f4c8e143e030d85d3e8368cdb0dd18be01c8), [2. Modelagem](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/aba395e772011b68e7d4478dc24dcda69e2ca674), [Commit 3](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/7e70047c994ccf7f04c338a0045d634e0f0ba183), [4. Execução](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/ac8b0f99ea31eaf4c21173ad4bcfefcdecaeda43) |
| [João Pedro](https://github.com/jopesmp) | Organização e elaboração da documentação sobre a aplicação do padrão Builder e o uso de IA Generativa. | [2. Modelagem](https://unbarqdsw2026-2-turma01.github.io/RepositorioTemplateEntrega3-TabNews-Forum/#/Base/Relat%C3%B3rios/SubEquipe01/modelagem), [3. Código](https://unbarqdsw2026-2-turma01.github.io/RepositorioTemplateEntrega3-TabNews-Forum/#/Base/Relat%C3%B3rios/SubEquipe01/c%C3%B3digo), [4. Execução](https://unbarqdsw2026-2-turma01.github.io/RepositorioTemplateEntrega3-TabNews-Forum/#/Base/Relat%C3%B3rios/SubEquipe01/execu%C3%A7%C3%A3o) |

## Evidências do Uso de IA Generativa 

| Integrante | Ferramenta | Finalidade | Evidência |
|---|---|---|---|
| Arthur Fernandes | ChatGPT | Apoio à compreensão do padrão Builder, à organização da documentação e à estruturação da análise crítica da implementação. | [2. Modelagem](http://localhost:3000/#/Base/Relatórios/SubEquipe01/modelagem), [3. Código](http://localhost:3000/#/Base/Relatórios/SubEquipe01/código), [4. Execução](http://localhost:3000/#/Base/Relatórios/SubEquipe01/execução) |
| [Giovana Fontes](https://github.com/GiovanaFontesS) | ChatGPT e Gemini | Apoio à compreensão do padrão Builder, à organização da documentação e à estruturação da análise crítica da implementação. | [2. Modelagem](https://chatgpt.com/share/6ad265ba-d844-83e8-8df6-7e04c3a4e1a4), [3. Código](https://chatgpt.com/share/6ad265ba-d844-83e8-8df6-7e04c3a4e1a4), [4. Execução](https://share.gemini.google/ynihgf4f7Qt7), [Análise crítica](https://share.gemini.google/ynihgf4f7Qt7) |
| [João Pedro](https://github.com/jopesmp) | Claude | Sugestão de estrutura, apoio à organização da documentação e a análise crítica da implementação. | [2. Modelagem](http://localhost:3000/#/Base/Relatórios/SubEquipe01/modelagem), [3. Código](http://localhost:3000/#/Base/Relatórios/SubEquipe01/código), [4. Execução](http://localhost:3000/#/Base/Relatórios/SubEquipe01/execução) |

## Nível de Contribuição dos Integrantes

| Nome | % de Contribuição |
|:---|:---:|
| [Arthur Fernandes](https://github.com/arthurfernandesj) | 33,33% |
| [Giovana Fontes](https://github.com/GiovanaFontesS) | 33,33% |
| [João Pedro S. Maciel](https://github.com/jopesmp) | 33,33% |

<p align="center">Tabela 1: Contribuição dos integrantes.</p>

## Referências

GAMMA, Erich; HELM, Richard; JOHNSON, Ralph; VLISSIDES, John. Design Patterns: Elements of Reusable Object-Oriented Software. Reading: Addison-Wesley, 1994.

OPENAI. ChatGPT: visão geral. Disponível em: https://openai.com/chatgpt/overview/.

NODE.JS. Test runner. Disponível em: https://nodejs.org/api/test.html.


## Histórico de Versões

| Versão | Data       | Descrição                                                                 | Autor(es) | Revisor(es) | Detalhe da Revisão |
|:------:|:----------:|---------------------------------------------------------------------------|-----------|:-----------:|--------------------|
| 1.0    | 14/10/2026 | Elaboração da documentação sobre o uso de IA Generativa na aplicação do padrão Builder. | [Arthur Fernandes](https://github.com/arthurfernandesj) | [Giovana Fontes](https://github.com/GiovanaFontesS) | Organização do objetivo, metodologia, ponto de vista individual, análise crítica, evidências e nível de contribuição dos integrantes. |
| 1.1    | 14/10/2026 | Complementação da documentação sobre o uso de IA Generativa. | [João Pedro](https://github.com/jopesmp) |  [Arthur Fernandes](https://github.com/arthurfernandesj) | [Giovana Fontes](https://github.com/GiovanaFontesS)  |  Ponto de vista individual e análise crítica. |
| 1.2 | 16/10/2026 | Adição de texto sobre uso de IA generativa | [Giovana Fontes](https://github.com/GiovanaFontesS) |  [João Pedro](https://github.com/jopesmp) | Ponto de vista e analise critica sobre a IA nos documentos realizados, e adição de contribuição da equipe | 


<p align="center">Tabela 2: Histórico de Versões.</p>
