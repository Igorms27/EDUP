package com.edumanage.controller;

/**
 * Controller de teste e verificação de saúde da aplicação.
 * Fornece endpoints simples para verificar se a API está funcionando corretamente,
 * incluindo mensagem de boas-vindas e endpoint de health check.
 */
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HelloController {

    @GetMapping("/hello")
    public Map<String, Object> hello() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Bem-vindo ao EduManage API!");
        response.put("status", "success");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "EduManage Backend");
        return response;
    }
}

