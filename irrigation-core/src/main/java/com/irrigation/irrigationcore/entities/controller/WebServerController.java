package com.irrigation.irrigationcore.entities.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.sound.sampled.EnumControl;

import com.irrigation.irrigationcore.entities.IrrigationSystem;
import com.irrigation.irrigationcore.exceptions.ResourceNotFoundException;
import com.irrigation.irrigationcore.repository.IrrigationSystemsRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("api/v1")
public class WebServerController {

    @Autowired
    IrrigationSystemsRepository repository;

    //create
    @PostMapping("/systems")
    public IrrigationSystem createSystem(@RequestBody IrrigationSystem system) {
        System.out.println("Criou sistema novo: " + system.getMacAddress());
        if(system.getDataLeitura() == null) {
            Long timestamp = new Date().getTime();
            system.setDataLeitura(timestamp);
        }
        return repository.save(system);
    }

    //get most recent entries of all systems 
    @GetMapping("/systems")
    public List<IrrigationSystem> getAllSystems() {
        List<IrrigationSystem> sistemas = repository.findAll();
        return this.buscarMaisRecente(sistemas);
    } 
    
    private List<IrrigationSystem> buscarMaisRecente(List<IrrigationSystem> sistemas) {
        Map<String, List<IrrigationSystem>> sistemasPorMacAddr = new HashMap<>();
        
        sistemasPorMacAddr = sistemas.stream().collect(
            Collectors.groupingBy(IrrigationSystem::getMacAddress, HashMap::new, Collectors.toCollection(ArrayList::new)));
        
        sistemas = new ArrayList<IrrigationSystem>();       
        for(Map.Entry<String, List<IrrigationSystem>> s : sistemasPorMacAddr.entrySet()) {    
            s.getValue().sort((o1,o2) -> o2.getDataLeitura().compareTo(o1.getDataLeitura()));
            
            System.out.println(s.getKey() + " - ");
            s.getValue().forEach(c -> System.out.println("id: " + c.getId() + " data: " + c.getDataLeitura() + " ip: " + c.getIp()));
            
            sistemas.add(s.getValue().get(0));
        }
        return sistemas;
    }

    //get system by id
    @GetMapping("/systems/{id}")
    public ResponseEntity<IrrigationSystem> getSystemById(@PathVariable Long id) {
        IrrigationSystem system = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Sistema " + id + "nao existe"));
        return ResponseEntity.ok(system);
    }

    //get system by mac
    @GetMapping("/systems/mac/{mac}")
    public IrrigationSystem getSystemByMacAddress(@PathVariable String mac) {
        List<IrrigationSystem> sistemas = repository.findAll();
        System.out.println("Sistemas:"+ sistemas.size());

        IrrigationSystem encontrado = sistemas.stream().filter(s -> s.getMacAddress().equals(mac)).findFirst().orElse(null);
        System.out.println("Mac:"+ mac);
        return encontrado;       
    }

    //update
    @PutMapping("/systems/{id}")
    public ResponseEntity<IrrigationSystem> updateSystem(@PathVariable Long id, @RequestBody IrrigationSystem novoSystem) {
        IrrigationSystem system = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Sistema " + id + "nao existe"));
        system.setNome(novoSystem.getNome());
        system.setDataLeitura(novoSystem.getDataLeitura());
        system.setMacAddress(novoSystem.getMacAddress());
        system.setUmidade(novoSystem.getUmidade());

        IrrigationSystem updateSystem = repository.save(system);
        return ResponseEntity.ok(updateSystem);
    }

    //delete
    @DeleteMapping("/systems/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteSystem(@PathVariable Long id) {
        IrrigationSystem system = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Sistema " + id + "nao existe"));

        Map<String, Boolean> response = new HashMap<>();    
        repository.delete(system);
        response.put("deleted", true);
        
        return ResponseEntity.ok(response);
    }

}
