# 3. Código

Esta seção apresenta a implementação do padrão de projeto GoF Facade (*Fachada*), utilizado para simplificar o acesso a diferentes subsistemas por meio de uma interface unificada. O exemplo foi desenvolvido em Python, sem dependências externas, com o objetivo de demonstrar a aplicação do padrão no contexto da tela inicial de um fórum inspirado no TabNews.

A implementação é didática e independente do sistema real do Projeto Fórum. Os serviços simulam a obtenção de publicações relevantes, publicações recentes e estatísticas do sistema. Não há integração real com o TabNews, persistência em banco de dados ou comunicação com serviços externos.

## 1. Organização dos arquivos

A estrutura do projeto está organizada da seguinte forma:

```text
src/
├── main.py
├── subsistemas.py
└── tela_inicial_facade.py
```

- **`main.py`:** contém o programa de demonstração, responsável por instanciar a fachada, solicitar os dados e exibir as informações no terminal.
- **`subsistemas.py`:** define os serviços independentes utilizados pela aplicação: `ServicoPostagensRelevantes`, `ServicoPostagensRecentes` e `ServicoEstatisticas`.
- **`tela_inicial_facade.py`:** implementa a classe `TelaInicialFacade`, responsável por coordenar os serviços, consolidar os resultados e tratar exceções durante o carregamento dos dados.

Os três arquivos devem permanecer no mesmo diretório para que os imports relativos aos módulos locais funcionem conforme apresentados.

## 2. Arquivo `subsistemas.py`

O arquivo `subsistemas.py` contém os subsistemas utilizados pela fachada. Cada classe representa um serviço com responsabilidade específica, permitindo que suas operações sejam executadas independentemente.

### Classe `ServicoPostagensRelevantes`

A classe disponibiliza o método `buscar_relevantes()`, responsável por retornar uma lista simulada de publicações consideradas relevantes com base na quantidade de tabcoins.

Cada publicação é representada por um dicionário contendo identificador, título, quantidade de tabcoins e autor.

### Classe `ServicoPostagensRecentes`

A classe disponibiliza o método `buscar_recentes()`, responsável por retornar uma lista simulada de publicações recentes. No exemplo, os dados são definidos diretamente no código, sem consulta a um banco de dados ou ordenação efetiva por data.

### Classe `ServicoEstatisticas`

A classe disponibiliza o método `obter_status_sistema()`, responsável por retornar um dicionário com informações estatísticas, incluindo a quantidade de usuários online e o número de publicações realizadas no dia.

As três classes simulam operações que, em um sistema real, poderiam envolver consultas ao banco de dados, leitura de cache ou acesso a serviços de monitoramento.

## 3. Classe `TelaInicialFacade`

A classe `TelaInicialFacade`, definida em `tela_inicial_facade.py`, constitui o elemento central da implementação do padrão Facade.

Seu construtor instancia os três serviços necessários para carregar as informações da tela inicial:

- `ServicoPostagensRelevantes`;
- `ServicoPostagensRecentes`;
- `ServicoEstatisticas`.

O método `carregar_dados()` coordena a execução dos serviços, obtendo as publicações relevantes, as publicações recentes e as estatísticas do sistema. Em seguida, consolida os resultados em um único dicionário, organizado em três categorias: `feed_relevante`, `feed_recente` e `informacoes_rodape`.

Quando a operação é concluída com sucesso, o método retorna uma estrutura contendo a chave `sucesso`, com valor `True`, e a chave `dados`, com os resultados consolidados.

Caso uma exceção ocorra durante a execução das operações, o método captura o erro e retorna uma estrutura com `sucesso` igual a `False` e uma mensagem descritiva na chave `erro`.

Dessa forma, a fachada oferece uma interface simplificada para o cliente, que não precisa conhecer os detalhes de instanciação e utilização de cada subsistema.

## 4. Programa de demonstração

O arquivo `main.py` apresenta o funcionamento da implementação por meio de uma execução no terminal.

A função `renderizar_tela_inicial()` instancia a classe `TelaInicialFacade` e chama seu método `carregar_dados()`. Em seguida, verifica o resultado da operação.

