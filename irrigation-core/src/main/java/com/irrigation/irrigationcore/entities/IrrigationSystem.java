package com.irrigation.irrigationcore.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="irrigation_system")
public class IrrigationSystem {

    @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
    @Column(name = "external_id")
	private Long externalId;

	@Column(name = "nome")
	private String nome;

	@Column(name = "data_leitura")
	private Long dataLeitura;
	
	@Column(name = "umidade")
	private Integer umidade;
	
	public IrrigationSystem() {
		
	}

    public IrrigationSystem(Long externalId, String nome, Long dataLeitura, Integer umidade) {
        super();
        this.externalId = externalId;
        this.nome = nome;
        this.dataLeitura = dataLeitura;
        this.umidade = umidade;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Long getExternalId() {
        return externalId;
    }

    public void setExternalId(Long externalId) {
        this.externalId = externalId;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Long getDataLeitura() {
        return dataLeitura;
    }

    public void setDataLeitura(Long dataLeitura) {
        this.dataLeitura = dataLeitura;
    }

    public Integer getUmidade() {
        return umidade;
    }

    public void setUmidade(Integer umidade) {
        this.umidade = umidade;
    }
}
