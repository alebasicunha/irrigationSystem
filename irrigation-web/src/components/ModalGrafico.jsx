import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import dateFormat from "dateformat";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
  } from "recharts";

const toPercent = (decimal) => `${(decimal)}%`;
const dateFormatterTooltip = (item) => dateFormat(new Date(item), 'dd/mm h:MM TT');
const dateFormatterX = (item) => dateFormat(new Date(item), 'mmm');

export class ModalGrafico extends React.Component{

    constructor(props) {
        super(props);
        this.onDismiss = this.onDismiss.bind(this);
    }

    onDismiss() {
        this.props.callback(false);
    }

    formatarDados() {
        let sistemas = [];
        let hoje = new Date();
        let offSet = (24*60*60*1000) * 30; //30 dias
        this.props.sistemas.sort((a, b) => a.dataLeitura - b.dataLeitura);
        
        this.props.sistemas.forEach( sistema => {
            if (hoje.getTime() - sistema.dataLeitura <= offSet) {
                let dadoAtual = {
                    dataLeitura: sistema.dataLeitura,
                    umidade: sistema.umidade,
                }
                sistemas.push(dadoAtual); 
            }
        });
        return sistemas;
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
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart                                    
                                    data={this.formatarDados()}
                                    margin={{    
                                        top: 10,
                                        right: 30,
                                        bottom: 10
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        interval={12}
                                        dataKey="dataLeitura" 
                                        tickFormatter={dateFormatterX} 
                                        />
                                    <YAxis tickFormatter={toPercent} domain={[0, 100]} />
                                    <Tooltip formatter={toPercent} labelFormatter={dateFormatterTooltip} />
                                    <Line
                                        type="monotone"
                                        dataKey="umidade"
                                        stroke="#82ca9d"
                                        dot={false}
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.onDismiss} type="submit">Fechar</Button>
                        </Modal.Footer>
                    </Modal>
                </div>;
        } else {
            return <></>;
        }
        
    } 
}