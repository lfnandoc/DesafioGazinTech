import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import 'semantic-ui-css/semantic.min.css'
import moment from 'moment';
import { Grid, Segment, Label, Dropdown, Button, Form, Message, Icon } from 'semantic-ui-react'

const Genero = ["Masculino", "Feminino", "Outro"];


const CadastroDeDesenvolvedor = () => {
    let { id } = useParams();

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [warningMessage, setWarningMessage] = useState('');

    const [nomeError, setNomeError] = useState(undefined);
    const [dataDeNascimentoError, setDataDeNascimentoError] = useState(undefined);
    const [nivelError, setNivelError] = useState(undefined);

    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(id !== undefined);

    const [niveis, setNiveis] = useState([]);

    const [nome, setNome] = useState('');
    const onChangeNome = (event, data) => { setNome(data.value); setNomeError(undefined); };

    const [nivel, setNivel] = useState(undefined);
    const onChangeNivel = (event, data) => { setNivel(data.value); setNivelError(undefined); };

    const [dataDeNascimento, setDataDeNascimento] = useState(undefined);
    const onChangeDataDeNascimento = (event, data) => { setDataDeNascimento(data.value); setDataDeNascimentoError(undefined); };

    const [genero, setGenero] = useState(undefined);
    const onChangeGenero = (event, data) => setGenero(data.value);

    const [hobby, setHobby] = useState(undefined);
    const onChangeHobby = (event, data) => setHobby(data.value);

    useEffect(() => {
        setLoading(true);
        if (editing) {
            populateData(id);
        }
        populateDropdown();
    }, []);

    const postData = () => {
        setLoading(true);
        var dataIsValid = true;

        if (!nome || nome.length === 0) {
            clearMessages();
            setNomeError('O nome do desenvolvedor não pode ser vazio.');
            dataIsValid = false;
        }

        if (!nivel) {
            clearMessages();
            setNivelError('É necessário selecionar um nível.');
            dataIsValid = false;
        }

        if (!dataDeNascimento || dataDeNascimento > Date()) {
            clearMessages();
            setDataDeNascimentoError('A data de nascimento não pode ser vazia ou maior que a data atual.');
            dataIsValid = false;
        }

        if (!dataIsValid) {
            setLoading(false);
            return;
        }

        axios.post('/desenvolvedor', {
            id: editing ? id : -2,
            nome: nome,
            nivel: nivel,
            dataDeNascimento: dataDeNascimento,
            hobby: hobby,
            genero: genero
        })
            .then((response) => {
                setSuccessMessage(`Desenvolvedor ${nome} ${(editing ? "editado" : "cadastrado")} com sucesso!`);
                setWarningMessage('');
                setErrorMessage('');
                setNomeError(undefined);
                setNivelError(undefined);
                setDataDeNascimentoError(undefined);
                setNome(editing ? nome : '');

                if (!editing)
                    clearFields();

                setLoading(false);
            }, (error) => {
                setSuccessMessage('');
                setWarningMessage('');
                setErrorMessage(`Erro durante ${(editing ? "edição" : "cadastro")} do desenvolvedor! ${error}`);
                setDataDeNascimentoError(undefined);
                setNomeError(undefined);
                setNivelError(undefined);
                setLoading(false);
            });
    }

    function clearFields() {
        setNome('');
        setNivel(undefined);
        setDataDeNascimento(undefined);
        setGenero(undefined);
        setHobby('');
    }

    function clearMessages() {
        setSuccessMessage('');
        setWarningMessage('');
        setErrorMessage('');
    }



    function populateData(id) {
        axios.get(`/desenvolvedor/${id}`)
            .then((response) => {
                var desenvolvedor = response.data;
                setNome(desenvolvedor.nome);
                setNivel(desenvolvedor.nivel);
                setDataDeNascimento(moment(desenvolvedor.dataDeNascimento).toDate());
                setGenero(desenvolvedor.genero);
                setHobby(desenvolvedor.hobby);
                setLoading(false);
            }, (error) => {
                setEditing(false);
                setLoading(false);
                setWarningMessage("Desenvolvedor nao encontrado.");
            });
    }

    function populateDropdown() {
        axios.get(`/nivel/all`)
            .then((response) => {
                setNiveis(response.data);
                setLoading(false);
            }, (error) => {

            });
    }

    return (
        <><Link to="/desenvolvedores" style={{ color: 'inherit', textDecoration: 'inherit' }}><Icon name='arrow left' /></Link>
            <h1>{editing ? "Edição" : "Cadastro"} de Desenvolvedor</h1>
            <br/>
            <Grid centered colums="2">
            <Segment textAlign="center" style={{ width: "35%" }}>

                <Form                    
                    success={successMessage !== ''}
                    error={errorMessage !== ''}
                    warning={warningMessage !== ''}
                    loading={loading}>

                    <Form.Input
                        error={nomeError}
                        fluid
                        label='Nome'
                        placeholder='Nome'
                        onChange={onChangeNome}
                        value={nome} />
                    <Form.Dropdown error={nivelError} label='Nivel' placeholder='Nivel' value={nivel ?? null} onChange={onChangeNivel} search selection options={niveis.map((nivel, index) => ({
                        key: nivel.id,
                        text: nivel.nome,
                        value: nivel.id,
                    }))} />
                    <Form.Field error={dataDeNascimentoError}>
                        <label>Data de Nascimento</label>
                        <SemanticDatepicker format='DD/MM/YYYY' value={dataDeNascimento ?? null} locale="pt-BR" onChange={onChangeDataDeNascimento} />
                        <br />
                        <Label basic color='red' hidden={dataDeNascimentoError === undefined} pointing='above'>{dataDeNascimentoError}</Label>
                    </Form.Field>
                    <Form.Field>
                        <label>Genero</label>
                        <Dropdown placeholder='Genero' value={genero ?? null} onChange={onChangeGenero} selection options={Genero.map((genero, index) => ({
                            key: index,
                            text: genero,
                            value: index,
                        }))} />
                        <br />
                    </Form.Field>
                    <Form.Input
                        fluid
                        label='Hobby (Opcional)'
                        placeholder='Hobby'
                        onChange={onChangeHobby}
                        value={hobby} />

                    <Message
                        success
                        header={successMessage}
                    />
                    <Message
                        error
                        header={errorMessage}
                    />
                    <Message
                        warning
                        header={warningMessage}
                    />
                    <br />
                    <Button primary onClick={postData} type='submit'>Gravar</Button>
                </Form>
            </Segment></Grid></>
    );
};

export default CadastroDeDesenvolvedor;