import $ from 'jquery'

class NodeMCUService {

    buscar(ip) {
        return new Promise(function(resolve, reject) {
            resolve(
                $.ajax({
                    type: "POST",
                    url: NodeMCUService.BASE_URL + "/atualizar/" + ip,
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
}

NodeMCUService.BASE_URL = "http://localhost:8080/api/nodeMCU";
export default new NodeMCUService();