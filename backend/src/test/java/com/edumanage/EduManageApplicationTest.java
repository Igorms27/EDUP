package com.edumanage;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Teste básico para verificar se a aplicação Spring Boot carrega corretamente.
 */
@SpringBootTest
class EduManageApplicationTest {

    @Test
    void contextLoads() {
        // Verifica se o contexto do Spring Boot é carregado com sucesso
        assertTrue(true);
    }
}
