-- Script de inicialização do banco de dados EduManage
-- Execute este script após instalar o MySQL

-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS edumanage
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Usar o banco de dados
USE edumanage;

-- Verificar se o banco foi criado
SHOW DATABASES LIKE 'edumanage';

-- Mensagem de sucesso
SELECT 'Banco de dados edumanage criado com sucesso!' AS Status;
