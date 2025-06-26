# Respostas do Usuário - Sistema de Predição de Futebol

## 1. Dados Históricos
- Os dados estão em um banco PostgreSQL local.
- A página de histórico já utiliza uma rota que recebe liga e temporada e lista os jogos.
- Essa rota pode ser reutilizada para o sistema de predição.

## 2. Redis
- O usuário deseja instalar e configurar o Redis já na primeira etapa.
- Objetivo: garantir robustez, cache e performance desde o início.

## 3. Página de Histórico
- A página de histórico já traz a lista de partidas, escalação, resultados, h2h e estatísticas.
- Os jogos de 2024 serão usados como ponto de partida para análise e predição.

## 4. Estratégia de Predição
- A análise será feita dos jogos mais antigos para os mais novos, simulando o cenário real.
- Para cada partida, a previsão será feita usando apenas o histórico anterior àquele jogo.
- Após o resultado real, será comparado se a previsão foi acertiva ou não.
- A previsão e o acerto serão exibidos por partida na tela de simular apostar.

## 5. Tela de Simulação de Apostas
- Atualmente, a tela só lista os jogos.
- Será necessário criar/adaptar componentes para exibir previsão e acerto.

## 6. Armazenamento das Previsões
- Por enquanto, as previsões e acertos não precisam ser salvos no banco.
- Podem ser mantidos apenas em memória ou no Redis durante os testes.

## 7. Formato dos Dados
- O formato dos dados recebidos pode ser analisado diretamente na página de histórico.
- O usuário sugeriu que o assistente analise o código para entender o formato.

## Observações
- Caso surjam dúvidas durante a implementação, o assistente deve perguntar ao usuário.
- O usuário não tem preferência sobre o armazenamento das previsões neste momento.