Quando o carregamento é bem-sucedido, o programa percorre a lista de publicações relevantes e exibe seus títulos e quantidades de tabcoins. Depois, apresenta as publicações recentes com seus respectivos autores e informa a quantidade de usuários online.

Caso ocorra uma falha, o programa exibe a mensagem de erro retornada pela fachada.

O bloco `if __name__ == "__main__":` garante que a função de demonstração seja chamada quando o arquivo `main.py` for executado diretamente.

## 5. Testes automatizados

Os arquivos fornecidos não incluem uma suíte de testes automatizados. Portanto, a implementação apresentada demonstra o funcionamento do padrão Facade, mas não comprova, por si só, a execução de testes automatizados.

Como verificação inicial, é possível executar o programa e conferir se as informações esperadas são exibidas no terminal.

Para ampliar a cobertura de testes, recomenda-se verificar:

- Se `carregar_dados()` retorna `sucesso` igual a `True` quando todos os serviços funcionam corretamente.
- Se os dados consolidados contêm as chaves `feed_relevante`, `feed_recente` e `informacoes_rodape`.
- Se a fachada trata adequadamente exceções lançadas pelos serviços.
- Se a função de demonstração exibe as informações retornadas pela fachada.

Esses testes podem ser implementados com a biblioteca padrão `unittest`, sem a necessidade de instalar dependências externas. Sua realização e seus resultados devem ser registrados antes de serem apresentados como evidências da entrega.

## 6. Configuração do projeto

A implementação utiliza Python 3 e recursos da biblioteca padrão da linguagem. Não são necessárias bibliotecas externas para executar o exemplo.

Para verificar a instalação do interpretador, execute:

```bash
python3 --version
```

## 7. Execução do programa

Para executar o exemplo, é necessário abrir um terminal no diretório que contém os arquivos `main.py`, `subsistemas.py` e `tela_inicial_facade.py`.

Execute o seguinte comando:

```bash
python3 src/main.py
```

Considerando os dados fixos definidos em `subsistemas.py`, a saída esperada é:

```text
Iniciando o carregamento da Tela Inicial (TabNews)...

=== CONTEÚDO RELEVANTE ===
- O que são Padrões de Projeto? (45 tabcoins)
- Dicas de Python para iniciantes (32 tabcoins)

=== CONTEÚDO RECENTE ===
- Nova atualização do framework (por usuario_c)

[Status: 142 usuários online agora]
```

A saída é determinística porque os serviços retornam dados definidos diretamente no código.

A execução deve ser registrada com evidências reais, como capturas de tela do terminal, mostrando o resultado do programa. 

## 8. Considerações sobre a implementação

A implementação evidencia a finalidade do padrão Facade ao disponibilizar uma interface única para acessar funcionalidades distribuídas entre diferentes subsistemas.

Sem a utilização da fachada, o código cliente teria que criar instâncias dos três serviços, executar seus métodos separadamente e reunir os dados retornados. Ao utilizar a classe TelaInicialFacade, essas responsabilidades são concentradas no método carregar_dados(), tornando o código cliente mais simples e diminuindo sua dependência dos detalhes de funcionamento dos serviços internos.

Dessa forma, a implementação destaca benefícios como a diminuição do acoplamento entre o cliente e os subsistemas, a centralização das operações de carregamento e a consolidação dos resultados em uma única estrutura de dados.

A implementação também apresenta limitações didáticas. Os serviços retornam dados fixos, não há integração com sistemas externos e o tratamento de exceções não registra os detalhes técnicos do erro. Além disso, a estatística `publicacoes_hoje` é retornada pela fachada, mas não é exibida pelo programa de demonstração.

Em uma aplicação real, os serviços poderiam ser integrados a fontes de dados efetivas, enquanto a fachada permaneceria responsável por coordenar as operações necessárias à montagem da tela inicial.

## 9. Pontos de Vista dos Integrantes

### Isaac Menezes Pereira

