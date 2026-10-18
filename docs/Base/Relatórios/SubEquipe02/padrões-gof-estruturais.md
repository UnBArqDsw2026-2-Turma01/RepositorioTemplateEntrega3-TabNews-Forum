# Padrões GoF Estruturais

> **SubEquipe 02 — Projeto Fórum — Entrega 03**  
> **Padrão escolhido:** Facade.
> **Tecnologia da demonstração:** Python.

## 1. Introdução

Os padrões de projeto são soluções recorrentes para problemas comuns de projeto de software. O catálogo *Design Patterns: Elements of Reusable Object-Oriented Software*, conhecido como GoF (*Gang of Four*), organiza os padrões em três categorias: criacionais, estruturais e comportamentais.

Os padrões estruturais tratam de como classes e objetos são compostos para formar estruturas maiores e mais complexas. Eles ajudam a garantir que, quando um sistema cresce, essas estruturas permaneçam flexíveis e eficientes. Este trabalho demonstra o padrão estrutural Facade (Fachada) em cenários didáticos relacionados ao Projeto TabNews.

A implementação principal aborda a orquestração do processo de renderização da tela inicial, que envolve autorização de conteúdo e propagandas, atualização de postagens e validação de paramentros.

Esta implementação tem caráter demonstrativo e é independente do sistema principal do fórum. Seu objetivo é permitir a modelagem, a execução e a validação do padrão sem pressupor que ele já esteja integrado à aplicação real.

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

Na implementação apresentada, a classe `TelaInicialFacade` reúne as requisições necessárias aos subsistemas responsáveis por buscar os conteúdos do TabNews (`ServicoPostagensRelevantes`, `ServicoPostagensRecentes` e `ServicoEstatisticas`). O método `carregar_dados()` orquestra as chamadas a essas diferentes partes e devolve um objeto consolidado, pronto para ser consumido pela interface de usuário.

A Fachada não "esconde" as classes complexas de forma obrigatória (se o cliente precisar, ainda pode acessá-las diretamente), mas oferece um caminho padronizado e direto para as operações mais comuns.

## 4. Problema Abordado

A execução de tarefas de negócio frequentemente requer a interação com múltiplas classes e serviços distintos. Isso obriga o código cliente (como um controlador de API ou interface de usuário) a conhecer detalhes íntimos de implementação, gerando alto acoplamento.

No contexto da Tela Inicial do fórum TabNews, para renderizar a página corretamente, o cliente precisaria conhecer a lógica de como buscar as publicações mais votadas (relevantes), as últimas publicações feitas na plataforma (recentes) e dados auxiliares do sistema.

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

No contexto do TabNews, a tela inicial é o ponto principal e que envolve diversos componentes do sistema. Em vez de deixar o controlador da rota lidar com a validação de segurança, filtragem de conteúdo e organização das postagens, utilizamos o padrão Facade para organizar essa sequência.

Essa aplicação demonstra como o código cliente se torna limpo e legível ao delegar as complexidades para a `carregar_dados()`.

### 7.2 Objetivo da implementação

O exemplo utiliza a classe `TelaInicialFacade` para acessar os dados e as classes de serviço para representar os subsistemas complexos.

A implementação permite:

- Centralizar o ponto de acesso aos dados da Home.
- Ocultar a inicialização e orquestração dos serviços.
- Tratar e consolidar os retornos em uma estrutura simples.

### 7.3 Classes de Subsistema (Os serviços)

As classes a seguir simulam a lógica de busca de dados no banco ou em APIs externas.

Arquivo: `src/subsistemas.py`

