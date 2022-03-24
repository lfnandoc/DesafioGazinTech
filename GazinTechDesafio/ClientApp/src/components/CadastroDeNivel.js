import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css'

import { Grid, Segment, Button, Form, Message, Icon } from 'semantic-ui-react'

export class CadastroDeNivel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nome: '',
            successMessage: '',
            errorMessage: '',
            warningMessage: '',
            nomeError: undefined,
            loading: false,
            id: this.props.match.params.id,
            editing: this.props.match.params.id !== undefined
        };
    }

    componentDidMount() {
        if (this.state.editing) {
            this.setState({ loading: true });
            this.populateData(this.state.id);
        }
    }

    postData = () => {
        this.setState({ loading: true });

        if (!this.state.nome || this.state.nome.length === 0) {
            this.setState({ successMessage: '', errorMessage: '', nomeError: 'O nome do nível não pode ser vazio.', loading: false });
            return;
        }
        const editing = this.state.editing;

        axios.post('/nivel', {
            nome: this.state.nome,
            id: editing ? this.state.id : -2
        })
            .then((response) => {
                this.setState({ successMessage: `Nível ${this.state.nome} ${(editing ? "editado" : "cadastrado")} com sucesso!`, warningMessage: '', errorMessage: '', nomeError: undefined, nome: editing ? this.state.nome : '', loading: false });
            }, (error) => {
                this.setState({ errorMessage: `Erro durante ${(editing ? "edição" : "cadastro")} do nível! ${error}`, warningMessage: '', successMessage: '', nomeError: undefined, loading: false });
            });
    }


    render() {
        return (
            <>
                <Link to="/niveis" style={{ color: 'inherit', textDecoration: 'inherit' }}><Icon name='arrow left' /></Link>
                <h1>{this.state.editing ? "Edição" : "Cadastro"} de Nivel</h1>
                <br />
                <Grid centered colums="2">
                <Segment textAlign="center" style={{ width: "35%" }}>
                    <Form
                        success={this.state.successMessage !== ''}
                        error={this.state.errorMessage !== ''}
                        warning={this.state.warningMessage !== ''}
                        loading={this.state.loading}>

                        <Form.Input
                            error={this.state.nomeError}
                            fluid
                            label='Nome'
                            placeholder='Nome'
                            onChange={(e) => this.setState({ nome: e.target.value })} value={this.state.nome}
                        />
                        <Message
                            success
                            header={this.state.successMessage}
                        />
                        <Message
                            error
                            header={this.state.errorMessage}
                        />
                        <Message
                            warning
                            header={this.state.warningMessage}
                        />
                        <Button primary onClick={this.postData} type='submit'>Gravar</Button>
                    </Form></Segment></Grid></>
        );
    }

    async populateData(id) {
        axios.get(`/nivel/${id}`)
            .then((response) => {
                this.setState({ nome: response.data.nome, loading: false });
            }, (error) => {
                this.setState({ id: undefined, editing: false, loading: false, warningMessage: "Nivel nao encontrado." });
            });
    }
}