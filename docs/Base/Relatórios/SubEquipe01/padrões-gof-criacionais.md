# Padrões GoF Criacionais no Projeto Fórum TabNews

> **SubEquipe 01 — Entrega 03 — Padrões de Projeto**  
> **Implementação demonstrativa analisada:** Builder para construção de publicações, em JavaScript com Node.js.

## 1. Contexto e escopo

Os padrões criacionais tratam de como objetos são criados. Em vez de deixar cada parte do programa instanciar objetos sem coordenação, esses padrões organizam decisões de criação, montagem, cópia ou compartilhamento de instâncias. A escolha de um padrão depende do problema concreto: aplicar um padrão sem necessidade pode aumentar a quantidade de classes e a dificuldade de manutenção.

Na Entrega 03, a SubEquipe 01 documenta e demonstra o **Builder** na construção de uma publicação. Os arquivos disponíveis nesta implementação são `src/Publicacao.js`, `src/PublicacaoBuilder.js`, `src/index.js` e `test/PublicacaoBuilder.test.js`. O programa monta um objeto com título, conteúdo, autor e tags, valida os campos obrigatórios, normaliza textos e apresenta o resultado em JSON.

O escopo é acadêmico e demonstrativo. Embora os dados representem conceitos do Fórum TabNews, o código não está conectado à aplicação real: não autentica autores, não grava publicações no banco, não publica conteúdo, não cria comentários, não calcula TabCoins e não aplica moderação. O campo `autor` é uma string informada pelo cliente de demonstração, não a identidade de uma sessão autenticada.

O catálogo GoF contém cinco padrões criacionais: Abstract Factory, Builder, Factory Method, Prototype e Singleton. Este relatório aprofunda o padrão que possui implementação comprovável nesta parte da entrega. Os demais são apresentados de forma comparativa para delimitar seu propósito, não como funcionalidades implementadas pela SubEquipe 01.

## 2. Objetivos

### 2.1 Objetivo geral

Explicar a escolha e a aplicação demonstrativa do padrão Builder na criação de publicações do domínio de um fórum, relacionando a motivação, os participantes, o fluxo, as validações e as limitações ao código realmente disponível.

### 2.2 Objetivos específicos

- Situar o Builder entre os cinco padrões criacionais GoF.
- Descrever o problema de criação que surge ao montar uma publicação com vários atributos.
- Relacionar cada participante do padrão aos arquivos da implementação.
- Explicar as regras de construção e identificar quais delas são verificadas pelos testes existentes.
- Avaliar vantagens, custos, alternativas e limites da solução no contexto do Fórum TabNews.
- Distinguir a demonstração local de uma integração com o sistema real.

## 3. Catálogo criacional e escolha para a entrega

| Padrão | Intenção | Relação com esta entrega |
|:---|:---|:---|
| **Abstract Factory** | Criar famílias de objetos relacionados sem expor suas classes concretas. | Não há famílias de produtos ou implementações de fábricas abstratas nesta demonstração. Seria pertinente se o sistema precisasse criar conjuntos compatíveis de componentes para variantes distintas de uma plataforma. |
| **Builder** | Separar a montagem gradual de um objeto de sua representação final. | É o padrão demonstrado no código da SubEquipe 01 para configurar uma `Publicacao` e validá-la ao concluir `build()`. |
| **Factory Method** | Definir um método de criação cuja implementação concreta decide qual produto instanciar. | Não há hierarquia de criadores nem método de fábrica implementados neste recorte. A escolha entre classes concretas não é o problema tratado pelo Builder atual. |
| **Prototype** | Criar novos objetos copiando um protótipo existente. | Não há operação de clonagem implementada. Reaproveitar um modelo de conteúdo seria outro requisito e exigiria definir quais dados podem ou não ser copiados. |
| **Singleton** | Restringir uma classe a uma instância acessível de forma compartilhada. | Não há singleton implementado. Estado global de publicação ou de usuário não é necessário para construir o objeto da demonstração. |

A escolha do Builder é motivada pela **montagem dos dados de uma publicação**, não pela necessidade de selecionar um tipo de conteúdo, clonar um conteúdo existente ou compartilhar um serviço global. O objeto demonstrativo combina atributos textuais e uma coleção; a construção encadeada nomeia cada atributo e deixa a validação final a cargo da classe do produto.

