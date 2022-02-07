import $ from 'jquery'

class NodeMCUService {

    buscar(ip) {
        return new Promise(function(resolve, reject) {
            resolve(
                $.ajax({
                    type: "GET",
                    url: NodeMCUService.BASE_URL + "/buscar/" + ip,
                    success: function (result) {
                        return result;
                    },
                    error: function(error) {                        
                        //alert('Erro');
                        reject(error);
                    }
                })    
            );
        });     
        
    }

    regarManual(ip) {
        return new Promise(function(resolve, reject) {
            resolve(
                $.ajax({
                    type: "POST",
                    url: NodeMCUService.BASE_URL + "/regar/" + ip,
                    success: function (result) {
                        return result;
                    },
                    error: function (error) {
                        reject(error);                    
                    }
                })    
            );
        });     
    }

    editar(ip, data) {
        return new Promise(function(resolve, reject) {
            resolve(
                $.ajax({
                    type: "POST",
                    url: NodeMCUService.BASE_URL + "/editarDados/" + ip,
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(data),
                    success: function (result) {
                        return result;
                    },
                    error: function (error) {
                        reject(error);                     
                    }
                })    
            );
        });     
    }
}

NodeMCUService.BASE_URL = "http://localhost:8080/api/nodeMCU";
export default new NodeMCUService();