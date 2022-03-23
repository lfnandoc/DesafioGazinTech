import React, { Component, useState } from 'react';
import { Input } from 'semantic-ui-react';
import axios from 'axios';

import { Button, Form, Message } from 'semantic-ui-react'


export class CadastroDeNivel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nome: '',
            successNome: '',
            success: false,
            error: false
        };
    }    

    postData = () => {
        axios.post('/nivel', {
            nome: this.state.nome
        })
            .then((response) => {
                if (response.status == 200)
                    this.setState({ success: true, error: false, successNome: this.state.nome, nome: '' });
                else
                    this.setState({ error: true, success: false, nome: '' });
            }, (error) => {
                this.setState({ error: true, success: false, nome: '' });
            });
    }


    render() {
        return (
            <Form success={this.state.success} error={this.state.error}>
                <h1>Cadastro de Nivel</h1>
                <Form.Field>
                    <label>Nome</label>
                    <input placeholder='Nome' onChange={(e) => this.setState({ nome: e.target.value })} value={this.state.nome} />
                </Form.Field>
                <Message
                    success
                    header={`Nível ${this.state.successNome} cadastrado com sucesso!`}
                />
                <Message
                    error
                    header='Erro durante cadastro do nível!'
                />
                <Button onClick={this.postData} type='submit'>Cadastrar</Button>
            </Form>
        );
    }
}