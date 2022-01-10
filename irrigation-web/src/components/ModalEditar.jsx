import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

export class ModalEditar extends React.Component{

    constructor(props) {
        super(props);
        this.onDismiss = this.onDismiss.bind(this);
    }

    onDismiss() {
        var nome = document.getElementById('nomeDispositivo').value;
        var periodoMedicao = document.getElementById('periodoDispositivo').value;
        var limiteMin = document.getElementById('limiteMinDispositivo').value;
        var limiteMax = document.getElementById('limiteMaxDispositivo').value;

        var sistemaAtualizado = {
            nome: nome,
            periodoMedicao: periodoMedicao.slice(0, -1),
            limiteMinimo: limiteMin.slice(0, -1),
            limiteMaximo: limiteMax.slice(0, -1),
            dataLeitura: this.props.sistema.dataLeitura,
            ip: this.props.sistema.ip,
            macAddress: this.props.sistema.macAddress,
            id: this.props.sistema.id,
            umidade: this.props.sistema.umidade
        };
        this.props.callback(false, sistemaAtualizado);
    }

    render() {
        
        if(this.props.visible) {

            return <div>
                    <Modal
                        show={this.props.visible}
                        onHide={this.onDismiss}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter">
                                {this.props.titulo}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <div className="form-group">
                                    <label>Nome</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="nomeDispositivo" 
                                        placeholder="Cozinha"                           
                                        defaultValue={this.props.sistema.nome ? this.props.sistema.nome : this.props.sistema.macAddress}
                                        style={{marginBottom: "20px"}}/>
                                </div>
                                <div className="form-group">
                                    <label>Período de leitura</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="periodoDispositivo" 
                                        placeholder="1h" 
                                        defaultValue={this.props.sistema.periodoMedicao + "h"}
                                        style={{marginBottom: "20px"}}/>
                                </div>
                                <div className="form-group">
                                    <label>Limite mínimo de umidade</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="limiteMinDispositivo" 
                                        placeholder="50%" 
                                        defaultValue={this.props.sistema.limiteMinimo + "%"}
                                        style={{marginBottom: "20px"}}/>
                                </div>                                
                                <div className="form-group">
                                    <label>Limite máximo de umidade</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="limiteMaxDispositivo" 
                                        placeholder="50%" 
                                        defaultValue={this.props.sistema.limiteMaximo + "%"}
                                        style={{marginBottom: "20px"}}/>
                                </div>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.onDismiss} type="submit">Salvar</Button>
                        </Modal.Footer>
                    </Modal>
                </div>;
        } else {
            return <></>;
        }
        
    } 
}