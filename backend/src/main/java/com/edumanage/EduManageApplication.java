package com.edumanage;

/**
 * Classe principal da aplicação Spring Boot.
 * Inicializa e executa a aplicação backend do sistema EduManage,
 * configurando automaticamente o contexto Spring e habilitando
 * a auto-configuração do Spring Boot.
 */
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EduManageApplication {

    public static void main(String[] args) {
        SpringApplication.run(EduManageApplication.class, args);
    }
}
