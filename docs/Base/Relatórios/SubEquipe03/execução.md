# 4. Execução

Esta seção apresenta os procedimentos necessários para executar a demonstração do padrão de projeto GoF Observer aplicado à gestão de eventos no ciclo de vida de conteúdos. São descritos os pré-requisitos, os comandos de execução, os resultados esperados, os testes automatizados e os critérios utilizados para verificar o comportamento da implementação.

A demonstração foi desenvolvida em JavaScript com Node.js e não depende de bibliotecas externas. Seu objetivo é verificar a viabilidade do padrão para garantir baixo acoplamento entre o serviço principal (`ServicoDeConteudo`) e os observadores (`ServicoDeTabCoins`, `NotificadorDeResposta` e `RegistroDeAtividades`).

A implementação possui caráter didático e independente do sistema real do Projeto Fórum, não realizando persistência em banco de dados real nem integração com usuários externos.

## 1. Pré-requisitos

Para executar a demonstração, são necessários:

- Node.js versão 18 ou superior;
- terminal aberto na raiz do projeto;
- arquivos da implementação organizados conforme a estrutura definida;
- nenhuma dependência externa para a execução do programa e dos testes.

A estrutura esperada do projeto é:

```text
projeto/
├── src/
│   ├── EventoDeConteudo.js
│   ├── NotificadorDeResposta.js
│   ├── Observador.js
│   ├── RegistroDeAtividades.js
│   ├── RepositorioDeConteudo.js
│   ├── ServicoDeConteudo.js
│   ├── ServicoDeTabCoins.js
│   ├── Sujeito.js
│   └── index.js
├── test/
│   └── observer.test.js
└── package.json
```

Para verificar se o Node.js e o npm estão instalados, execute:

```bash
node --version
npm --version
```

O comando `node --version` apresenta a versão instalada do Node.js. O comando `npm --version` verifica a disponibilidade do gerenciador de pacotes npm.

Caso os comandos não sejam reconhecidos, será necessário instalar ou configurar o Node.js antes de continuar.

## 2. Executar a demonstração

Com o terminal aberto na raiz do projeto, execute:

```bash
node start
```

O programa instancia o serviço de conteúdos, configura a inscrição dos observadores e simula o fluxo completo do sistema, incluindo publicações, transições de moderação (revisão e restauração), remoção e falha de observadores.

Após a construção, o resultado é convertido para JSON e apresentado no terminal.

### 2.1. Resultado esperado

Considerando a implementação apresentada na seção de código, a saída esperada é:

```text
[Cliente] Postagem c1 de joao criada como ponto de partida

=== 1. Configuração: inscrição dos observadores ===
[Cliente] ServicoDeTabCoins inscrito
[Cliente] NotificadorDeResposta inscrito
[Cliente] RegistroDeAtividades inscrito

=== 2. Publicação de comentários ===
[Conteudo] maria publicou c2 em resposta a c1
[TabCoins] +1 para maria (saldo: 1)
[Notificador] Para joao: maria respondeu ao seu conteúdo c1: "Use uma classe Sujeito."
[Auditoria] Log gravado: COMENTARIO_PUBLICADO -> c2
[Conteudo] joao publicou c3 em resposta a c1
[TabCoins] +1 para joao (saldo: 1)
[Notificador] joao respondeu ao próprio conteúdo; nenhuma notificação
[Auditoria] Log gravado: COMENTARIO_PUBLICADO -> c3

=== 3. Moderação: Envio para Revisão e Restauração ===

[Conteudo] c2 de maria foi enviado para revisão (Oculto)
[TabCoins] -1 para maria (saldo: 0)
[Notificador] Evento CONTEUDO_EM_REVISAO ignorado (tipo não tratado)
[Auditoria] Log gravado: CONTEUDO_EM_REVISAO -> c2

[Conteudo] c2 de maria foi restaurado pela moderação
[TabCoins] +1 para maria (saldo: 1)
[Notificador] Evento CONTEUDO_RESTAURADO ignorado (tipo não tratado)
[Auditoria] Log gravado: CONTEUDO_RESTAURADO -> c2

=== 4. Remoção de conteúdo ===
[Conteudo] c2 de maria foi removido
[TabCoins] -1 para maria (saldo: 0)
[Notificador] Evento CONTEUDO_REMOVIDO ignorado (tipo não tratado)
[Auditoria] Log gravado: CONTEUDO_REMOVIDO -> c2

=== 5. Desinscrição do NotificadorDeResposta ===
[Cliente] NotificadorDeResposta desinscrito
[Conteudo] carlos publicou c4 em resposta a c1
[TabCoins] +1 para carlos (saldo: 1)
[Auditoria] Log gravado: COMENTARIO_PUBLICADO -> c4

=== 6. Extra (RN06): um observador que falha não impede os demais ===
[Cliente] ObservadorComFalha inscrito
[Cliente] NotificadorDeResposta inscrito novamente, depois do observador com falha
[Conteudo] ana publicou c5 em resposta a c1
[TabCoins] +1 para ana (saldo: 1)
[Auditoria] Log gravado: COMENTARIO_PUBLICADO -> c5
[Sujeito] Falha em ObservadorComFalha: falha simulada ao processar COMENTARIO_PUBLICADO
[Notificador] Para joao: ana respondeu ao seu conteúdo c1: "Ótima discussão!"

=== Resumo ===
[TabCoins] Saldo de joao: 1
[TabCoins] Saldo de maria: 0
[TabCoins] Saldo de carlos: 1
[TabCoins] Saldo de ana: 1
[Notificador] Notificações de joao: 2
[Auditoria] Total de eventos registrados no log: 7
```