## 4. Problema de criação no domínio do fórum

Uma publicação demonstrativa reúne quatro informações: título, conteúdo, autor e tags. O título, o conteúdo e o autor são obrigatórios; tags podem ser fornecidas como uma lista vazia. Na construção direta, o cliente precisaria fornecer esses valores ao construtor em uma única chamada, por exemplo:

```javascript
const publicacao = new Publicacao({
  titulo: "Padrões de Projeto GoF",
  conteudo: "Exemplo didático no contexto de um fórum.",
  autor: "Autor demonstrativo",
  tags: ["GoF", "JavaScript"],
});
```

Esse construtor nomeia as propriedades, portanto não sofre do problema de argumentos posicionais ambíguos. Ainda assim, o cliente que prepara o objeto precisa conhecer todos os campos, suas regras e o ponto de conclusão da criação. À medida que opções de construção aumentam, métodos nomeados e validação centralizada podem tornar o processo mais legível e reduzir a repetição da preparação dos dados.

O Builder da entrega não é necessário para tornar o objeto possível: `Publicacao` pode ser instanciada diretamente. Seu valor didático está em evidenciar a diferença entre **configurar** os dados passo a passo e **produzir** o objeto válido. Esse benefício deve ser ponderado contra a classe adicional e o fato de o exemplo ter apenas quatro campos.

## 5. Padrão Builder

### 5.1 Intenção e funcionamento

O Builder separa o processo de montagem do objeto final. O cliente configura partes nomeadas no construtor e chama uma operação final, `build()`. O Builder mantém os dados temporários; o produto decide se esses dados satisfazem suas invariantes e é criado somente quando o construtor de `Publicacao` termina sem erro.

Na implementação da SubEquipe 01, os papéis são:

| Papel | Elemento | Responsabilidade observada |
|:---|:---|:---|
| Cliente | `src/index.js` e demais consumidores | Cria `PublicacaoBuilder`, informa os atributos e solicita `build()`. |
| Builder concreto | `PublicacaoBuilder` | Mantém os dados em `this.dados`, oferece métodos de configuração encadeáveis e cria o produto. |
| Produto | `Publicacao` | Armazena os dados finais, rejeita campos obrigatórios inválidos, normaliza textos e trata tags. |
| Director | Não implementado nesta versão do código | Um Director seria opcional e só faria sentido para encapsular receitas de construção recorrentes. |

Não há uma interface ou classe abstrata `Builder`: existe apenas o Builder concreto. Para esta demonstração, uma abstração adicional não reduziria dependências nem ampliaria as variantes de construção atualmente existentes.

### 5.2 Responsabilidades de `PublicacaoBuilder`

O construtor inicializa `titulo`, `conteudo` e `autor` como strings vazias e `tags` como array vazio. Os métodos `comTitulo()`, `comConteudo()` e `comAutor()` guardam o valor recebido e retornam `this`, permitindo encadeamento. `comTags()` exige um array e armazena uma cópia superficial dele com `[...tags]`, evitando manter a mesma referência ao array recebido pelo cliente.

O método `build()` passa o estado de configuração para `new Publicacao(this.dados)`. Ele não repete as regras de validação do produto. Assim, a validação de título, conteúdo e autor também ocorre caso alguém instancie `Publicacao` diretamente, sem usar o Builder.

### 5.3 Responsabilidades de `Publicacao`

O produto protege suas invariantes no construtor:

- rejeita título ausente ou composto apenas por espaços;
- rejeita conteúdo ausente ou composto apenas por espaços;
- rejeita autor ausente ou composto apenas por espaços;
- remove espaços externos de título, conteúdo e autor;
- converte cada tag para string, remove seus espaços externos, descarta valores vazios e elimina duplicatas;
- fornece `toJSON()` com os quatro atributos da publicação.

As validações de título, conteúdo e autor usam `trim()`. Portanto, o comportamento implementado pressupõe valores textuais para esses campos; não há validação explícita de tipo com mensagens próprias. Também não há regras de tamanho máximo, formato de URL, limite de tags, autorização ou conteúdo permitido. Essas regras não devem ser presumidas a partir desta demonstração.

### 5.4 Exemplo de uso presente no domínio demonstrativo

