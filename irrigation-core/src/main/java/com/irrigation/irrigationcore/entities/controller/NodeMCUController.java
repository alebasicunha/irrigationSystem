package com.irrigation.irrigationcore.entities.controller;

import java.net.URI;
import java.net.URISyntaxException;

import org.json.JSONObject;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("api/nodeMCU")
public class NodeMCUController {
    
    //@RequestMapping("/editarDados")
    @PostMapping("/editarDados")
    public String editarDadosNodeMCU() throws URISyntaxException {
        RestTemplate restTemplate = new RestTemplate();        
        
        String dados = "{ \"device\": \"Oiiii\", \"status\": \"FOOOOI\" }";
        RequestEntity request = RequestEntity
            .post(new URI("http://192.168.15.78:80/body"))
            .body(dados);
        
        ResponseEntity<String> response = restTemplate.exchange(request, String.class);
        ResponseEntity.ok(response);
        return response.getStatusCode().toString();
    }
}