**Importante:** essa saída representa o resultado esperado com base no código apresentado. Ela não comprova que a execução já foi realizada. A comprovação deverá ser registrada por meio de uma captura real do terminal.

## 3. Executar os testes automatizados

Os testes automatizados verificam se a implementação apresenta os comportamentos definidos pelas regras de negócio (RN01 a RN07).

Na raiz do projeto, execute:

```bash
npm test
```

O comando utiliza o módulo nativo `node:test` do Node.js para localizar e executar os testes compatíveis com o padrão de descoberta do projeto.

### 3.1. Cenários de teste

Os testes devem verificar os seguintes comportamentos:

| Identificador | Cenário | Resultado esperado |
|---|---|---|
| CT01 | Instanciação de classes abstratas (`Sujeito` e `Observador`). | A operação lança um erro do tipo `TypeError` ou genérico pedindo a sobrescrita. |
| CT02 | Tolerância a falhas (RN06). | O erro intencional de um observador no ciclo de notificação não impede a execução dos observadores subsequentes. |
| CT03 | Crédito e débito de TabCoins (RN01, RN02). | Publicações creditam saldo ao autor; remoções debitam. |
| CT04 | Fluxo de Moderação em TabCoins. | O saldo é suspenso ao enviar para revisão e restaurado mediante a aprovação do conteúdo. |
| CT05 | Notificação de respostas (RN03). | Autores recebem notificação apenas quando terceiros respondem às suas publicações. |
| CT06 | Omissão de auto-notificação (RN04). | Um usuário que responde ao próprio post não gera disparo de notificação. |
| CT07 | Log de Auditoria (RN07). | O `RegistroDeAtividades` grava cronologicamente todas as transições de estado (publicação, revisão, restauração, remoção) do sistema.

### 3.2. Resultado esperado dos testes

Quando todos os testes estiverem implementados corretamente e forem executados com sucesso, o Node.js deverá indicar que os testes foram aprovados.

## 4. Critérios de validação

A implementação será considerada validada quando os seguintes critérios forem atendidos:

| Critério | Descrição | Verificação |
|---|---|---|
| CV01 | Baixo Acoplamento. | O sujeito central (`ServicoDeConteudo`) desconhece e não importa as classes de TabCoins, Notificações ou Auditoria. |
| CV02 | Comportamento do TabCoins. | Os créditos flutuam corretamente de acordo com os estados de publicação, moderação e remoção. |
| CV03 | Comportamento das Notificações. | Notificações obedecem os filtros previstos e ignoram eventos irrelevantes (remoção/moderação). |
| CV04 | Integridade da Auditoria. | Todo evento disparado consta integralmente no log do `RegistroDeAtividades`. |
| CV05 | Resiliência e Desinscrição. | É possível remover observadores dinamicamente e lidar com falhas internas sem travar o programa. |
| CV06 | Suíte de Testes. | Todos os testes automatizados da arquitetura encerram sem falhas. |


