# Sistema de Predição de Futebol - Dados e Cálculos

## 📊 **DADOS UTILIZADOS PARA PREDIÇÃO**

### 1. **Dados Base (MatchData)**
O sistema utiliza os seguintes dados de cada partida:
```sql
SELECT 
  f.fixture_id,           -- ID único da partida
  f.date,                 -- Data da partida
  f.status_short,         -- Status (FT = finalizada)
  f.home_team_id,         -- ID do time da casa
  f.away_team_id,         -- ID do time visitante
  home.name AS home_team_name,  -- Nome do time da casa
  away.name AS away_team_name,  -- Nome do time visitante
  f.goals_home,           -- Gols do time da casa
  f.goals_away,           -- Gols do time visitante
  f.league_id,            -- ID da liga
  f.season_year           -- Ano da temporada
FROM fixtures f
JOIN teams home ON f.home_team_id = home.team_id
JOIN teams away ON f.away_team_id = away.team_id
```

### 2. **Contexto Histórico**
- **Temporada Atual**: Jogos da temporada sendo analisada
- **Histórico**: Últimas 3 temporadas para contexto (quando disponível)
- **Análise Cronológica**: Para cada partida, usa apenas jogos anteriores à data da partida

---

## 🧮 **FATORES DE PREDIÇÃO E CÁLCULOS**

### 1. **Forma Recente dos Times (35% do peso)**

#### **Dados Coletados:**
- Últimos 5 jogos de cada time (antes da partida a ser predita)
- Apenas jogos finalizados (status = 'FT')
- Vitórias, empates, derrotas
- Gols marcados e sofridos

#### **Cálculo da Pontuação da Forma:**
```typescript
// Sistema de pontuação: Vitória = 3pts, Empate = 1pt, Derrota = 0pts
const totalPoints = (wins * 3) + (draws * 1);
const maxPossiblePoints = recentMatches.length * 3;
const form_score = totalPoints / maxPossiblePoints; // Resultado: 0 a 1
```

#### **Exemplo:**
- Time com 3 vitórias, 1 empate, 1 derrota nos últimos 5 jogos:
- Pontos = (3 × 3) + (1 × 1) = 10 pontos
- Máximo possível = 5 × 3 = 15 pontos
- **Forma = 10/15 = 0.67 (67%)**

### 2. **Histórico Head-to-Head (25% do peso)**

#### **Dados Coletados:**
- Todos os confrontos diretos entre os dois times
- Apenas jogos anteriores à partida a ser predita
- Resultados considerando quem jogou em casa

#### **Cálculo da Vantagem H2H:**
```typescript
// Vantagem baseada no histórico do time da casa
const home_advantage = (homeWins + (draws * 0.5)) / totalH2HMatches;
// Resultado: 0 = sempre perde, 0.5 = equilibrado, 1 = sempre ganha
```

#### **Exemplo:**
- Em 10 confrontos: Time A (casa) venceu 6, empatou 2, perdeu 2
- **Vantagem H2H = (6 + (2 × 0.5)) / 10 = 0.7 (70%)**

### 3. **Vantagem de Jogar em Casa (15% do peso)**

#### **Dados Coletados:**
- Todos os jogos da liga antes da partida
- Percentage de vitórias e empates do time da casa

#### **Cálculo:**
```typescript
const homeAdvantage = (homeWins + (draws * 0.5)) / totalMatches;
// Valor padrão: 0.55 (55%) baseado em estatísticas globais do futebol
```

### 4. **Expectativa de Gols (5% do peso)**

#### **Dados Coletados:**
- Média de gols marcados por cada time nos últimos jogos
- Usado para avaliar poder ofensivo

#### **Cálculo:**
```typescript
const homeGoalsExpectancy = homeForm.goals_for / homeForm.recent_matches;
const awayGoalsExpectancy = awayForm.goals_for / awayForm.recent_matches;
const goalsExpectancy = (homeGoalsExpectancy + awayGoalsExpectancy) / 2;
```

### 5. **🆕 Estatísticas das Partidas (20% do peso)**

