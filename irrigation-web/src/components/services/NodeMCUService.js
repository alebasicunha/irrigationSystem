import $ from 'jquery'

class NodeMCUService {

    buscar(porta) {
        return new Promise(function(resolve, reject) {
            resolve(
                $.ajax({
                    type: "POST",
                    url: NodeMCUService.BASE_URL + "/atualizar" + "/" + porta,
                    success: function (result) {
                        return result;
                    },
                    error: function (result) {
                        console.dir("Erro");
                    }
                })    
            );
        });     
    }

    editar(id) {
        let data = {
            "device": id,
            "status": "Testeee"
        }

        $.ajax({
            type: "POST",
            url: "http://localhost:8080/api/nodeMCU/editarDados",
            //data: data,
            success: function (result) {
                console.log(result);
            },
            error: function () {
                console.dir("Erro");
            }
        });
    }

    deletar(id) {
        $.ajax({
            type: "DELETE",
            url: "http://localhost:8080/api/v1/systems/" + id,
            success: function (result) {
                console.log(result);
            },
            error: function (result) {
                console.dir("Erro:" + result);
            }
        });
    }  
}

NodeMCUService.BASE_URL = "http://localhost:8080/api/nodeMCU";
export default new NodeMCUService();