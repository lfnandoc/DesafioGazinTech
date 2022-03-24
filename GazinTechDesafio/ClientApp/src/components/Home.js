import React, { Component } from 'react';
import { Link } from "react-router-dom";

export class Home extends Component {
    static displayName = Home.name;

    render() {
        return (
            <div>
                <h1>Bem vindo!</h1>
                <ul>
                    <li>CRUD de <Link to="/niveis">Niveis</Link></li>
                    <li>CRUD de <Link to="/desenvolvedores">Desenvolvedores</Link></li>
                </ul>
                <p>Desenvolvido em React e .NET Core por <a href='http://github.com/lfnandoc'>Luiz Fernando Cardoso</a>.</p>
            </div >
        );
    }
}
