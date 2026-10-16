from subsistemas import ServicoPostagensRelevantes, ServicoUsuarios, ServicoPublicidade, ServicoPostagensRecentes, ServicoEstatisticas, ServicoAutorizacao

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