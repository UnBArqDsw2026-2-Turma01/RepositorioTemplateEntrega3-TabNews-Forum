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
            {"id": 3, "titulo": "Nova atualização do framework", "tabcoins": 1, "autor": "usuario_c"}
        ]

class ServicoEstatisticas:
    def obter_status_sistema(self):
        # Simula a leitura do cache ou monitoramento da aplicação
        return {
            "usuarios_online": 142,
            "publicacoes_hoje": 87
        }