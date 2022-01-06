import axios from 'axios'

class WebServerService {

    buscarTodos() {
        return axios.get(WebServerService.BASE_URL);
    }

    salvar(sistema) {  
        return axios.post(WebServerService.BASE_URL, sistema);
    } 

    atualizar(id, sistema) {
        return axios.put(WebServerService.BASE_URL + '/' + id, sistema);
    }
    
    deletar(id) {
        return axios.delete(WebServerService.BASE_URL + "/" + id);
    }
}

WebServerService.BASE_URL = "http://localhost:8080/api/v1/systems";
export default new WebServerService();