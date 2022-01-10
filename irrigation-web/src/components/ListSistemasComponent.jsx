import React, { Component } from 'react'
import fwService from './services/NodeMCUService';
import dbService from './services/WebServerService';
import { AlertaErro } from './AlertaErro';
import { ModalEditar } from './ModalEditar';
import dateFormat from "dateformat";

class ListSistemasComponent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            sistemas: [],
            alerta: false,
            tituloAlerta: '',
            msgAlerta: '',
            modalEditar: false,
            tituloModal: '',
            sistemaSelecionado: null,
        }
        this.adicionar = this.adicionar.bind(this);
        this.atualizarPorIp = this.atualizarPorIp.bind(this);
        this.editarPorId = this.editarPorId.bind(this);
        this.regarPorId = this.regarPorIp.bind(this);
        this.deletarPorId = this.deletarPorId.bind(this);
        this.renderAlerta = this.renderAlerta.bind(this);
        this.renderModal = this.renderModal.bind(this);
        this.onSalvarModal = this.onSalvarModal.bind(this);
    }

    //TODO fazer ele regar automaticamente a cada xh
    //TODO regar manual

    //TODO add modal para colocar listar os IPs dos dispositivos conectados a rede wifi    

    //TODO add um loading
    //TODO testar qdo o esp8266 está desligado.

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
        let ip = '192.168.15.78'; //porta 80 eh fixa
        fwService.buscar(ip).then((res) => {
            let resJson = JSON.parse(res);
            resJson = {...resJson, dataLeitura: new Date().getTime()};
            this.salvarNovo(resJson);         
        })               
    }

    salvarNovo(sistema) {
        dbService.buscarPorMacAddress(sistema.macAddress).then((res) => {
            if(!res.data || this.state.sistemas.length === 0) {
                dbService.salvar(sistema).then(() => { 
                    this.buscarTodos()
                }); 
            } else {                
                let msg = "Já existe um dispositivo com o MacAddress: " + sistema.macAddress + ".";
                this.renderAlerta(true, "Erro ao adicionar dispositivo!", msg);
            }  
        });
    }

    //busca do esp8266 os valores atualizados e salva no banco uma nova entrada
    atualizarPorIp(ip) { 
        fwService.buscar(ip).then((res) => {
            let resJson = JSON.parse(res);
            resJson = {...resJson, dataLeitura: new Date().getTime()};           
            dbService.salvar(resJson).then(() => { 
                this.buscarTodos()
            });    
        });
    }

    //nao precisa do ip na vdd?
    editarPorId(sistema) {
        let nomeOuMacAddr = sistema.nome ? sistema.nome : sistema.macAddress; 
        let tituloModal = "Editar dispositivo: " + nomeOuMacAddr;
        this.renderModal(true, tituloModal, sistema);
    }

    regarPorIp(id, ip) {
        let msgErro = "Não foi possível regar o dispositivo.";
        fwService.regarManual(ip).then((res) => {
            console.log("Regar:");
            res !== "OK" ? this.renderAlerta(true, "Erro ao regar!", msgErro) : console.log(res);
        });
    }

    deletarPorId(id) {
        dbService.deletar(id).then( res => {
            this.setState({sistemas: this.state.sistemas.filter(sistema => sistema.id !== id)});
        });
    }

    renderLinha() {
        const linha = this.state.sistemas.map( sistema =>
            (
                <tr key = {sistema.id}>
                        <td> {sistema.nome ? sistema.nome : sistema.macAddress} </td>   
                        <td> {dateFormat(new Date(sistema.dataLeitura), 'dd/mm/yyyy, h:MM TT')} </td>
                        <td> {sistema.umidade}% </td>
                        <td>
                            <button onClick={() => this.atualizarPorIp(sistema.ip)} className="btn btn-info btn-secondary"> Atualizar </button>
                            <button onClick={() => this.editarPorId(sistema)} style={{marginLeft: "10px"}} className="btn btn-info btn-secondary"> Editar </button>
                            <button onClick={() => this.regarPorIp(sistema.id, sistema.ip)} style={{marginLeft: "10px"}} className="btn btn-info btn-secondary"> Regar </button>
                            <button onClick={() => this.deletarPorId(sistema.id)} style={{marginLeft: "10px"}} className="btn btn-danger"> Deletar </button>
                        </td>
                </tr>
            ));
        return linha;
    };

    renderAlerta(mostrar, titulo, msg) {
        this.setState({alerta: mostrar});
        this.setState({tituloAlerta: titulo});
        this.setState({msgAlerta: msg});
    }

    renderModal(mostrar, titulo, sistema) {
        this.setState({modalEditar: mostrar});
        this.setState({tituloModal: titulo});
        this.setState({sistemaSelecionado: sistema});
    }

    onSalvarModal(mostrar, sistemaSelecionado){        
        this.setState({modalEditar: mostrar});
        this.setState({sistemaSelecionado: sistemaSelecionado});     
        fwService.editar(sistemaSelecionado.ip, sistemaSelecionado).then(() => {
                this.atualizarPorIp(sistemaSelecionado.ip);
        }); 
        
    }

    render() {
        return (
            <div>
                <div><AlertaErro 
                            visible={this.state.alerta} 
                            titulo={this.state.tituloAlerta} 
                            msg={this.state.msgAlerta}
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
                    callback={this.onSalvarModal}
                    sistema={this.state.sistemaSelecionado}
                />
            </div>
        )
    };
}


export default ListSistemasComponent;