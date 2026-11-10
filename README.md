# ⵔ◯ᘛ9ᘚ◯ⵔ AYANODE TGU v1.3 — Agentes de IA reais

**Projeto AYA · TGU · ICOER · AYANODE**

> **v1.3:** gateway local para utilizar **modelos reais** (OpenAI Responses, Anthropic Messages, Gemini generateContent e Ollama chat) como executores do coordenador multiagente AYANODE. O módulo ICOER da v1.2 continua sendo um critério **experimental** de roteamento, não evidência de inteligência ou consciência emergente.

## O que foi implementado

- **Quatro adaptadores reais HTTP**: OpenAI, Anthropic/Claude, Google/Gemini e Ollama (modelo executado no computador).
- **Chaves exclusivamente no servidor** via `.env`/ambiente. O navegador nunca recebe nem solicita tokens.
- **Agentes especializados configuráveis**, com capacidades declaradas, disponibilidade e vetores de afinidade informacional opcionais.
- **Workflow de cinco etapas** (contextualização → análise → redação → revisão → síntese), com passagem de resultados entre agentes, roteamento, métricas e auditoria.
- **Painel local** com status de configuração, teste de conexão (uma chamada) e execução de fluxo (até cinco chamadas), mediante consentimento explícito sobre custos.
- **Comparação de roteamento** AYANODE/ICOER × controle de menor ocupação. Uma instância por capacidade não é suficiente para demonstrar diferença entre políticas: configure agentes concorrentes com a mesma capacidade para comparação válida.
- **Testes com respostas falsas** dos provedores: verificam payloads, parse, rota, erros, encadeamento, controle de acesso e ausência de exposição das chaves.
- **Preserva a v1.2** (`coordination.html` e `src/coordination.js`) e o laboratório matemático v1.1 (`index.html`).

## Início rápido no Windows 11

