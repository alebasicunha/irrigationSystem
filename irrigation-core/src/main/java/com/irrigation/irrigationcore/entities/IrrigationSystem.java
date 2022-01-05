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
	
    @Column(name = "mac_address")
	private String macAddress;

	@Column(name = "nome")
	private String nome;

	@Column(name = "data_leitura")
	private Long dataLeitura;
	
	@Column(name = "umidade")
	private Float umidade;

    @Column(name = "limite_minimo")
	private Integer limiteMinimo;

    @Column(name = "limite_maximo")
	private Integer limiteMaximo;

    @Column(name = "periodo_medicao")
	private Integer periodoMedicao;
	
	public IrrigationSystem() {
		
	}

    public IrrigationSystem(String nome, Long dataLeitura, Integer limiteMinimo,
            Integer limiteMaximo, Integer periodoMedicao) {
        this.nome = nome;
        this.dataLeitura = dataLeitura;
        this.limiteMinimo = limiteMinimo;
        this.limiteMaximo = limiteMaximo;
        this.periodoMedicao = periodoMedicao;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getMacAddress() {
        return macAddress;
    }

    public void setMacAddress(String macAddress) {
        this.macAddress = macAddress;
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

    public Float getUmidade() {
        return umidade;
    }

    public void setUmidade(Float umidade) {
        this.umidade = umidade;
    }

    public Integer getLimiteMinimo() {
        return limiteMinimo;
    }

    public void setLimiteMinimo(Integer limiteMinimo) {
        this.limiteMinimo = limiteMinimo;
    }

    public Integer getLimiteMaximo() {
        return limiteMaximo;
    }

    public void setLimiteMaximo(Integer limiteMaximo) {
        this.limiteMaximo = limiteMaximo;
    }

    public Integer getPeriodoMedicao() {
        return periodoMedicao;
    }

    public void setPeriodoMedicao(Integer periodoMedicao) {
        this.periodoMedicao = periodoMedicao;
    }  
}