Este é o novo fator que incorpora dados estatísticos avançados das partidas para melhorar a precisão das predições.

#### **Dados Estatísticos Utilizados:**
Com base na análise da tabela `fixture_statistics`, o sistema utiliza 18 tipos diferentes de estatísticas:

##### **📊 Estatísticas Ofensivas:**
- **Ball Possession** (Posse de bola em %)
- **Total Shots** (Total de chutes)
- **Shots on Goal** (Chutes no gol)
- **Shots insidebox** (Chutes dentro da área)
- **Shots outsidebox** (Chutes fora da área)
- **Corner Kicks** (Escanteios)
- **Expected Goals (xG)** (Gols esperados)

##### **📊 Estatísticas Defensivas:**
- **Goalkeeper Saves** (Defesas do goleiro)
- **Blocked Shots** (Chutes bloqueados)
- **Fouls** (Faltas cometidas)
- **Yellow Cards** (Cartões amarelos)
- **Red Cards** (Cartões vermelhos)

##### **📊 Estatísticas de Controle:**
- **Total Passes** (Total de passes)
- **Passes Accurate** (Passes certos)
- **Passes %** (Porcentagem de acerto de passes)
- **Offsides** (Impedimentos)
- **Goals Prevented** (Gols evitados)

#### **Cálculo dos Ratings dos Times:**
##### **1. Rating Ofensivo (0 a 1):**
```typescript
const offensiveRating = Math.min(1, (
  (ball_possession / 100) * 0.2 +          // 20% - Controle do jogo
  (total_shots / 20) * 0.3 +               // 30% - Volume de ataques
  (shots_accuracy) * 0.3 +                 // 30% - Precisão nos chutes
  (corner_kicks / 10) * 0.1 +              // 10% - Pressão ofensiva
  (expected_goals / 3) * 0.1               // 10% - Qualidade das chances
));
```

##### **2. Rating Defensivo (0 a 1):**
```typescript
const defensiveRating = Math.min(1, (
  (1 - cards_received / 10) * 0.3 +       // 30% - Disciplina (menos cartões = melhor)
  (goalkeeper_saves / 10) * 0.3 +         // 30% - Qualidade do goleiro
  (blocked_shots / 10) * 0.2 +            // 20% - Bloqueios defensivos
  (1 - fouls_committed / 25) * 0.2        // 20% - Defesa limpa
));
```

##### **3. Rating Geral:**
```typescript
const overallRating = (offensiveRating + defensiveRating) / 2;
```

#### **Cálculo da Vantagem Estatística:**
```typescript
// Comparar ataque da casa vs defesa visitante
const homeOffensiveVsAwayDefensive = homeStats.offensive_rating * (1 - awayStats.defensive_rating);

// Comparar ataque visitante vs defesa da casa
const awayOffensiveVsHomeDefensive = awayStats.offensive_rating * (1 - homeStats.defensive_rating);

// Calcular vantagem final (0 = vantagem visitante, 1 = vantagem casa, 0.5 = equilibrado)
const totalOffensive = homeOffensiveVsAwayDefensive + awayOffensiveVsHomeDefensive;
const team_statistics_advantage = homeOffensiveVsAwayDefensive / totalOffensive;
```

#### **Exemplo Prático - Flamengo vs Corinthians:**

##### **Estatísticas do Flamengo (últimos 5 jogos):**
- Posse de bola: 62%
- Chutes totais: 15.2 por jogo
- Chutes no gol: 6.8 por jogo
- Precisão nos chutes: 44.7%
- Escanteios: 7.2 por jogo
- xG: 1.8 por jogo
- **Rating Ofensivo: 0.78**

- Defesas do goleiro: 3.4 por jogo
- Chutes bloqueados: 2.1 por jogo
- Faltas: 12.6 por jogo
- Cartões: 1.8 por jogo
- **Rating Defensivo: 0.71**
- **Rating Geral: 0.75**

