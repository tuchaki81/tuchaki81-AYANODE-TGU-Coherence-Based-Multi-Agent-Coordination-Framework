@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo ERRO: Instale Node.js 20 ou superior em https://nodejs.org/
  pause
  exit /b 1
)
if not exist .env (
  copy .env.example .env >nul
  echo Criado .env padrao para Ollama local. Edite-o para usar OpenAI, Gemini ou Claude.
)
echo.
echo AYANODE TGU v1.3 - Gateway de agentes de IA reais
 echo Abra http://127.0.0.1:8787/ no navegador
 echo Pressione Ctrl+C para encerrar o servidor.
echo.
node server\agents-api.js
pause