O cliente atual constrói uma publicação desta forma:

```javascript
const publicacao = new PublicacaoBuilder()
  .comTitulo("Padrões de Projeto GoF")
  .comConteudo("Exemplo didático do padrão Builder aplicado ao Projeto Fórum.")
  .comAutor("Autor demonstrativo")
  .comTags(["GoF", "Arquitetura", "JavaScript", "GoF"])
  .build();

console.log(JSON.stringify(publicacao, null, 2));
```

O exemplo fornece `GoF` duas vezes para tornar observável a eliminação de tags repetidas. Após `build()`, `toJSON()` determina os dados serializados; a tag repetida não aparece no resultado.

## 6. Fluxo de construção

O fluxo executado pode ser lido em seis etapas:

1. O cliente instancia `PublicacaoBuilder`; `dados` recebe valores iniciais.
2. Cada chamada `com...()` atualiza um atributo temporário e retorna o mesmo Builder.
3. `comTags()` verifica que recebeu um array e copia essa lista.
4. O cliente chama `build()` para encerrar a configuração.
5. `build()` passa os dados a `Publicacao`; o construtor valida os obrigatórios, normaliza textos e prepara as tags.
6. Se a criação for bem-sucedida, o produto retorna ao cliente e pode ser serializado. Se a validação falhar, uma exceção é lançada e nenhum objeto válido é devolvido por aquela chamada.

```text
Cliente
  -> PublicacaoBuilder()
  -> comTitulo / comConteudo / comAutor / comTags
  -> build()
       -> Publicacao(dados)
            -> validar obrigatórios
            -> normalizar texto e tags
       <- instância válida ou exceção
  <- publicação
```

Não existe Director no código-fonte disponível da SubEquipe 01. Um Director não é requisito do padrão: ele é útil quando uma mesma receita precisa ser reaproveitada, por exemplo, se a aplicação definisse processos de criação distintos e recorrentes para formatos de publicação. Criar esse componente sem receitas reais adicionaria indireção, sem resolver um problema atual demonstrado.

## 7. Regras de construção e evidências

As regras abaixo se limitam ao comportamento presente em `Publicacao.js`, `PublicacaoBuilder.js` e aos cenários do teste existente.

| Identificador | Regra/comportamento | Componente | Cobertura no teste disponível |
|:---|:---|:---|:---|
| RN01 | Título não pode faltar nem ficar vazio após `trim()`. | `Publicacao` | Sim: ausência de título. |
| RN02 | Conteúdo não pode faltar nem ficar vazio após `trim()`. | `Publicacao` | Sim: ausência de conteúdo. |
| RN03 | Autor não pode faltar nem ficar vazio após `trim()`. | `Publicacao` | O código valida; o arquivo de teste atual não tem caso específico para autor ausente. |
| RN04 | `comTags()` aceita somente arrays. | `PublicacaoBuilder` | Sim: valor que não é array. |
| RN05 | Espaços externos de título, conteúdo e autor são removidos. | `Publicacao` | Parcial: o teste verifica título e conteúdo, mas não contém asserção para o autor. |
| RN06 | Tags são copiadas na configuração, convertidas para string, aparadas e filtradas; duplicatas são removidas. | Builder e `Publicacao` | Sim: tags repetidas e vazias e espaços em tag. |
| RN07 | A representação JSON expõe título, conteúdo, autor e tags. | `Publicacao.toJSON()` | O teste atual verifica os atributos construídos, mas não contém cenário específico para `toJSON()`. |

O teste disponível contém cinco casos: construção válida, normalização e deduplicação, rejeição de título ausente, rejeição de conteúdo ausente e rejeição de tags que não sejam array. O código também valida autor, mas a suíte existente não testa explicitamente essa falha. A documentação distingue, portanto, o que está implementado do que está coberto por teste.

## 8. Decisões de projeto e consequências

### 8.1 Validação no produto

As invariantes ficam em `Publicacao`, não apenas no Builder. Isso evita que um caminho alternativo de construção crie um objeto que viole as mesmas regras básicas. O Builder cuida da configuração; o produto decide se o estado recebido é aceitável.

### 8.2 Encadeamento de métodos

Retornar `this` torna cada atribuição explícita e permite interromper a cadeia, armazenar o Builder e continuar configurando depois. Em contrapartida, o estado do Builder é mutável: uma nova chamada substitui o valor anteriormente configurado para aquele campo.

