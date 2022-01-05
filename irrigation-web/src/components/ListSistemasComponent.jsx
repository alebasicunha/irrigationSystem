import React, { useState, useEffect } from 'react'
import service from './services/NodeMCUService';

function ListSistemasComponent() {
    const apiUrl = 'https://api.thingspeak.com/channels/1554431/fields/1.json?results=1';

    //array de objetos
    const [sistemas, setSistemas] = useState([
        {id: null, data: '', umidade: ''},
    ]);
  
    useEffect(() => {    
      fetch(apiUrl)
        .then((res) => res.json())
        .then((resJson) => {
          console.log(resJson);
          setSistemas(
            [{
              id: resJson.channel.id, 
              umidade: resJson.feeds[0].field1, 
              data: resJson.feeds[0].created_at
            }]);
        });
    }, []);

    function onClickAtualizar(id) {
        service.atualizar(id).then(function(json) {
            console.log(json); 
        });
    }

    function onClickEditar(id) {
        service.editar(id);
    }

    function onClickDeletar(id) {
        service.deletar(id);
    }

    function renderLinha() {
        const linha = sistemas.map( sistema =>
            (
                <tr key = {sistema.id}>
                        <td> {sistema.id} </td>   
                        <td> {sistema.data} </td>
                        <td> {sistema.umidade}% </td>
                        <td>
                            <button onClick={() => onClickAtualizar(sistema.id)} className="btn btn-info btn-secondary"> Atualizar </button>
                            <button onClick={() => onClickEditar(sistema.id)} style={{marginLeft: "10px"}} className="btn btn-info btn-secondary"> Editar </button>
                            <button style={{marginLeft: "10px"}} className="btn btn-info btn-secondary"> Regar </button>
                            <button onClick={() => onClickDeletar(sistema.id)} style={{marginLeft: "10px"}} className="btn btn-danger"> Deletar </button>
                        </td>
                </tr>
        ));
        return linha;
    };

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
                        {renderLinha()}
                    </tbody>
                </table>
            </div>
        </div>
    )
}


export default ListSistemasComponent;