```python
class ServicoPostagensRelevantes:
    def buscar_relevantes(self):
        # Simula uma busca complexa no banco de dados baseada em tabcoins
        return [
            {"id": 1, "titulo": "O que são Padrões de Projeto?", "tabcoins": 45, "autor": "usuario_a"},
            {"id": 2, "titulo": "Dicas de Python para iniciantes", "tabcoins": 32, "autor": "usuario_b"}
        ]

class ServicoPostagensRecentes:
    def buscar_recentes(self):
        # Simula uma busca ordenando estritamente pela data de criação
        return [
            {"id": 3, "titulo": "Nova atualização do framework", "tabcoins": 1, "autor": "usuario_c"},
           {"id": 3, "titulo": "imagina algo muito improprio aqui", "tabcoins": 100, "autor": "usuario_d"}
        ]
    
class ServicoEstatisticas:
    def obter_status_sistema(self):
        # Simula a leitura do cache ou monitoramento da aplicação
        return {
            "usuarios_online": 142,
            "publicacoes_hoje": 87
        }

class ServicoPublicidade:
    def obter_publicidade_aleatoria(self):
        # Simula a busca por uma quantia de propagandas
        return {"id" : 1, "titulo" : "Promoção", "empresa" : "Amazono", "conteudo" : "promocao do dia 10/10"}
            
        

class ServicoAutorizacao:
    # Filtra postagens e bloqueia conteudos improprios
    def filtragem(self, data):
        for postagem in data:
            if "improprio" in postagem['titulo']:
                postagem['titulo'] = "AVISO: Conteudo Filtrado"
                postagem["tabcoins"] = 0
            

class ServicoUsuarios:
    # Simula criação de usuario anonimo assim que o site é acessado
    def criar_anonimo(self):
        return "Anonimo"

```

### 7.4 Classe `TelaInicialFacade`

A Fachada instancia (ou recebe injetada) os subsistemas e disponibiliza um método amigável para o uso.

Arquivo: `src/tela_inicial_facade.py`

```python
class TelaInicialFacade:
    def __init__(self):
        self._servico_relevantes = ServicoPostagensRelevantes()
        self._servico_recentes = ServicoPostagensRecentes()
        self._servico_estatisticas = ServicoEstatisticas()
        self._servico_Autorizacao = ServicoAutorizacao()
        self._servico_Publicidade = ServicoPublicidade()
        self._servico_Usuario = ServicoUsuarios()

    def carregar_dados(self):
        """
        Orquestra a busca nos diferentes subsistemas e retorna os dados
        consolidados para a Tela Inicial.
        """
        try:
            relevantes = self._servico_relevantes.buscar_relevantes()
            recentes = self._servico_recentes.buscar_recentes()
            estatisticas = self._servico_estatisticas.obter_status_sistema()
            publicidade = self._servico_Publicidade.obter_publicidade_aleatoria()
            
            self._servico_Autorizacao.filtragem(relevantes)
            self._servico_Autorizacao.filtragem(recentes)

            
            
            return {
                "sucesso": True,
                "dados": {
                    "feed_relevante": relevantes,
                    "feed_recente": recentes,
                    "informacoes_rodape": estatisticas,
                    "publicidade": publicidade
                }
            }
        except Exception as erro:
            return {
                "sucesso": False,
                "erro": f"Falha ao carregar a tela inicial: {str(erro)}"
            }

    def criar_usuario_anonimo(self):
        #assumindo que o usuario não está logado
        try:
            usuario = self._servico_Usuario.criar_anonimo()
            return {
                "sucesso": True,
                "usuario": usuario
            }
        except Exception as erro:
                    return {
                        "sucesso": False,
                        "erro": f"Falha ao criar usuario anonimo: {str(erro)}"
                    }

```

### 7.5 Código cliente

O código cliente utiliza apenas a Fachada, desconhecendo completamente a existência de `ServicoPostagensRelevantes` ou `ServicoEstatisticas`.

Arquivo: `src/main.py`