O padrão Facade oferece uma ótima solução que visa aumentar a organização e diminuir a complexidade do sistema e seus subsistemas. Com o padrão, cada subfuncionalidade sabe onde encontrar suas funções de forma a padronizar suas fontes. Apesar de correr o risco de tornar o Fachada um God Object, é possível manter o sistema organizado com suas devidas funções usando o Fachada. Além disso, a manutenção do código fica simplificada porque as demais alterações afetam apenas o Fachada e não os usuários.

### Pablo Rodrigues Lima

O padrão Facade foi escolhido por considerarmos que ele se encaixa bem na estrutura de uma tela inicial, permitindo centralizar o acesso às funcionalidades dos subsistemas. Ao implementar, tentamos manter o código fiel ao original mas ao mesmo tempo simples e objetivo, evitando adicionar complexidade desnecessária para não desviar o foco do projeto. Durante o projeto percebos o quão prático e eficiente é utilizar este padrão. 

### Pedro Ramos Sousa Reis

Escolhemos o padrão Facade por ele simplificar a comunicação do cliente com os subsistemas, abstraindo a complexidade interna. No contexto da tela inicial do fórum, o Facade garante que o código principal solicite os dados e já receba o payload consolidado. Isso melhora a leitura do código e reduz o acoplamento da interface com os serviços da página. Além disso, a gente consegue padronizar o carregamento num lugar só. O único problema é deixar essa fachada acumulando responsabilidade demais e complicando a manutenção.

## 10. Participação e Evidências

Esta seção registra as atividades relacionadas à implementação e à documentação do padrão Facade. As evidências devem corresponder aos arquivos desenvolvidos e aos resultados efetivamente obtidos.

### Isaac Menezes Pereira

**Atividades desenvolvidas:**

- Organização da implementação do padrão Facade.
- Descrição das responsabilidades dos subsistemas.
- Documentação dos métodos da classe `TelaInicialFacade`.
- Apresentação do programa de demonstração em `main.py`.
- Descrição dos procedimentos para execução do programa.
- Organização das informações técnicas sobre a consolidação dos dados e o tratamento de exceções.

**Evidências relacionadas:**

| Evidência | Descrição |
|---|---|
| `src/subsistemas.py` | Implementação dos serviços de publicações relevantes, publicações recentes e estatísticas do sistema. |
| `src/tela_inicial_facade.py` | Implementação da fachada responsável por coordenar os subsistemas e consolidar os resultados. |
| `src/main.py` | Programa de demonstração do carregamento e da exibição das informações da tela inicial. |
| Capturas de tela do terminal | Evidências da execução do programa e, se aplicável, dos testes automatizados. |
| Histórico de commits | [Histórico de commits](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commits/main/?author=pratamz250). |

As evidências devem ser anexadas ou referenciadas no repositório conforme a organização definida pela equipe. A existência dos arquivos, a execução dos testes e os registros de contribuição devem ser verificados antes da entrega.

### Pablo Rodrigues Lima

**Atividades desenvolvidas:**

- Criação das classes ServicoPublicidade, ServicoUsuarios e ServicoAutorizacao em [subsistemas.py](src\subsistemas.py)
- Implementação das novas classes na classe de fachada [tela_inicial_facade.py](src\tela_inicial_facade.py)
- Adição de alguns detalhes em [main.py](src\main.py) para incorporar as novas classes

**Evidências relacionadas:**

| Evidência | Descrição |
|---|---|
| `src/subsistemas.py` | [Criação dos serviços de autorização, publicações e publicidades.](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/3eb6b9fa3a01a6b2206996c5c0550f84a34a819a) |
| `src/tela_inicial_facade.py` | [Implementação dos serviços de autorização e publicidade.](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/3eb6b9fa3a01a6b2206996c5c0550f84a34a819a) / [Implementação do serviço de usuario anonimo](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/2bf0654c86dbdcce88941a2b2661f6cff465991a) |
| `src/main.py` | [Inplementação de informações referente às classes de publicidade.](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/3eb6b9fa3a01a6b2206996c5c0550f84a34a819a) / [Implementação referente à classe de usuario](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/2bf0654c86dbdcce88941a2b2661f6cff465991a) |
| Histórico de commits geral | [Histórico de commits](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commits/main/?author=Pablo-R-L). |