### 8.3 Cópias e independência

`comTags()` copia o array fornecido e `Publicacao` cria sua própria lista final normalizada. As tags do produto não compartilham o array original recebido pelo cliente. Cada chamada de `build()` também chama novamente o construtor de `Publicacao`, produzindo outra instância. Essa independência decorre do código, mas o arquivo de teste atual não contém um caso específico que compare duas chamadas de `build()`.

### 8.4 Mutabilidade e reutilização

O produto não é congelado: suas propriedades e o array `tags` permanecem mutáveis depois de construídos. O Builder também não é reinicializado após `build()`. Se o mesmo Builder for usado para construir várias publicações, os campos configurados permanecem até serem substituídos; isso pode ser útil em uso controlado, mas pode também carregar acidentalmente valores de uma configuração anterior. O cliente deve criar um Builder por processo de montagem, ou o projeto deve definir e testar explicitamente outra política de reutilização.

### 8.5 Proporcionalidade

Quatro atributos e um produto simples podem ser montados diretamente com o construtor de objeto nomeado. O Builder acrescenta uma classe e métodos, mas evidencia o padrão e oferece uma API de configuração fluente. Para produção, a equipe deveria comparar essa clareza com o custo de manter duas representações dos dados (`dados` temporários e atributos do produto) e confirmar que existem receitas de criação ou evolução que justifiquem a camada adicional.

## 9. Relação com o Fórum TabNews

O domínio escolhido é pertinente porque a publicação é um elemento central de um fórum e agrega informações que precisam estar presentes antes de se obter um objeto consistente. Na demonstração, Builder oferece um vocabulário explícito para informar título, conteúdo, autor e tags. O produto aplica as regras locais antes de ser apresentado.

Essa relação é **conceitual**, não uma afirmação de integração. Uma aplicação real precisaria definir contratos adicionais e conectar a criação a autenticação, autorização, persistência, identificadores, estados de publicação, regras de moderação, respostas e mecanismos de reputação. Nenhum desses serviços faz parte da implementação Builder apresentada aqui. Não se deve interpretar `build()` como publicação efetiva no TabNews: o método apenas devolve um objeto JavaScript em memória.

O documento de participação da entrega também registra uma contribuição de Builder para cadastro de usuários, incluindo `Usuario` e `CadastroUsuarioBuilder`. Essa é uma aplicação adicional mencionada no registro da equipe, mas as classes correspondentes não estão nos arquivos `src/` e `test/` disponíveis neste recorte. Por isso, este relatório não atribui a elas regras, campos ou resultados de execução que não podem ser conferidos aqui.

## 10. Comparação com os outros padrões criacionais

| Pergunta de projeto | Padrão mais diretamente relacionado | Por que não é o foco desta implementação |
|:---|:---|:---|
| Como configurar um objeto com etapas e atributos nomeados antes de produzi-lo? | **Builder** | É o problema demonstrado por `PublicacaoBuilder`. |
| Qual implementação concreta de produto uma subclasse deve criar? | **Factory Method** | O código não seleciona entre subclasses ou tipos concretos. |
| Como criar famílias coerentes de produtos relacionados? | **Abstract Factory** | Não há família de objetos intercambiáveis nesta implementação. |
| Como obter um novo objeto copiando um existente? | **Prototype** | Não há protótipo, clone ou política de cópia de publicação. |
| Como restringir o acesso a uma instância compartilhada? | **Singleton** | A construção de `Publicacao` não depende de instância global. |

Esses padrões não são versões alternativas do mesmo mecanismo. Builder trata da montagem; Factory Method e Abstract Factory tratam da decisão sobre qual produto ou família criar; Prototype trata de cópia; Singleton restringe a quantidade de instâncias. A presença de todos no catálogo não implica que todos devam ser adotados no mesmo domínio.

## 11. Alternativas e limites

### 11.1 Construtor direto

Para o produto atual, um objeto literal passado a `new Publicacao(...)` já deixa os nomes dos campos visíveis. É a alternativa mais simples e deve ser considerada quando houver poucos parâmetros, nenhum fluxo de montagem recorrente e pouca lógica de configuração. O Builder é preferível quando etapas opcionais, regras de montagem ou receitas reutilizáveis aumentarem a complexidade de forma perceptível.