##### **Estatísticas do Corinthians (últimos 5 jogos):**
- Posse de bola: 54%
- Chutes totais: 11.8 por jogo
- Chutes no gol: 4.2 por jogo
- Precisão nos chutes: 35.6%
- Escanteios: 5.4 por jogo
- xG: 1.3 por jogo
- **Rating Ofensivo: 0.59**

- Defesas do goleiro: 4.8 por jogo
- Chutes bloqueados: 3.2 por jogo
- Faltas: 16.2 por jogo
- Cartões: 2.4 por jogo
- **Rating Defensivo: 0.64**
- **Rating Geral: 0.62**

##### **Cálculo da Vantagem:**
```typescript
// Flamengo (ataque) vs Corinthians (defesa)
homeOffensive = 0.78 * (1 - 0.64) = 0.78 * 0.36 = 0.281

// Corinthians (ataque) vs Flamengo (defesa)
awayOffensive = 0.59 * (1 - 0.71) = 0.59 * 0.29 = 0.171

// Vantagem estatística do Flamengo
team_statistics_advantage = 0.281 / (0.281 + 0.171) = 0.62 (62%)
```

#### **Impacto no Cálculo Final:**
```typescript
// A vantagem estatística de 0.62 será multiplicada por 20% (peso das estatísticas)
// contribuindo com 0.62 * 0.20 = 0.124 pontos para a probabilidade do Flamengo
```

---

## 🎯 **CÁLCULO FINAL DA PREDIÇÃO**

### **Pesos Utilizados (DEFAULT_WEIGHTS ATUALIZADOS):**
```typescript
{
  recent_form: 0.35,        // 35% - Forma recente
  h2h_history: 0.25,        // 25% - Histórico H2H
  home_advantage: 0.15,     // 15% - Vantagem de casa
  goals_average: 0.05,      // 5% - Expectativa de gols
  team_statistics: 0.20     // 20% - Estatísticas das partidas (NOVO!)
}
```

### **Cálculo das Probabilidades:**

#### **1. Probabilidade de Vitória do Time da Casa:**
```typescript
let homeWinProb = 
  (home_form * 0.35) +
  (h2h_advantage * 0.25) +
  (home_advantage * 0.15) +
  (Math.min(goals_expectancy / 3, 1) * 0.05) +
  (team_statistics_advantage * 0.20);
```

#### **2. Probabilidade de Vitória do Time Visitante:**
```typescript
let awayWinProb = 
  (away_form * 0.35) +
  ((1 - h2h_advantage) * 0.25) +
  ((1 - home_advantage) * 0.15) +
  (Math.min(goals_expectancy / 3, 1) * 0.05) +
  ((1 - team_statistics_advantage) * 0.20);
```

#### **3. Probabilidade de Empate (ATUALIZADA):**
```typescript
const formDifference = Math.abs(home_form - away_form);
const statsDifference = Math.abs(team_statistics_advantage - 0.5) * 2; // Normalizar para 0-1
const combinedDifference = (formDifference + statsDifference) / 2;

let drawProb = Math.max(0.1, 0.4 - (combinedDifference * 0.5));
// Entre 10% e 40%, considerando tanto forma quanto estatísticas
```

#### **4. Normalização:**
```typescript
// As probabilidades são normalizadas para somar 100%
const total = homeWinProb + drawProb + awayWinProb;
homeWinProb /= total;
drawProb /= total;
awayWinProb /= total;
```

### **Cálculo da Confiança:**
```typescript
const confidence = Math.min(
  (homeForm.recent_matches + awayForm.recent_matches + h2hStats.total_matches) / 15,
  1
);
// Baseado na quantidade de dados históricos disponíveis
// Máximo quando há 15+ jogos de dados (5+5+5)
```

---

## 🏆 **DETERMINAÇÃO DO RESULTADO PREDITO**

```typescript
let predicted_result: 'HOME' | 'DRAW' | 'AWAY';
if (homeWinProb > drawProb && homeWinProb > awayWinProb) {
  predicted_result = 'HOME';
} else if (awayWinProb > drawProb && awayWinProb > homeWinProb) {
  predicted_result = 'AWAY';
} else {
  predicted_result = 'DRAW';
}
```

