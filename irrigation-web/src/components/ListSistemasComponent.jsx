import React, { Component } from 'react'
import fwService from './services/NodeMCUService';
import dbService from './services/WebServerService';

class ListSistemasComponent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            sistemas: []
        }
        this.adicionar = this.adicionar.bind(this);
        this.atualizarPorId = this.atualizarPorId.bind(this);
        this.editarPorId = this.editarPorId.bind(this);
        this.regarPorId = this.regarPorId.bind(this);
        this.deletarPorId = this.deletarPorId.bind(this);
    }

    //TODO fazer receber automaticamente a cada 1h do esp8266 depois de adicionar (ou mesmo sem adicionar).

    componentDidMount(){
        this.buscarTodos();
    } 

    buscarTodos() {
        dbService.buscarTodos().then((res) => {
            console.log(res);
            this.setState({ sistemas: res.data });                
        });
    }

    //TODO add modal para colocar a porta
    //TODO verificar se ja nao existe com o mesmo MAC
    adicionar() {         
        let porta = '80';
        fwService.buscar(porta).then((res) => {
            let resJson = JSON.parse(res);
            resJson = {...resJson, dataLeitura: new Date().getTime()};
            console.log(resJson);
            dbService.salvar(resJson).then(() => this.buscarTodos());             
        })               
    }

    //busca do esp8266 os valores atualizados e atualiza no banco
    atualizarPorId(id, porta) { 
        fwService.buscar(porta).then((res) => {
            let resJson = JSON.parse(res);
            console.log(resJson); 
            dbService.atualizar(id, resJson).then(() => this.buscarTodos());             
        });
    }

    //TODO modal para editar tudo menos MAC e porta
    editarPorId(id) {
    }

    regarPorId(id, porta) {
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
                            <button onClick={() => this.atualizarPorId(sistema.id, sistema.porta)} className="btn btn-info btn-secondary"> Atualizar </button>
                            <button onClick={() => this.editarPorId(sistema.id)} style={{marginLeft: "10px"}} className="btn btn-info btn-secondary"> Editar </button>
                            <button onClick={() => this.regarPorId(sistema.id, sistema.porta)} style={{marginLeft: "10px"}} className="btn btn-info btn-secondary"> Regar </button>
                            <button onClick={() => this.deletarPorId(sistema.id)} style={{marginLeft: "10px"}} className="btn btn-danger"> Deletar </button>
                        </td>
                </tr>
            ));
        return linha;
    };

    render() {
        return (
            <div>
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