# Odin - Sistema de Predição de Futebol ⚽

Sistema avançado de predição de resultados de futebol desenvolvido em Next.js com TypeScript, integrando análise histórica, cache Redis, e interface de simulação de apostas.

## 🚀 Funcionalidades

### 📊 Sistema de Predição
- **Análise Cronológica**: Processa jogos do mais antigo para o mais novo, simulando cenário real
- **Predição Histórica**: Para cada partida, usa apenas o histórico anterior àquele jogo
- **Validação Automática**: Compara predições com resultados reais e calcula acurácia
- **Cache Inteligente**: Redis com fallback para memória para performance otimizada

### 🎯 Interface de Simulação
- **Carteira Virtual**: Sistema de apostas simuladas com saldo e estatísticas
- **Visualização de Predições**: Cards com informações detalhadas de cada predição
- **Dashboard de Métricas**: Estatísticas em tempo real de acurácia e performance
- **Integração Visual**: Predições destacadas na interface de apostas

### 🛠️ Tecnologias

- **Frontend**: Next.js 14, TypeScript, Material-UI
- **Backend**: Node.js, PostgreSQL, Redis
- **Cache**: Redis com Docker, fallback para memória
- **Análise**: HistoricalAnalyzer customizado
- **Containerização**: Docker para Redis

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── api/prediction/           # APIs do sistema de predição
│   │   ├── analyze/              # Análise e geração de predições
│   │   ├── predictions/          # Busca de predições
│   │   └── validation/           # Validação e métricas
│   ├── components/prediction/    # Componentes React
│   │   ├── PredictionCard.tsx    # Card de predição
│   │   └── MetricsDashboard.tsx  # Dashboard de métricas
│   └── (DashboardLayout)/dashboards/simular-apostar/
│       └── page.tsx              # Página principal de simulação
├── utils/
│   ├── prediction/               # Lógica de predição
│   │   ├── HistoricalAnalyzer.ts # Analisador histórico
│   │   └── types.ts              # Tipos TypeScript
│   └── cache/
│       └── RedisCache.ts         # Sistema de cache Redis
```

## 🔧 Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- Docker (para Redis)

### 1. Clone o repositório
```bash
git clone https://github.com/Marinasantosrocha/Odin_versao_prevista.git
cd Odin_versao_prevista
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Redis via Docker
```bash
docker run -d -p 6379:6379 --name redis-predicao --restart unless-stopped redis:latest
```

### 4. Configure as variáveis de ambiente
Crie um arquivo `.env.local`:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=football_data
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
REDIS_DB=0

# Prediction Settings
PREDICTION_CACHE_TTL=3600
MODEL_RETRAIN_INTERVAL=86400
```

### 5. Execute o projeto
```bash
npm run dev
```

## 📊 Como Usar

1. **Acesse a página de simulação**: `/dashboards/simular-apostar`
2. **Selecione liga e temporada**: Use os dropdowns para escolher os dados
3. **Gere predições**: Clique em "Gerar Predições" para análise cronológica
4. **Simule apostas**: Clique nas odds para apostar nos resultados
5. **Acompanhe métricas**: Veja estatísticas em tempo real na carteira virtual

## 🧠 Algoritmo de Predição

O sistema utiliza um algoritmo que considera:

- **Forma Recente** (40%): Últimos 5 jogos de cada time
- **Histórico H2H** (30%): Confrontos diretos anteriores
- **Vantagem de Casa** (20%): Performance em casa vs fora
- **Média de Gols** (10%): Estatísticas ofensivas/defensivas

### Exemplo de Predição
```typescript
{
  fixture_id: 12345,
  predicted_result: 'HOME',
  confidence: 0.75,
  factors: {
    recent_form: { home: 0.8, away: 0.4 },
    h2h_history: { home_wins: 3, draws: 1, away_wins: 1 },
    home_advantage: 0.2,
    goals_average: { home: 2.1, away: 1.3 }
  },
  actual_result: 'HOME',
  is_correct: true
}
```

## 📈 Métricas e Validação

- **Acurácia Geral**: Percentual de predições corretas
- **Predições por Time**: Performance específica por equipe
- **Confiança Média**: Nível de certeza das predições
- **ROI Simulado**: Retorno sobre investimento das apostas

## 🔄 Cache e Performance

O sistema implementa cache em duas camadas:
1. **Redis**: Cache principal para alta performance
2. **Memória**: Fallback automático quando Redis não disponível

## 📝 Documentação Adicional

- `Respostas_do_Usuario_Predicao_Futebol.md`: Requisitos detalhados
- `SISTEMA_PREDICAO_FUTEBOL.md`: Documentação técnica

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.

## 👥 Autores

- **Marina Santos Rocha** - Desenvolvimento inicial - [@Marinasantosrocha](https://github.com/Marinasantosrocha)

---

⚽ **Odin - Predições Inteligentes para o Futebol** ⚽

---

# Documentação Original Next.js

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