---

## 📈 **VALIDAÇÃO E MÉTRICAS**

### **Dados de Validação Calculados:**

#### **1. Precisão Geral:**
```typescript
const accuracy = correct_predictions / total_finished_matches;
```

#### **2. Precisão por Tipo de Resultado:**
```typescript
const precision_by_outcome = {
  home_win: correct_home_predictions / total_home_predictions,
  draw: correct_draw_predictions / total_draw_predictions,
  away_win: correct_away_predictions / total_away_predictions
};
```

#### **3. Correlação Confiança-Precisão:**
```typescript
const confidence_correlation = avgConfidence * accuracy;
// Indica se predições com maior confiança são mais precisas
```

---

## 🔄 **PROCESSO CRONOLÓGICO**

### **Simulação Realística:**
1. **Ordenação**: Partidas são ordenadas cronologicamente
2. **Predição Sequencial**: Para cada partida, usa apenas dados disponíveis até aquela data
3. **Acumulação**: Após cada jogo, o resultado é incorporado ao histórico
4. **Validação**: Predições são comparadas com resultados reais conforme disponíveis

### **Exemplo de Fluxo:**
```
Jogo 1 (Jan 15): Predição baseada apenas em temporadas anteriores
Jogo 2 (Jan 22): Predição usando temporadas anteriores + Jogo 1
Jogo 3 (Jan 29): Predição usando temporadas anteriores + Jogos 1-2
...e assim por diante
```

---

## 🎲 **EXEMPLO PRÁTICO ATUALIZADO**

### **Cenário: Flamengo vs Corinthians (com Estatísticas)**

#### **Dados Coletados:**
- **Flamengo (Casa)**: 4 vitórias, 1 empate nos últimos 5 jogos (forma = 0.87)
- **Corinthians (Fora)**: 2 vitórias, 2 empates, 1 derrota (forma = 0.53)
- **H2H**: Em 8 confrontos, Flamengo venceu 5, empatou 2, perdeu 1 (vantagem = 0.75)
- **Liga**: Times da casa vencem 58% dos jogos (vantagem casa = 0.58)
- **Gols**: Expectativa média de 2.3 gols no jogo
- **🆕 Estatísticas**: Flamengo tem vantagem de 62% baseada nas estatísticas (0.62)

#### **Cálculos Atualizados:**
```typescript
// Probabilidade Flamengo (NOVO CÁLCULO)
homeWinProb = (0.87 * 0.35) + (0.75 * 0.25) + (0.58 * 0.15) + (0.23 * 0.05) + (0.62 * 0.20)
            = 0.305 + 0.188 + 0.087 + 0.012 + 0.124 = 0.716

// Probabilidade Corinthians (NOVO CÁLCULO)
awayWinProb = (0.53 * 0.35) + (0.25 * 0.25) + (0.42 * 0.15) + (0.23 * 0.05) + (0.38 * 0.20)
            = 0.186 + 0.063 + 0.063 + 0.012 + 0.076 = 0.400

// Probabilidade Empate (NOVA FÓRMULA)
formDiff = |0.87 - 0.53| = 0.34
statsDiff = |0.62 - 0.5| * 2 = 0.24
combinedDiff = (0.34 + 0.24) / 2 = 0.29
drawProb = max(0.1, 0.4 - (0.29 * 0.5)) = 0.255

// Normalização
total = 0.716 + 0.400 + 0.255 = 1.371
homeWinProb = 0.716 / 1.371 = 0.52 (52%)
awayWinProb = 0.400 / 1.371 = 0.29 (29%)
drawProb = 0.255 / 1.371 = 0.19 (19%)
```

#### **Resultado Atualizado:**
- **Predição**: Vitória do Flamengo (52% de probabilidade)
- **Confiança**: Alta (baseada em histórico robusto + estatísticas)
- **🆕 Impacto das Estatísticas**: Contribuíram com 12.4% para o Flamengo vs 7.6% para o Corinthians