### 11.2 Fábrica simples

Uma função nomeada que receba os dados e retorne `new Publicacao(dados)` poderia centralizar criação sem uma hierarquia Builder. Isso não forneceria a configuração gradual, mas poderia ser suficiente se o único objetivo fosse encapsular a instanciação. Factory Method GoF, especificamente, envolve criadores que variam a decisão de criação; uma função simples não deve ser chamada automaticamente de Factory Method.

### 11.3 Limites funcionais

- O código não persiste nem envia a publicação a qualquer serviço.
- Não há autorização para determinar se o autor pode publicar.
- Não há identificador, data, estado, categoria, anexos ou contagem de respostas no produto.
- As tags são tratadas localmente; não há catálogo ou política de tags.
- O objeto final é mutável e não há cópia profunda de uma estrutura complexa.
- A implementação não define tratamento de erros para integração, concorrência ou falha de persistência.
- Os testes são unitários e cobrem somente os cinco cenários presentes; não demonstram comportamento de uma aplicação web.

Esses limites descrevem o escopo da demonstração, não defeitos de um sistema de produção. Qualquer expansão deve começar por requisitos explícitos e atualizar código, testes, modelagem e documentação em conjunto.

## 12. Considerações finais

A implementação da SubEquipe 01 demonstra o padrão criacional Builder por meio de uma API fluente que configura uma publicação e delega ao próprio produto a validação de seus campos obrigatórios. O encadeamento deixa os atributos nomeados visíveis; a normalização de texto e tags ocorre durante a criação de `Publicacao`; e o teste automatizado comprova cinco comportamentos específicos.

O principal resultado da entrega é a compreensão do processo de criação e das responsabilidades entre Builder, produto e cliente. A solução permanece pequena e didática: ela não integra a aplicação real do Fórum TabNews, e o uso do padrão deve ser reavaliado caso a criação direta continue sendo suficientemente clara para o objeto atual. Os demais padrões criacionais foram delimitados conceitualmente, sem apresentá-los como código implementado neste recorte.

## Referências

GAMMA, Erich; HELM, Richard; JOHNSON, Ralph; VLISSIDES, John. *Design Patterns: Elements of Reusable Object-Oriented Software*. Reading, MA: Addison-Wesley, 1994.

NODE.JS. *Test runner*. Disponível em: <https://nodejs.org/api/test.html>. Acesso em: 19 out. 2026.

## Histórico de Versões

| Versão | Data | Descrição | Autor(es) | Revisor(es) | Detalhe da Revisão |
|:---:|:---:|:---|:---|:---:|:---|
| 1.0 | 08/10/2026 | Criação da documentação inicial sobre o padrão Builder. | [Arthur Fernandes](https://github.com/arthurfernandesj) | [Giovana Fontes](https://github.com/GiovanaFontesS) | Versão inicial, a revisar após a execução e a validação do exemplo. |
| 1.1 | 10/10/2026 | Inclusão de exemplo complementar de construção de usuário com Builder. | [Giovana Fontes](https://github.com/GiovanaFontesS) | [Giovana Fontes](https://github.com/GiovanaFontesS) | Inclusão de exemplo complementar. |
| 1.2 | 13/10/2026 | Inclusão e correção de exemplos. | [Giovana Fontes](https://github.com/GiovanaFontesS) | [Arthur Fernandes](https://github.com/arthurfernandesj) | Correção de exemplos citados na aplicação complementar do Builder no cadastro de usuários. |
| 1.3 | 14/10/2026 | Inclusão de complemento sobre Factory Method, Prototype e Singleton. | [João Pedro S. Maciel](https://github.com/jopesmp) | [Arthur Fernandes](https://github.com/arthurfernandesj) | Complemento comparativo dos padrões criacionais. |
| 1.4 | 19/10/2026 | Revisão aprofundada do relatório, com foco no Builder implementado e no escopo demonstrativo do Fórum TabNews. | [Arthur Fernandes](https://github.com/arthurfernandesj) | [Giovana Fontes](https://github.com/GiovanaFontesS) | Detalhamento de responsabilidades, fluxo, regras, testes, decisões de projeto, comparação dos padrões criacionais e limites de integração. |