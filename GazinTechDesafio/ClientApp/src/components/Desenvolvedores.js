import React, { Component } from 'react';

const Genero = ["Masculino", "Feminino", "Outro"]

export class Desenvolvedores extends Component {
    static displayName = Desenvolvedores.name;

    constructor(props) {
        super(props);
        this.state = { desenvolvedores: [], loading: true };
    }

    componentDidMount() {
        this.populateData();
    }

    static renderTable(desenvolvedores) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Nivel</th>
                        <th>Genero</th>
                        <th>Data de Nascimento</th>
                        <th>Hobby</th>
                    </tr>
                </thead>
                <tbody>
                    {desenvolvedores.map(desenvolvedor =>
                        <tr key={desenvolvedor.id}>
                            <td>{desenvolvedor.id}</td>
                            <td>{desenvolvedor.nome}</td>
                            <td>{desenvolvedor.nivelName}</td>
                            <td>{Genero[desenvolvedor.genero]}</td>
                            <td>{desenvolvedor.dataDeNascimento}</td>
                            <td>{desenvolvedor.hobby}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Carregando...</em></p>
            : Desenvolvedores.renderTable(this.state.desenvolvedores);

        return (
            <div>
                <h1 id="tableLabel">Desenvolvedores</h1>
                <p>Listagem dos desenvolvedores cadastrados:</p>
                {contents}
            </div>
        );
    }

    async populateData() {
        const response = await fetch('desenvolvedor');
        const data = await response.json();
        this.setState({ desenvolvedores: data, loading: false });
    }
}
