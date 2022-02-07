import React, { Component } from 'react'
import fwService from './services/NodeMCUService';
import dbService from './services/WebServerService';
import dateFormat from "dateformat";
import { AlertaErro } from './AlertaErro';
import { ModalEditar } from './ModalEditar';
import { ModalGrafico } from './ModalGrafico';
import { ModalAdicionar } from './ModalAdicionar';

class ListSistemasComponent extends Component {

    //TODO deletar deve apagar todas as entradas daquele dispositivo.
    constructor(props) {
        super(props)

        this.state = {
            sistemas: [],
            alerta: false,
            tituloAlerta: '',
            varianteAlerta: '',
            msgAlerta: '',
            modalEditar: false,
            modalGraficos: false,
            modalAdicionar: false,
            tituloModal: '',
            sistemaSelecionado: null,
        }
        this.adicionar = this.adicionar.bind(this);
        this.atualizarPorIp = this.atualizarPorIp.bind(this);
        this.editarPorId = this.editarPorId.bind(this);
        this.regarPorId = this.regarPorIp.bind(this);
        this.deletarPorId = this.deletarPorId.bind(this);
        this.renderAlerta = this.renderAlerta.bind(this);
        this.renderModalEditar = this.renderModalEditar.bind(this);
        this.onSalvarModalEditar = this.onSalvarModalEditar.bind(this);
        this.renderModalGraficos = this.renderModalGraficos.bind(this);
        this.onFecharModalGraficos = this.onFecharModalGraficos.bind(this);
        this.renderModalAdicionar = this.renderModalAdicionar.bind(this);
        this.onSalvarModalAdicionar = this.onSalvarModalAdicionar.bind(this);
    }

    componentDidMount(){
        this.buscarTodos();
    } 

    buscarTodos() {
        dbService.buscarTodos().then((res) => {
            console.log('Buscar todos');
            console.log(res);
            this.setState({ sistemas: res.data });                            
        });
    }

    //so eh possivel adicionar uma vez cada dispositivo.
    adicionar() {          
        let tituloModal = "Adicionar novo dispositivo: ";
        this.renderModalAdicionar(true, tituloModal);
    }

    //busca do esp8266 os valores atualizados e salva no banco uma nova entrada
    atualizarPorIp(ip) { 
        fwService.buscar(ip).then((res) => {
            let resJson = JSON.parse(res);
            resJson = {...resJson, dataLeitura: new Date().getTime()};           
            dbService.salvar(resJson).then(() => { 
                this.buscarTodos()
            }).catch((error) => {
                var msg = "Nenhum dispositivo com o IP " + ip + "foi encontrado. Verifique se o dispositivo está ligado corretamente.";
                this.renderAlerta(true, "Erro ao adicionar dispositivo!", msg, "danger");
            });
        });
    }

    editarPorId(sistema) {
        let nomeOuMacAddr = sistema.nome; 
        let tituloModal = "Editar dispositivo: " + nomeOuMacAddr;
        this.renderModalEditar(true, tituloModal, sistema);
    }

    regarPorIp(ip) {
        let msgErro = "Não foi possível regar o dispositivo.";
        let msgSucesso = "A regagem manual foi realizada com sucesso!";
        fwService.regarManual(ip).then((res) => {
            if(res !== "OK") { 
                this.renderAlerta(true, "Erro ao regar!", msgErro, "danger");
            } else { 
                this.renderAlerta(true, "Sucesso!!!", msgSucesso, "success");
            }
            this.buscarTodos();
            document.getElementById(ip+'btn').blur();
        }).catch((error) => {
            var msg = "Nenhum dispositivo com o IP " + ip + 
                " foi encontrado. Verifique se o dispositivo está ligado corretamente.";
            this.renderAlerta(true, "Erro ao adicionar dispositivo!", msg, "danger");
        });
    }

    deletarPorId(id) {
        dbService.deletar(id).then( res => {
            this.setState({sistemas: this.state.sistemas.filter(sistema => sistema.id !== id)});
        });
    }

    graficosPorId(sistema) {
        let nomeOuMacAddr = sistema.nome; 
        let tituloModal = "Dados do dispositivo: " + nomeOuMacAddr;
        this.renderModalGraficos(true, tituloModal, sistema);
    }

