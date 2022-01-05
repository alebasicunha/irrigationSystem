package com.irrigation.irrigationcore.entities.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
public class SystemController {

    @Autowired
    IrrigationSystemsRepository repository;

    //get all systems
    @GetMapping("/systems")
    public List<IrrigationSystem> getAllSystems() {
        return repository.findAll();
    }

    //create
    @PostMapping("/systems")
    public IrrigationSystem createSystem(@RequestBody IrrigationSystem system) {
        return repository.save(system);
    }

    //get system by id
    @GetMapping("/systems/{id}")
    public ResponseEntity<IrrigationSystem> getSystemById(@PathVariable Long id) {
        IrrigationSystem system = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Sistema " + id + "nao existe"));
        return ResponseEntity.ok(system);
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
