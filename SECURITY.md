# Segurança do AYANODE v1.3

**Destinado somente à execução local por um operador confiável.** O servidor de IA escuta em `127.0.0.1` e inclui verificações de host, origem e tipo de conteúdo. Não possui autenticação multiusuário, isolamento de agentes, quotas globais, TLS ou protocolos de distribuição remota.

Não publique a porta `8787` por encaminhamento de roteador, túnel ou proxy público. Um site malicioso pode tentar explorar serviços locais; a checagem de origem é uma defesa parcial, não substitui autenticação ou firewalls. Nunca execute este gateway compartilhando a conta do computador com usuários não confiáveis.

Use chaves de API somente em `.env` (ignorado pelo Git) ou variáveis de ambiente. Nunca insira chaves na interface, `config/agents.json`, arquivos HTML, logs ou issues. Revogue imediatamente tokens expostos. A execução de testes usa credenciais falsas, não reais.

As respostas podem conter dados sensíveis; a exportação de auditoria mantém conteúdo textual da tarefa. Trate essas exportações como arquivos privados. Serviços externos recebem o objetivo e resultados intermediários em solicitações à API; consulte os termos e políticas de retenção dos respectivos provedores.

O software não executa ferramentas propostas pelo modelo. Ainda assim, as saídas intermediárias podem conter instruções maliciosas ou informações incorretas; elas são explicitamente identificadas como não confiáveis no prompt da próxima etapa. Esta defesa não substitui isolamento e validação.

Relate vulnerabilidades sem publicar segredos ou dados de usuários em issues públicas.
