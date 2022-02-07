package com.irrigation.irrigationcore.entities.controller;

import java.net.ConnectException;
import java.net.URI;
import java.net.URISyntaxException;

import com.irrigation.irrigationcore.entities.IrrigationSystem;

import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("api/nodeMCU")
public class NodeMCUController {

    private String urlBase = "http://";

    @RequestMapping("/editarDados/{ip}")
    public String editarDadosNodeMCU(@PathVariable String ip, @RequestBody String sistema) throws URISyntaxException {
        RestTemplate restTemplate = new RestTemplate(); 
        
        String path = urlBase + ip + ":80" + "/editarDados";     
        URI uri = new URI(path);

        RequestEntity request = RequestEntity
            .post(uri)
            .body(sistema);
        System.out.println("\n\n\nSistema enviado:" + sistema);

        ResponseEntity<String> response = restTemplate.exchange(request, String.class);
        ResponseEntity.ok(response);
        System.out.println(response.getBody());
        return response.getStatusCode().toString();
    }

    @RequestMapping("/buscar/{ip}")
    public String buscarPorIP(@PathVariable String ip) throws URISyntaxException, ConnectException {
        RestTemplate restTemplate = new RestTemplate();   
        String path = urlBase + ip + ":80" + "/atualizarDados";     
        URI uri = new URI(path);
        
        HttpEntity<String> requestEntity = new HttpEntity<>(null); 
        ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.GET, requestEntity, String.class);
     
        ResponseEntity.ok(response);
        return response.getBody().toString();
    }

    @RequestMapping("/regar/{ip}")
    public String regarManualmente(@PathVariable String ip) throws URISyntaxException {
        RestTemplate restTemplate = new RestTemplate();   
        String path = urlBase + ip + ":80" + "/regarManual";     
        URI uri = new URI(path);

        HttpEntity<String> requestEntity = new HttpEntity<>(null); 
        ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.POST, requestEntity, String.class);
     
        ResponseEntity.ok(response);
        return response.getBody();
    }
}
