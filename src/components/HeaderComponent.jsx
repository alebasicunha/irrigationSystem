import React, { Component } from 'react'

class HeaderComponent extends Component {
    constructor(props) {
        super(props)

        this.state = { }
    }

    render() {
        return (
                <header>                    
                    <nav className="navbar navbar-expand-md navbar-dark header d-flex justify-content-between" >
                        <div className="container">
                            <a className="navbar-brand header-text" href="#home" style={{color:"#D7F0D1"}}>
                                <img src={"../logoLeaf.png"} width="40" height="40" className="d-inline-block align-bottom" alt=""/>
                                Irrigador
                            </a>
                            <form className="d-inline-flex my-2 my-lg-0">
                                <input className="form-control mx-sm-2 input" type="search" placeholder="Buscar" aria-label="Buscar"/>
                                <button className="btn btn-primary my-2 my-sm-0" type="submit">Buscar</button>
                            </form>
                        </div>
                    </nav>
                </header>
        )
    }
}

export default HeaderComponent