-- Script de criação do banco de dados EduManage
-- Execute este script após instalar o MySQL

-- Criar o banco de dados se não existir
CREATE DATABASE IF NOT EXISTS edumanage
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Usar o banco de dados
USE edumanage;

-- A partir daqui, as tabelas serão criadas automaticamente pelo Hibernate
-- quando spring.jpa.hibernate.ddl-auto=update estiver configurado
-- Este arquivo pode ser usado para configurações iniciais ou scripts de migração manual
