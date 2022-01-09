import React from 'react';
import Alert from 'react-bootstrap/Alert';

export class AlertaErro extends React.Component {

  constructor(props) {
    super(props);
    this.onDismiss = this.onDismiss.bind(this);
  }

  onDismiss() {
    this.props.callback(false);
  }

  render() {
    if(this.props.visible){
      return (
        <div>
          <Alert className="alerta" variant="danger" onClose={this.onDismiss} dismissible>
            <h2>{this.props.titulo}</h2>
            <hr></hr>
            <p className='text'>{this.props.msg}</p>
          </Alert>
        </div>
      );
    } else return <></>;    
  }
} 