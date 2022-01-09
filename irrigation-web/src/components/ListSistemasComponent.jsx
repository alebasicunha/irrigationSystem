import React, { Component } from 'react'
import fwService from './services/NodeMCUService';
import dbService from './services/WebServerService';
import { AlertaErro } from './AlertaErro';

class ListSistemasComponent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            sistemas: [],
            alerta: false,
            tituloAlerta: '',
            msgAlerta: '',
        }
        this.adicionar = this.adicionar.bind(this);
        this.atualizarPorId = this.atualizarPorId.bind(this);
        this.editarPorId = this.editarPorId.bind(this);
        this.regarPorId = this.regarPorId.bind(this);
        this.deletarPorId = this.deletarPorId.bind(this);
        this.renderAlerta = this.renderAlerta.bind(this);
    }

    //TODO fazer receber automaticamente a cada 1h do esp8266 depois de adicionar.
            //TODO fazer ele regar automaticamente (vinculado com a requisicao feita pelo cliente - site)
    //TODO editar (modal com formularios) - nao editar: mac, ip.
    //TODO regar
    //TODO alerta de erro qdo nao puder salvar, atualizar, editar, regar, etc.
    //TODO add modal para colocar listar os IPs dos dispositivos conectados a rede wifi    

    componentDidMount(){
        this.buscarTodos();
    } 

    buscarTodos() {
        dbService.buscarTodos().then((res) => {
            console.log(res);
            this.setState({ sistemas: res.data });                
        });
    }

    buscarPorMacAddress(sistema) {
        return dbService.buscarPorMacAddress(sistema.macAddress);
    }

    salvarNovo(sistema) {
        this.buscarPorMacAddress(sistema).then((res) => {
            if(!res.data || this.state.sistemas.length === 0) {
                console.log("Salvou");
                dbService.salvar(sistema).then(() => { 
                    this.buscarTodos()
                }); 
            } else {                
                let msg = "Já existe um dispositovo com o MacAddress: " + sistema.macAddress + ".";
                this.renderAlerta(true, "Erro ao salvar", msg);
                console.log(msg);
            }  
        });
    }

    
    adicionar() {         
        let ip = '192.168.15.78'; //porta 80 eh fixa
        fwService.buscar(ip).then((res) => {
            let resJson = JSON.parse(res);
            resJson = {...resJson, dataLeitura: new Date().getTime()};
            console.log(resJson);
            this.salvarNovo(resJson);         
        })               
    }

    //busca do esp8266 os valores atualizados e atualiza no banco
    atualizarPorId(id, ip) { 
        fwService.buscar(ip).then((res) => {
            let resJson = JSON.parse(res);
            resJson = {...resJson, dataLeitura: new Date().getTime()};
            console.log(resJson); 
            dbService.atualizar(id, resJson).then(() => this.buscarTodos());             
        });
    }

    editarPorId(id) {
    }

    regarPorId(id, ip) {
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
                        <td> {sistema.dataLeitura} </td>
                        <td> {sistema.umidade}% </td>
                        <td>
                            <button onClick={() => this.atualizarPorId(sistema.id, sistema.ip)} className="btn btn-info btn-secondary"> Atualizar </button>
                            <button onClick={() => this.editarPorId(sistema.id)} style={{marginLeft: "10px"}} className="btn btn-info btn-secondary"> Editar </button>
                            <button onClick={() => this.regarPorId(sistema.id, sistema.ip)} style={{marginLeft: "10px"}} className="btn btn-info btn-secondary"> Regar </button>
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
            </div>
        )
    };
}


export default ListSistemasComponent;