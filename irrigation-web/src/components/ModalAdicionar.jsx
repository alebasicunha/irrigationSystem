import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

export class ModalAdicionar extends React.Component{

    constructor(props) {
        super(props);
        this.onDismiss = this.onDismiss.bind(this);
    }

    onDismiss() {
        var ip = document.getElementById('ipDispositivo').value;
        this.props.callback(false, ip);
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
                                    <label>IP</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="ipDispositivo" 
                                        placeholder="Cozinha"                           
                                        defaultValue={'192.168.15.78'}
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