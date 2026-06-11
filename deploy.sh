#!/bin/bash

# Ensure we are in the correct directory
cd "$(dirname "$0")"

# Load environment variables from data/config.json if present
if [ -f data/config.json ]; then
    echo "🔑 Carregando configurações de ambiente seguras do config.json..."
    if [ -z "$GITHUB_TOKEN" ]; then
        export GITHUB_TOKEN=$(node -pe "try { require('./data/config.json').GITHUB_TOKEN } catch(e) { '' }")
    fi
    if [ -z "$GITHUB_USER" ]; then
        export GITHUB_USER=$(node -pe "try { require('./data/config.json').GITHUB_USER } catch(e) { '' }")
    fi
    if [ -z "$GITHUB_EMAIL" ]; then
        export GITHUB_EMAIL=$(node -pe "try { require('./data/config.json').GITHUB_EMAIL } catch(e) { '' }")
    fi
fi

# Load environment variables from .env if present as a secondary backup
if [ -f .env ]; then
    echo "🔑 Carregando configurações de ambiente seguras de .env..."
    # Parse keys while keeping existing environment variables
    if [ -z "$GITHUB_TOKEN" ]; then
        export GITHUB_TOKEN=$(grep -E "^GITHUB_TOKEN=" .env | cut -d'=' -f2- | tr -d '"'\')
    fi
    if [ -z "$GITHUB_USER" ]; then
        export GITHUB_USER=$(grep -E "^GITHUB_USER=" .env | cut -d'=' -f2- | tr -d '"'\')
    fi
    if [ -z "$GITHUB_EMAIL" ]; then
        export GITHUB_EMAIL=$(grep -E "^GITHUB_EMAIL=" .env | cut -d'=' -f2- | tr -d '"'\')
    fi
fi

# Ensure mandatory configurations are set
if [ -z "$GITHUB_TOKEN" ] || [ -z "$GITHUB_USER" ] || [ -z "$GITHUB_EMAIL" ]; then
    echo "❌ Erro: GITHUB_TOKEN, GITHUB_USER ou GITHUB_EMAIL não configurados no ambiente, no data/config.json ou no .env"
    exit 1
fi

REPO_NAME="KN"
TARGET_REPO="github.com/${GITHUB_USER}/${REPO_NAME}.git"
LOG_FILE="data/deploy_log.txt"

# Ensure data directory exists
mkdir -p data

# Redirect all stdout and stderr to LOG_FILE and also print to console
exec > >(tee -i "$LOG_FILE") 2>&1

echo "=========================================================="
echo "🚀 Iniciando Processo de Build e Deploy Seguro para GitHub"
echo "=========================================================="
echo "Data e Hora: $(date '+%Y-%m-%d %H:%M:%S')"
echo "Usuário Atual: $(whoami)"
echo "Diretório de Trabalho: $(pwd)"

# Adicionar safe directory para evitar bloqueio do Git em contêineres Docker
echo "⚙️ Configurando safe.directory no Git corporativo..."
git config --global --add safe.directory "*"

# 1. Executar Compilação de Produção
echo "📦 Executando compilação do front-end (Vite)..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erro: O build do projeto falhou. Corrija os erros e tente novamente."
    exit 1
fi
echo "✅ Build concluído com sucesso!"

# 2. Re-inicializar repositório Git local do zero para garantir histórico limpo e livre de segredos expostos
echo "⚙️ Purgando metadados git antigos para garantir conformidade..."
rm -rf .git

echo "⚙️ Inicializando novo repositório Git local limpo..."
git init

# Configurar credenciais do Git para este repositório local
git config user.name "$GITHUB_USER"
git config user.email "$GITHUB_EMAIL"

# 3. Adicionar arquivos e preparar commit
echo "📂 Preparando arquivos para commit..."
git add .

# Remover arquivos indesejados da árvore do git caso existam
git rm -r --cached node_modules/ 2>/dev/null
git rm -r --cached dist/ 2>/dev/null

COMMIT_MSG="Auto-deploy KoreNexus: Atualização do sistema e otimizações [ $(date '+%Y-%m-%d %H:%M:%S') ]"
echo "✏️ Criando commit com mensagem: '$COMMIT_MSG'..."
git commit -m "$COMMIT_MSG" || echo "⚠️ Nenhum arquivo pendente para comitar."

# 4. Configurar URL remota com Token embutido de forma segura
echo "🔗 Configurando repositório remoto..."
REMOTE_URL="https://${GITHUB_USER}:${GITHUB_TOKEN}@${TARGET_REPO}"

# Adicionar nova origem com autenticação
git remote add origin "$REMOTE_URL"

# Garantir que a ramificação principal chama-se 'main'
git branch -M main

# 5. Efetuar Push das alterações
echo "📤 Enviando alterações para o GitHub (branch: main)..."
git push -u origin main --force

if [ $? -eq 0 ]; then
    echo "=========================================================="
    echo "🎉 SUCESSO! Código enviado com êxito para o GitHub!"
    echo "🔗 Repositório: https://github.com/${GITHUB_USER}/${REPO_NAME}"
    echo "=========================================================="
else
    echo "❌ Erro ao enviar os arquivos para o repositório remoto."
    exit 1
fi