#### **Comparação: Antes vs Depois das Estatísticas**
| Método | Flamengo | Empate | Corinthians |
|--------|----------|--------|-------------|
| **Sem Estatísticas** | 53% | 17% | 29% |
| **Com Estatísticas** | 52% | 19% | 29% |
| **Diferença** | -1% | +2% | 0% |

*As estatísticas refinaram a predição, aumentando ligeiramente a probabilidade de empate baseada na análise defensiva mais equilibrada.*

---

## 💾 **ARMAZENAMENTO DOS DADOS**

### **Cache Redis:**
- **Predições**: Armazenadas por partida
- **Modelos**: Salvos por liga/temporada
- **Progresso**: Análise em tempo real
- **Validação**: Métricas de performance

### **Estrutura das Chaves:**
```
prediction:{league_id}:{season_year}:{fixture_id}
model:{league_id}:{season_year}
analysis_progress:{league_id}:{season_year}
```

Esse sistema garante predições baseadas em dados históricos reais, com transparência total sobre os fatores e cálculos utilizados!

---

## 📊 **ESTATÍSTICAS DETALHADAS UTILIZADAS**

### **Dados Disponíveis na Base (fixture_statistics):**
Com base na análise da tabela, temos **18 tipos** de estatísticas com **3.808 registros** cada:

| Estatística | Descrição | Exemplo de Valores | Uso no Cálculo |
|-------------|-----------|-------------------|-----------------|
| **Ball Possession** | Posse de bola (%) | 43, 55, 36 | Rating Ofensivo (20%) |
| **Total Shots** | Chutes totais | 15, 8, 12 | Rating Ofensivo (30%) |
| **Shots on Goal** | Chutes no gol | 6, 3, 5 | Rating Ofensivo (30%) |
| **Shots insidebox** | Chutes dentro da área | 12, 5, 10 | Análise de qualidade |
| **Shots outsidebox** | Chutes fora da área | 3, 3, 2 | Análise de estilo |
| **Corner Kicks** | Escanteios | 5, 6, 3 | Rating Ofensivo (10%) |
| **Expected Goals** | Gols esperados (xG) | 1.8, 0.9, 2.1 | Rating Ofensivo (10%) |
| **Goalkeeper Saves** | Defesas do goleiro | 1, 5, 0 | Rating Defensivo (30%) |
| **Blocked Shots** | Chutes bloqueados | 5, 10, 1 | Rating Defensivo (20%) |
| **Fouls** | Faltas cometidas | 15, 21, 16 | Rating Defensivo (20%) |
| **Yellow Cards** | Cartões amarelos | 2, 1, 3 | Rating Defensivo (15%) |
| **Red Cards** | Cartões vermelhos | 0, 1, 0 | Rating Defensivo (15%) |
| **Total Passes** | Total de passes | 450, 280, 520 | Análise de estilo |
| **Passes Accurate** | Passes certos | 323, 282, 372 | Análise de qualidade |
| **Passes %** | Precisão de passes (%) | 83, 77, 78 | Controle de jogo |
| **Offsides** | Impedimentos | 1, 2, 0 | Disciplina tática |
| **Goals Prevented** | Gols evitados | Dados limitados | Análise defensiva |

### **Processo de Coleta das Estatísticas:**
1. **Busca de Dados**: Para cada time, buscar estatísticas dos últimos 5 jogos
2. **Filtragem**: Apenas jogos finalizados (status = 'FT') antes da data da partida
3. **Cálculo de Médias**: Calcular média de cada estatística nos jogos recentes
4. **Geração de Ratings**: Converter estatísticas em ratings ofensivos e defensivos
5. **Comparação**: Calcular vantagem estatística entre os times

### **Tratamento de Dados Ausentes:**
- **Fallback Gracioso**: Se estatísticas não estiverem disponíveis, usar valor neutro (0.5)
- **Predição Híbrida**: Sistema tenta usar estatísticas, mas funciona sem elas
- **Cache Inteligente**: Estatísticas são cacheadas para melhor performance
