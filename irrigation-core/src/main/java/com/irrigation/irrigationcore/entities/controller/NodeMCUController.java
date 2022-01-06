package com.irrigation.irrigationcore.entities.controller;

import java.net.URI;
import java.net.URISyntaxException;

import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.http.RequestEntity.HeadersBuilder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("api/nodeMCU")
public class NodeMCUController {

    private String urlBase = "http://192.168.15.78:";

    //TODO colocar id do nodeMCU no caminho da requisicao
    
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

    @RequestMapping("/atualizar/{porta}")
    public String atualizarDadosNodeMCU(@PathVariable String porta) throws URISyntaxException {
        RestTemplate restTemplate = new RestTemplate();        
        URI uri = new URI(urlBase + porta + "/atualizarDados");

        HttpEntity<String> requestEntity = new HttpEntity<>(null); 
        ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.GET, requestEntity, String.class);
     
        ResponseEntity.ok(response);
        return response.getBody().toString();
    }


}
