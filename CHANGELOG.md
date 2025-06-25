# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Adicionado
- Componente de visualização de histórico de ligas e temporadas
- Integração com banco de dados PostgreSQL para dados esportivos
- Sistema de tratamento flexível para diferentes formatos de resposta de API

### Corrigido
- **2025-05-20**: Corrigido formato do placar de ":" para "x" para melhorar a visualização
- **2025-05-20**: Ajustado tamanho dos logos dos times para 30x30 pixels
- **2025-05-20**: Removido bordas arredondadas dos logos para exibição em quadrados
- **2025-05-20**: Alterada ordenação das partidas para mostrar as mais antigas primeiro
- **2025-05-20**: Ajustado espaçamento e padding dos elementos para melhorar a legibilidade

### Modificado
- **2025-05-20**: Ajustada a estrutura visual das partidas para melhorar a apresentação dos logos
- **2025-05-20**: Otimizado o layout para melhorar a experiência do usuário

### Técnico
- **2025-05-20**: Ajustado estilos do Material UI para melhorar a consistência visual
- **2025-05-20**: Otimizado o uso de componentes Box e Avatar para melhorar a exibição dos logos

### Corrigido
- **2025-05-16**: Corrigida consulta SQL na rota `/api/leagues` para usar os nomes corretos das colunas (`country_name` e `country_code` em vez de `country` e `season`)
- **2025-05-16**: Resolvido erro `leagues.map is not a function` implementando tratamento robusto de respostas da API
- **2025-05-16**: Melhorado tratamento de erros em chamadas de API com feedback visual para o usuário
- **2025-05-16**: Corrigido problema de importação do componente Grid do Material UI, substituindo por Stack e Box
- **2025-05-16**: Removida diretiva duplicada `"use client"` no topo do arquivo

### Modificado
- **2025-05-16**: Substituída estrutura de Grid por Stack com layout responsivo
- **2025-05-16**: Aprimorada a tipagem das interfaces para corresponder à estrutura do banco de dados
- **2025-05-16**: Melhorado feedback visual durante estados de carregamento
- **2025-05-16**: Implementado tratamento de erro para consultas SQL falhas

### Técnico
- **2025-05-16**: Atualizada a interface TypeScript para League para corresponder ao esquema do banco de dados
- **2025-05-16**: Adicionada tipagem explícita para parâmetros de erro em blocos try/catch
- **2025-05-16**: Otimizado o código para melhor performance e legibilidade
- **2025-05-16**: Adicionada verificação de formatos de resposta da API para maior robustez

## Notas de Implementação

### Estrutura do Banco de Dados
O aplicativo conecta-se a um banco de dados PostgreSQL com as seguintes tabelas principais:
- `leagues`: Ligas esportivas
- `seasons`: Temporadas associadas a cada liga
- `teams`: Times participantes
- `fixtures`: Partidas/jogos
- `standings`: Classificações dos times

### Componentes Principais
- `historico/page.tsx`: Interface para visualização de dados históricos por liga e temporada
- `api/leagues/route.ts`: Endpoint para buscar ligas disponíveis
- `api/leagues/[leagueId]/seasons/route.ts`: Endpoint para buscar temporadas por liga
- `lib/db.ts`: Configuração e funções de consulta ao banco de dados