## 5. Evidências de execução

Esta seção deve reunir evidências que permitam verificar o funcionamento da implementação e a execução dos testes automatizados.

As capturas devem ser produzidas durante a execução real dos comandos, sem substituir resultados obtidos por exemplos ilustrativos.

### 5.1. Execução do programa

Para executar a demonstração: 

```bash
npm start
```

Registre uma captura de tela que mostre o comando executado e a saída apresentada no terminal.

**Figura 1 — Execução da demonstração do padrão Observer (Terminal).**

Inserir aqui a captura real do terminal.

*Fonte: elaboração própria.*

### 5.2. Execução dos testes automatizados

Execute:

```bash
npm test
```

Registre uma captura de tela que mostre o comando executado e o resultado dos testes.

**Figura 2 — Execução dos testes automatizados da implementação Builder.**

Inserir aqui a captura real do terminal.

*Fonte: elaboração própria.*

### 5.3. Registro das evidências

| Evidência | Arquivo ou captura | Resultado observado |
|---|---|---|
| Execução do programa | A preencher após a execução | A preencher conforme a saída real. |
| Testes automatizados | A preencher após a execução | A preencher conforme o resultado real. |
| Validação dos campos obrigatórios | A preencher, caso registrada separadamente | A preencher conforme a verificação realizada. |

As evidências devem ser atualizadas após a execução. Caso sejam armazenadas em uma pasta do repositório, recomenda-se utilizar uma organização semelhante a esta:

```text
evidencias/
├── execucao-programa.png
├── testes-automatizados.png
└── validacao-campos.png
```

Os arquivos são apenas uma sugestão de organização. As capturas devem ser criadas e incluídas efetivamente antes de serem referenciadas como evidências existentes.

## 6. Limitações da demonstração

A demonstração tem como finalidade apresentar o funcionamento do padrão de projeto Observer em um cenário contido. A implementação não contempla:

- integração com o sistema backend real do Projeto Fórum;
- comunicação assíncrona por filas/mensageria (RabbitMQ, Kafka, etc.);
- gerenciamento de usuários autênticos e sessões HTTP;
- persistência de logs, notificações e moedas em bancos de dados relacionais;
- tratamento de concorrência ou disparo de e-mails/SMS reais.

Dessa forma, os resultados obtidos demonstram o comportamento da implementação didática, mas não comprovam a integração do padrão com a aplicação real do fórum.


## 7. Nível de Contribuição dos Integrantes

O nível de contribuição deve refletir as atividades efetivamente realizadas na elaboração e na verificação da implementação.

| Integrante | Atividades desenvolvidas | Nível de contribuição | Justificativa |
|---|---|---|---|
| [Caio Alexandre] | | | |
| [Guilherme Moura](github.com/Guilherme-Moura) | Implementação da Moderação/Auditoria, validação via testes e documentação de execução. | 33,33% | A classificação deve considerar a participação comprovada na implementação, na documentação e nas atividades relacionadas à entrega. |
| [Leonardo Fachinello Bonetti] | | | |

A classificação deverá ser definida conforme os critérios adotados pela equipe e a participação comprovada nas atividades.

## 8. Referências

GAMMA, Erich et al. *Design Patterns: Elements of Reusable Object-Oriented Software*. Boston: Addison-Wesley, 1994.

NODE.JS. *Node.js Documentation*. Disponível em: <https://nodejs.org/docs/latest/api/>. Acesso em: 08 out. 2026.

## 9. Histórico de Versões

| Versão | Data | Descrição | Autor(es) | Revisor(es) | Detalhe da Revisão |
|:---:|:---:|:---|:---|:---|:---|
| 1.0 | 16/10/2026 | Elaboração da documentação de execução do padrão Observer. | [Guilherme Moura](github.com/Guilherme-Moura) | — | Organização dos pré-requisitos, procedimentos de execução (Terminal), cenários de testes, critérios de validação e referências. |