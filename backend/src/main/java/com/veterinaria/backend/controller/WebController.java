package com.veterinaria.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller // <--- ¡IMPORTANTE! Usamos @Controller, no @RestController
public class WebController {
    // Opcional: Redirige la URL raíz (http://localhost:8080/) a la tabla
    @GetMapping("/")
    public String index() {
        return "redirect:indexmod.html";
    }
}