-- Arquivo de dados iniciais para popular o banco de dados com usuários padrão.
-- Cria usuários de exemplo para coordenadores, professores e alunos para testes e desenvolvimento.
-- Utiliza INSERT IGNORE para evitar erros caso os registros já existam.

INSERT IGNORE INTO coordinators (id, name, email, password)
VALUES (1, 'Coordenador Padrão', 'coordenador@teste.com', '123456');

INSERT IGNORE INTO professors (id, name, email, password)
VALUES (1, 'Professor Padrão', 'professor@teste.com', '123456');

INSERT IGNORE INTO students (id, name, email, password)
VALUES (1, 'Aluno Padrão', 'aluno@teste.com', '123456');