```python
from tela_inicial_facade import TelaInicialFacade

def renderizar_tela_inicial():
    facade = TelaInicialFacade()
    
    print("Iniciando o carregamento da Tela Inicial (TabNews)...\n")
    
    resposta = facade.carregar_dados()
    usuario = facade.criar_usuario_anonimo()

    if usuario.get("sucesso") == False:
        print(usuario.get("erro"))
        return

    if resposta.get("sucesso"):
        print(f"-Logado como usuário {usuario.get("usuario")}-\n")

        dados = resposta["dados"]
        print("=== PUBLICIDADE ===")
        publicidade = dados["publicidade"]
        print(f"- {publicidade["empresa"]}:\n    {publicidade["conteudo"]}")
        
        print("\n=== CONTEÚDO RELEVANTE ===")
        for post in dados["feed_relevante"]:
            print(f"- {post['titulo']} ({post['tabcoins']} tabcoins)")
            
        print("\n=== CONTEÚDO RECENTE ===")
        for post in dados["feed_recente"]:
            print(f"- {post['titulo']} (por {post['autor']})")
            
        print(f"\n[Status: {dados['informacoes_rodape']['usuarios_online']} usuários online agora]")
    else:
        print(resposta.get("erro"))

if __name__ == "__main__":
    renderizar_tela_inicial()

```

### 7.6 Relação com o padrão Facade

A implementação apresenta os seguintes participantes:

* **Fachada (Facade):** `TelaInicialFacade`, que conhece quais classes de subsistema são responsáveis por atender a uma requisição e delega o trabalho a elas.
* **Subsistemas:** `ServicoPostagensRelevantes`, `ServicoPostagensRecentes`, `ServicoEstatisticas`, que implementam as funcionalidades. Eles não têm referência à Fachada.
* **Cliente:** A função `renderizar_tela_inicial()`, que interage apenas com a Fachada, mantendo-se desacoplada da lógica interna de aquisição dos dados da plataforma.

## 8. Considerações Finais

O cenário apresentado demonstra como o Facade pode organizar a comunicação estrutural entre a requisição visual e os diversos módulos de leitura de dados do fórum TabNews, especificamente na Tela Inicial.

A demonstração permite relacionar fundamentação teórica e implementação executável, evidenciando o desacoplamento e a simplificação.

Entretanto, a escolha do padrão deve considerar a complexidade real da integração e não ser feita apenas para inserir um padrão no código. Funcionalidades complexas reais do TabNews poderiam exigir camadas adicionais assíncronas para carregar os posts sob demanda, mas o princípio de ocultar isso atrás de uma interface simples continuaria válido.

A eventual integração dessa implementação ao Projeto Fórum deverá ser avaliada e realizada separadamente.

## Referências

GAMMA, Erich; HELM, Richard; JOHNSON, Ralph; VLISSIDES, John. *Design Patterns: Elements of Reusable Object-Oriented Software*. Reading, MA: Addison-Wesley, 1994.

REFACTORING.GURU. *Facade*. Disponível em: https://refactoring.guru/pt-br/design-patterns/facade. Acesso em: 15 out. 2026.

## Histórico de Versões

| Versão | Data | Descrição | Autor(es) | Revisor(es) | Detalhe da Revisão |
|---|---|---|---|---|---|
| 1.0 | 13/10/2026 | Criação da documentação inicial sobre o padrão Facade. | [Isaac Menezes](https://github.com/pratamz250) | [Pedro Ramos](https://github.com/PedroRSR) | Conteúdo fala sobre padrão criacional e não estrutural |
| 1.1 | 15/10/2026 | Correção e adição de novas informações. | [Pedro Ramos](https://github.com/PedroRSR) | [Pablo Rodrigues](https://github.com/Pablo-R-L) | Adição de novos conteúdos referente ao padrão Facade do tópico 1 ao 7 |
| 1.2 | 15/10/2026 | Correções referentes ao foco do projeto e código | [Pablo Rodrigues](https://github.com/Pablo-R-L) | [Pedro Ramos](https://github.com/PedroRSR) | Correção e adição de novas informações relacionadas aos tópicos 1 ao 7 |
| 1.3 | 15/10/2026 | Alterações no texto, adição dos códigos e das considerações finais | [Pedro Ramos](https://github.com/PedroRSR) | [Isaac Menezes](https://github.com/pratamz250) | Considerações relevantes e corretas. |
| 1.4 | 18/10/2026 | Atualização dos códigos | [Pedro Ramos](https://github.com/PedroRSR) | [Isaac Menezes](https://github.com/pratamz250) | Atualização necessária e correta. |