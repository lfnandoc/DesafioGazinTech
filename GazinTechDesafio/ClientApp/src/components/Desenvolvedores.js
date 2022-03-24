import React, { Component } from 'react';
import { Input, Header, Message, Icon, Label, Menu, Table, Button, Modal, Pagination, Segment, Loader, Dimmer } from 'semantic-ui-react'
import { Link } from "react-router-dom";
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css'
import moment from 'moment';

const Genero = ["Masculino", "Feminino", "Outro"];

export class Desenvolvedores extends Component {
    constructor(props) {
        super(props);
        this.state = { desenvolvedores: [], loading: true, page: 1, pageCount: 1, successMessage: '', errorMessage: '', search: '', searchLoading: false };
    }

    componentDidMount() {
        this.getPageCount(this.state.search);
        this.populateData(this.state.page, this.state.search);
    }

    renderTable(desenvolvedores) {
        return (
            <Table celled >
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>Nome</Table.HeaderCell>
                        <Table.HeaderCell>Nivel</Table.HeaderCell>
                        <Table.HeaderCell>Genero</Table.HeaderCell>
                        <Table.HeaderCell>Data de Nascimento</Table.HeaderCell>
                        <Table.HeaderCell>Idade</Table.HeaderCell>
                        <Table.HeaderCell>Hobby</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {desenvolvedores.map(desenvolvedor =>

                        <Table.Row key={desenvolvedor.id}>

                            <Table.Cell><Icon name='trash' link onClick={() => { this.removeItem(desenvolvedor.id, desenvolvedor.nome) }} /><Link to={`/cadastrodedesenvolvedor/${desenvolvedor.id}`}><Icon name='pencil alternate' /></Link>{desenvolvedor.id}</Table.Cell>

                            <Table.Cell>{desenvolvedor.nome}</Table.Cell>
                            <Table.Cell>{desenvolvedor.nivelNome}</Table.Cell>
                            <Table.Cell>{Genero[desenvolvedor.genero]}</Table.Cell>
                            <Table.Cell>{moment(desenvolvedor.dataDeNascimento).format('DD/MM/YYYY')}</Table.Cell>
                            <Table.Cell>{`${moment(new Date()).diff(desenvolvedor.dataDeNascimento, 'years')} anos`}</Table.Cell>
                            <Table.Cell>{desenvolvedor.hobby}</Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>

                <Table.Footer fullWidth>
                    <Table.Row>
                        <Table.HeaderCell colSpan='7'>
                            <Link to="/cadastrodedesenvolvedor">
                                <Button
                                    floated='left'
                                    icon
                                    labelPosition='left'
                                    primary
                                    size='small'>
                                    <Icon name='user' /> Cadastrar Desenvolvedor
                                </Button></Link>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>

            </Table>
        );
    }

    render() {
        let contents = this.state.loading
            ? (
                <Dimmer active inverted>
                    <Loader inverted></Loader>
                </Dimmer>
            )
            : this.renderTable(this.state.desenvolvedores);

        return (
            <div>
                <h1 id="tableLabel" >Desenvolvedores</h1>
                <p>Listagem dos desenvolvedores cadastrados:</p>
                <Input icon='search' loading={this.state.searchLoading} iconPosition = 'left' value={this.state.search} onChange={(e) => {
                    this.setState({ searchLoading: true, search: e.target.value });
                    this.getPageCount(this.state.search);
                    this.populateData(this.state.page, this.state.search);
                }} placeholder='Buscar desenvolvedores...' />
                <Message
                    hidden={this.state.successMessage === ''}
                    success={this.state.successMessage !== ''}
                    header={this.state.successMessage}
                />
                <Message
                    hidden={this.state.errorMessage === ''}
                    error={this.state.errorMessage !== ''}
                    header={this.state.errorMessage}
                />
                {contents}
                <Pagination style={{
                    position: 'absolute', left: '50%',
                    transform: 'translate(-50%)'
                }} disabled={this.state.loading} defaultActivePage={1} totalPages={this.state.pageCount} onPageChange={(e, { activePage }) => { this.setState({ loading: true, page: activePage }); this.populateData(activePage) }} />
            </div >
        );
    }

    async removeItem(id, nome) {
        axios.delete(`/desenvolvedor/${id}`)
            .then((response) => {
                this.setState({ successMessage: `Desenvolvedor ${nome} excluido com sucesso.`, errorMessage: '' })
                this.getPageCount();
                this.populateData(this.state.page);
            }, (error) => {
                this.setState({ errorMessage: `Desenvolvedor ${nome} nao pode ser excluido! ${error}`, successMessage: '' })
            });
    }

    async getPageCount(search) {
        var url = `/desenvolvedor/count?query=`;

        if (search)
            url += `nome|${search}`;
        else
            url += `none`;

        axios.get(url)
            .then((response) => {
                this.setState({ pageCount: Math.ceil(response.data / 6) });
            }, (error) => {
            });

    }

    async populateData(page, search) {
        var url = `/desenvolvedor/paginated/${page}?query=`;
        if (search)
            url += `nome|${search}`;
        else
            url += `none`;

        axios.get(url)
            .then((response) => {
                this.setState({ desenvolvedores: response.data, loading: false, searchLoading: false });
            }, (error) => {

            });

    }
}
