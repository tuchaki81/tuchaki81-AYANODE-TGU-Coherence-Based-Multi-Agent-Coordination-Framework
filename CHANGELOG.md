# Histórico de versões

## v1.3.0 — 09/11/2026

- Gateway local de modelos reais, `agents.html` + endpoints `/api/status`, `/api/test` e `/api/run`.
- Adaptadores HTTP de OpenAI Responses, Anthropic Messages, Gemini generateContent e Ollama chat.
- Configuração de perfis especializados via `.env` ou `config/agents.json` e execução de workflows de 5 etapas.
- Proteção de chaves no backend, limitação a localhost, checagem de origem, confirmação de custos e sem retries automáticos.
- Suite de testes com provedores simulados, sem uso de APIs reais.
- Preserva o coordenador v1.2 e o laboratório TGU/ICOER v1.1.

## v1.2.0

- Núcleo experimental multiagente, policies ICOER/least_loaded, DAG de tarefas, auditoria e dashboard com executores simulados.

## v1.1.0

- Correção do gradiente, laboratório matemático e relay GUN experimental.