1. Instale [Node.js 20+](https://nodejs.org/). Abra PowerShell ou Prompt de Comando na pasta extraída.
2. Copie `.env.example` para `.env`:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Escolha como conectar:

   **Opção A — IA local com Ollama (sem chave de API):** instale [Ollama](https://ollama.com/download), baixe o modelo com `ollama pull llama3.2` e garanta que o serviço esteja ativo (porta padrão `11434`). O `.env` de exemplo já está configurado para esse modelo. *É preciso instalar o Ollama e baixar o modelo; não está incluído no ZIP.*

   **Opção B — API de nuvem:** obtenha uma chave de API do provedor e altere o `.env` — exemplo usando OpenAI para as cinco especialidades:

   ```ini
   AYANODE_DEFAULT_PROVIDER=openai
   AYANODE_DEFAULT_MODEL=gpt-5-mini
   OPENAI_API_KEY=COLOQUE_SUA_CHAVE_AQUI
   ```

   **Opção C — Agentes de provedores diferentes:** configure variáveis por papel (`AYANODE_RESEARCH_PROVIDER`, `AYANODE_RESEARCH_MODEL`, etc.) ou copie `config/agents.example.json` para `config/agents.json` e edite a lista de agentes. Veja o [guia completo](docs/AGENTES_REAIS.md).

4. Abra o servidor de agentes reais:

   ```powershell
   npm start
   ```

5. Abra **http://127.0.0.1:8787/**, marque a confirmação de custos, clique em **Testar conexão** para pelo menos um agente e depois em **Iniciar fluxo com agentes reais**.

### Verificações sem credenciais

```bash
npm run check
npm test
```

Esses testes usam *mocks* de resposta e **não gastam tokens nem fazem chamadas reais a provedores**. `npm install` **não é necessário** para o gateway de agentes reais — somente para executar o relay GUN legado:

```bash
npm install
npm run start:relay
```

O relay GUN legado utiliza a porta `8765`, enquanto o gateway de IA da v1.3 utiliza a porta `8787`.

## Arquitetura

```text
Interface localhost (agents.html)
  └─ POST /api/run (confirmação explícita)
       └─ Coordinator v1.2 (src/coordination.js)
            ├─ registro e verificação de capacidades
            ├─ política ICOER + disponibilidade / baseline menor ocupação
            └─ tarefas e dependências (DAG)
                 └─ Adapter HTTP (server/providers.js)
                       ├─ OpenAI Responses API
                       ├─ Anthropic Messages API
                       ├─ Gemini generateContent
                       └─ Ollama /api/chat
```

O limite inicial de geração é `AYANODE_MAX_OUTPUT_TOKENS=1500` por chamada (ajustável entre 100 e 4096).

Os cinco papéis podem ser distribuídos entre modelos distintos, mas **não há descoberta de agentes remotos, servidores A2A, execução de ferramentas, MCP, acesso à web ou autonomia externa** nesta versão. Os modelos geram texto sob chamada do coordenador. “Pesquisa” significa contextualização com o conhecimento disponível ao modelo, não busca atualizada na Internet.

## Medições e limitações científicas

O indicador ICOER é calculado a partir de vetores configurados para os agentes e tarefas. Esses vetores no exemplo são **declarados manualmente**; não são embeddings semânticos validados. A afinidade não é um indicador independente de competência ou correção factual. Para investigar seu valor, compare várias alternativas por capacidade, em sementes e tarefas controladas, com critérios de qualidade externos e custos/latência.

Os testes automatizados verificam **funcionamento interno**, não conexão real com suas contas ou superioridade de desempenho. **Nenhuma chamada a APIs reais foi executada na geração deste pacote.** A API de cada provedor pode sofrer mudanças e os modelos disponíveis variam por conta.

## Segurança e custos

- Gateway escuta **somente `127.0.0.1`**, possui checagem de origem, host e `Content-Type` e não dá acesso a arquivos de segredos.
- `.env`, `config/agents.json`, logs e auditorias privadas são ignorados pelo Git.
- Somente requisições explícitas com `confirmCosts:true` disparam modelos. O servidor permite uma execução por vez.
- Cada fluxo faz até **cinco chamadas pagas** se usar modelos hospedados, mais eventuais testes de conexão.
- As etapas são **não idempotentes**, sem repetição automática, para evitar cobranças duplicadas.
- Não execute o gateway em rede pública. O servidor não tem autenticação, TLS, quotas por usuário, isolamento forte ou proteção para internet aberta.
- Os prompts e resultados podem conter informações pessoais. Consulte as políticas de retenção e privacidade dos provedores antes de enviar dados.

## Estrutura da v1.3

```text
agents.html + assets/               # interface local dos agentes reais
server/providers.js                 # quatro adaptadores de APIs
server/agent-runtime.js             # perfis, especialidades, workflow
server/agents-api.js                # HTTP gateway localhost
server/env.js                       # carregador de .env
config/agents.example.json          # exemplo multi-fornecedor
src/coordination.js                 # motor da v1.2 preservado
coordination.html                   # painel de simulação v1.2
index.html                          # laboratório TGU v1.1
server/relay.js                     # relay GUN legado independente
tests/                              # testes matemáticos, coordenação, adaptadores e HTTP
docs/AGENTES_REAIS.md                # configuração detalhada
```

## Documentação oficial dos provedores

- [OpenAI Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create)
- [Anthropic Messages API](https://platform.claude.com/docs/en/api/http/messages/create)
- [Gemini generateContent](https://ai.google.dev/gemini-api/docs/generate-content)
- [Ollama API](https://docs.ollama.com/api/chat)

## Licença e autoria

Mantida a reserva de direitos da v1.2 (`LICENSE`). A disponibilidade pública do repositório **não autoriza redistribuição sob uma licença aberta** sem decisão explícita dos titulares.

**Projeto AYA / Henry Matuchaki · 2026**  
**Referências teóricas:** [TGU](https://doi.org/10.20944/preprints202502.0514.v3) · [ICOER](https://doi.org/10.20944/preprints202507.0290.v2)

> **AYANODE — inteligência distribuída como investigação, coordenação como infraestrutura.**

**Atalho Windows:** depois de configurar o `.env`, você também pode executar `INICIAR-WINDOWS.bat` em vez de digitar `npm start`.
