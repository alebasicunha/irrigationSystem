package com.irrigation.irrigationcore.repository;

import org.springframework.stereotype.Repository;
import com.irrigation.irrigationcore.entities.IrrigationSystem;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface IrrigationSystemsRepository extends JpaRepository<IrrigationSystem, Long> {
    
}