### Pedro Ramos Sousa Reis

**Atividades desenvolvidas:**

- Organização do documento `código.md`.
- Criação do arquivo de testes automatizados.

**Evidências relacionadas:**

| Evidência | Descrição |
|---|---|
| `test_facade.py` | Implementação dos testes automatizados. |
| `código.md` | Organização da documentação. |
| Histórico de commits | [Histórico de commits](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commits/main/?author=PedroRSR). |

## 11. Nível de Contribuição dos Integrantes

O nível de contribuição deve considerar as atividades efetivamente realizadas, a complexidade do trabalho desenvolvido e as evidências disponíveis. A classificação deve ser coerente com os critérios adotados pela equipe.

| Integrante | Atividades desenvolvidas | Nível de contribuição | Justificativa |
|---|---|---|---|
| [Isaac Menezes](https://github.com/pratamz250) | Organização e documentação técnica da implementação do padrão Facade. | 33,33% (proposto) | O percentual deve ser confirmado pela equipe com base na participação comprovada na implementação, na documentação e nas demais atividades relacionadas à entrega. |
| [Pedro Ramos](https://github.com/PedroRSR) | Revisão da implementação e documentação do padrão Facade, além da descrição do fluxo de carregamento da tela inicial. | 33,33% | Participação relevante na organização e na explicação da solução, com foco na clareza da implementação e na documentação técnica. |
| [Pablo Rodrigues](https://github.com/Pablo-R-L) | Adição de classes na implementação do padrão facade e ajustes no documento, além da incorporação das novas classes na fachada e no client. | 33,33% | Participação relevante na organização e na resolução do código, com foco na simplicidade e fidelidade da implementação. |

**Observação:** o nível de contribuição deve ser definido de acordo com os critérios acordados pela equipe e com as atividades efetivamente realizadas. A tabela não substitui o registro de evidências.

## 12. Referências

GAMMA, Erich et al. *Design Patterns: Elements of Reusable Object-Oriented Software*. Boston: Addison-Wesley, 1994.

## 13. Histórico de Versões

| Versão | Data | Descrição | Autor(es) | Revisor(es) | Detalhe da Revisão |
|:---:|:---:|:---|:---|:---|:---|
| 1.0 | 15/10/2026 | Documentação da implementação didática do padrão Facade para consolidação dos dados da tela inicial. | [Isaac Menezes](https://github.com/pratamz250) | [Pedro Ramos](https://github.com/PedroRSR) | Organização da documentação técnica, descrição dos subsistemas e da fachada, procedimentos de execução e registro de participação e contribuição. |
| 1.1 | 15/10/2026 | Adição do meu ponto de vista. | [Pedro Ramos](https://github.com/PedroRSR) | [Pablo Rodrigues](https://github.com/Pablo-R-L) | Adição de sua parte sobre a o codigo e pontos de vista referenete ao mesmo | 
| 1.2 | 16/10/2026 | Criação dos testes automatizados e adição de informações na documentação. | [Pedro Ramos](https://github.com/PedroRSR) | [Pablo Rodrigues](https://github.com/Pablo-R-L) | Organização do tópico de teste da implementação da fachada e criação do arquivo [test_facade.py](src/test_facade.py) |
| 1.3 | 17/10/2026 | Adição do meu ponto de vista e participação. | [Pablo Rodrigues](https://github.com/Pablo-R-L) | [Pedro Ramos](https://github.com/PedroRSR) | Adição do ponto de vista e participação de Pablo |
| 1.4 | 18/10/2026 | Atualização dos links dos meus commits. | [Pablo Rodrigues](https://github.com/Pablo-R-L) | [Pedro Ramos](https://github.com/PedroRSR) | Atualização dos links dos commits do Pablo |
| 1.5 | 18/10/2026 | Complementação do topico 8. | [Pablo Rodrigues](https://github.com/Pablo-R-L) | [Pedro Ramos](https://github.com/PedroRSR) | Conteúdo do tópico 8 foi atualizado |