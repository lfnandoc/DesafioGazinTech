import React, { Component } from 'react';
import { Input, Message, Icon, Label, Menu, Table, Button, Modal, Pagination, Segment, Loader, Dimmer } from 'semantic-ui-react'
import { Link } from "react-router-dom";
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css'

export class Niveis extends Component {
    constructor(props) {
        super(props);
        this.state = { niveis: [], loading: true, page: 1, pageCount: 1, successMessage: '', errorMessage: '', search: '', searchLoading: false };
    }

    componentDidMount() {
        this.getPageCount(this.state.search);
        this.populateData(this.state.page, this.state.search);
    }

    renderTable(niveis) {
        return (
            <Table celled >
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>Nome</Table.HeaderCell>
                        <Table.HeaderCell>Desenvolvedores Associados</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {niveis.map(nivel =>

                        <Table.Row key={nivel.id}>

                            <Table.Cell><Icon name='trash' link onClick={() => { this.removeItem(nivel.id, nivel.nome) }} /><Link to={`/cadastrodenivel/${nivel.id}`}><Icon name='pencil alternate' /></Link>{nivel.id}</Table.Cell>

                            <Table.Cell>{nivel.nome}</Table.Cell>
                            <Table.Cell>{nivel.desenvolvedoresAssociados}</Table.Cell>

                        </Table.Row>
                    )}
                </Table.Body>

                <Table.Footer fullWidth>
                    <Table.Row>
                        <Table.HeaderCell colSpan='3'>
                            <Link to="/cadastrodenivel">
                                <Button
                                    floated='left'
                                    icon
                                    labelPosition='left'
                                    primary
                                    size='small'>
                                    <Icon name='plus' /> Cadastrar Nivel
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
            : this.renderTable(this.state.niveis);

        return (
            <div>
                <h1 id="tableLabel" >Niveis</h1>
                <p>Listagem dos niveis de desenvolvedores cadastrados:</p>
                <Input icon='search' loading={this.state.searchLoading} iconPosition='left' value={this.state.search} onChange={(e) => {
                    this.setState({ searchLoading: true,  search: e.target.value });
                    this.getPageCount(this.state.search);
                    this.populateData(this.state.page, this.state.search);
                }} placeholder='Buscar niveis...' />
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
                }} class="pagination" disabled={this.state.loading} defaultActivePage={1} totalPages={this.state.pageCount} onPageChange={(e, { activePage }) => { this.setState({ loading: true, page: activePage }); this.populateData(activePage) }} />
            </div >
        );
    }

    async removeItem(id, nome) {
        axios.delete(`/nivel/${id}`)
            .then((response) => {
                this.setState({ successMessage: `Nivel ${nome} excluido com sucesso.`, errorMessage: '' })
                this.getPageCount();
                this.populateData(this.state.page);
            }, (error) => {
                if (error.response.status === 501)
                    this.setState({ errorMessage: `Nivel ${nome} nao pode ser excluido por ainda ter desenvolvedores associados a ele.`, successMessage: '' })
                else
                    this.setState({ errorMessage: `Nivel ${nome} nao pode ser excluido! ${error}`, successMessage: '' })
            });
    }

    async getPageCount(search) {
        var url = `/nivel/count?query=`;

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
        var url = `/nivel/paginated/${page}?query=`;
        if (search)
            url += `nome|${search}`;
        else
            url += `none`

        axios.get(url)
            .then((response) => {
                this.setState({ niveis: response.data, loading: false, searchLoading: false });
            }, (error) => {

            });
    }
}
