import React, { Component } from 'react';

export class Niveis extends Component {
    static displayName = Niveis.name;

    constructor(props) {
        super(props);
        this.state = { niveis: [], loading: true };
    }

    componentDidMount() {
        this.populateData();
    }


    linkCadastro() {
        window.open("https://www.google.com");
    }

    static renderTable(niveis) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                    </tr>
                </thead>
                <tbody>
                    {niveis.map(nivel =>
                        <tr key={nivel.id}>
                            <td>{nivel.id}</td>
                            <td>{nivel.nome}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Carregando...</em></p>
            : Niveis.renderTable(this.state.niveis);

        return (
            <div>
                <h1 id="tableLabel" >Niveis</h1>
                <p>Listagem dos niveis de desenvolvedores cadastrados:</p>
                {contents}
            </div>
        );
    }

    async populateData() {
        const response = await fetch('nivel');
        const data = await response.json();
        this.setState({ niveis: data, loading: false });
    }
}
