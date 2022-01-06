import React, { Component } from 'react'
import service from './services/NodeMCUService';

class ListSistemasComponent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            sistemas: [
                   {id: null, data: '', umidade: ''},
                ]
        }
        this.atualizar = this.atualizarStateSistema.bind(this);
    }

    componentDidMount(){
        service.atualizar().then((res) => {
            let resJson = JSON.parse(res);
            console.log(resJson); 
            this.setState({ sistemas: this.atualizarStateSistema(resJson) });                
        });
    } 

    atualizarLinha(id) { 
        service.atualizar().then((res) => {
            let resJson = JSON.parse(res);
            console.log(resJson); 
            this.setState({ sistemas: this.atualizarStateSistema(resJson) });                
        });
    }

    atualizarStateSistema(resJson) {
        return [{
            id: resJson.macAddress,
            umidade: resJson.umidade,
            data: new Date().toISOString()
        }]
    }

    onClickEditar(id) {
        service.editar(id);
    }

    onClickDeletar(id) {
        service.deletar(id);
    }

    renderLinha() {
        const linha = this.state.sistemas.map( sistema =>
            (
                <tr key = {sistema.id}>
                        <td> {sistema.id} </td>   
                        <td> {sistema.data} </td>
                        <td> {sistema.umidade}% </td>
                        <td>
                            <button onClick={() => this.atualizarLinha(sistema.id)} className="btn btn-info btn-secondary"> Atualizar </button>
                            <button onClick={() => this.onClickEditar(sistema.id)} style={{marginLeft: "10px"}} className="btn btn-info btn-secondary"> Editar </button>
                            <button style={{marginLeft: "10px"}} className="btn btn-info btn-secondary"> Regar </button>
                            <button onClick={() => this.onClickDeletar(sistema.id)} style={{marginLeft: "10px"}} className="btn btn-danger"> Deletar </button>
                        </td>
                </tr>
            ));
        return linha;
    };

    render() {
        return (
            <div>
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