    renderLinha() {
        const linha = this.state.sistemas.map( sistema =>
            (
                <tr key = {sistema.id}>
                        <td> <a href="/#" onClick={() => this.graficosPorId(sistema)}>{sistema.nome}</a> </td>   
                        <td> {dateFormat(new Date(sistema.dataLeitura), 'dd/mm/yyyy, h:MM TT')} </td>
                        <td> {sistema.umidade}% </td>
                        <td>
                            <button onClick={() => this.atualizarPorIp(sistema.ip)} className="btn btn-info btn-secondary"> Atualizar </button>
                            <button onClick={() => this.editarPorId(sistema)} style={{marginLeft: "10px"}} className="btn btn-info btn-secondary"> Editar </button>
                            <button onClick={() => this.regarPorIp(sistema.ip)} style={{marginLeft: "10px"}} id={sistema.ip+"btn"} className="btn btn-info btn-secondary"> Regar </button>
                            <button onClick={() => this.deletarPorId(sistema.id)} style={{marginLeft: "10px"}} className="btn btn-danger"> Deletar </button>
                        </td>
                </tr>
            ));
        return linha;
    };

    renderAlerta(mostrar, titulo, msg, variante) {
        this.setState({alerta: mostrar});
        this.setState({tituloAlerta: titulo});
        this.setState({msgAlerta: msg});
        this.setState({varianteAlerta: variante});
    }

    renderModalEditar(mostrar, titulo, sistema) {
        this.setState({modalEditar: mostrar});
        this.setState({tituloModal: titulo});
        this.setState({sistemaSelecionado: sistema});
    }

    onSalvarModalEditar(mostrar, sistemaSelecionado) {        
        this.setState({modalEditar: mostrar});
        this.setState({sistemaSelecionado: sistemaSelecionado});     
        fwService.editar(sistemaSelecionado.ip, sistemaSelecionado).then(() => {
                this.atualizarPorIp(sistemaSelecionado.ip);
        }).catch((error) => {
            var msg = "Nenhum dispositivo com o IP " + sistemaSelecionado.ip + 
                " foi encontrado. Verifique se o dispositivo está ligado corretamente.";
            this.renderAlerta(true, "Erro ao adicionar dispositivo!", msg, "danger");
        });
    }

    renderModalGraficos(mostrar, titulo, sistema) {        
        this.setState({tituloModal: titulo});
        dbService.buscarPorMacAddress(sistema.macAddress).then((res) => {
            console.log('Buscar todos de um mac');
            console.log(res);
            this.setState({ sistemaSelecionado: res.data });                
        }).then(() => this.setState({modalGraficos: mostrar}));
    }

    onFecharModalGraficos(mostrar) {       
        this.setState({modalGraficos: mostrar});        
    }

    renderModalAdicionar(mostrar, titulo) {  
        this.setState({modalAdicionar: mostrar});      
        this.setState({tituloModal: titulo});
    }

    onSalvarModalAdicionar(mostrar, ip) {        
        this.setState({modalAdicionar: mostrar});     
        fwService.buscar(ip).then((res) => {
            let resJson = JSON.parse(res);
            resJson = {...resJson, dataLeitura: new Date().getTime()};
            this.salvarNovo(resJson);         
        }).catch((error) => {
            var msg = "Nenhum dispositivo com o IP " + ip + 
                " foi encontrado. Verifique se o dispositivo está ligado corretamente.";
            this.renderAlerta(true, "Erro ao adicionar dispositivo!", msg, "danger");
        });
    }

    salvarNovo(sistema) {
        dbService.buscarPorMacAddress(sistema.macAddress).then((res) => {
            if(!res.length === 0 || this.state.sistemas.length === 0) {
                dbService.salvar(sistema).then(() => { 
                    this.buscarTodos()
                }); 
            } else {                
                let msg = "Já existe um dispositivo com o MacAddress: " + sistema.macAddress + ".";
                this.renderAlerta(true, "Erro ao adicionar dispositivo!", msg, "danger");
            }  
        });
    }

    render() {
        return (
            <div>
                <div><AlertaErro 
                            visible={this.state.alerta} 
                            titulo={this.state.tituloAlerta} 
                            msg={this.state.msgAlerta}
                            variante={this.state.varianteAlerta}
                            callback={this.renderAlerta}/>
                </div>
                <div className = "row">
                    <button onClick={() => this.adicionar()} className="btn btn-info btn-secondary"> Adicionar </button>
                </div>
                <div className = "row">
                    <table className = "table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th> Nome</th>
                                <th> Data</th>
                                <th> Umidade</th>
                                <th> Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderLinha()}
                        </tbody>
                    </table>
                </div>

                <ModalEditar
                    visible={this.state.modalEditar} 
                    titulo={this.state.tituloModal}    
                    callback={this.onSalvarModalEditar}
                    sistema={this.state.sistemaSelecionado}
                />
                <ModalGrafico
                    visible={this.state.modalGraficos} 
                    titulo={this.state.tituloModal}    
                    callback={this.onFecharModalGraficos}
                    sistemas={this.state.sistemaSelecionado}
                />
                <ModalAdicionar
                    visible={this.state.modalAdicionar} 
                    titulo={this.state.tituloModal}    
                    callback={this.onSalvarModalAdicionar}
                />
            </div>
        )
    };
}


export default ListSistemasComponent;