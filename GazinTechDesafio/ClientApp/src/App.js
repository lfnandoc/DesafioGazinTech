import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Niveis } from './components/Niveis';
import { Desenvolvedores } from './components/Desenvolvedores';
import { CadastroDeNivel } from './components/CadastroDeNivel';
import CadastroDeDesenvolvedor from './components/CadastroDeDesenvolvedor';

import './custom.css'
import 'semantic-ui-css/semantic.min.css'

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Layout>
                <Route exact path='/' component={Home} />
                <Route path='/desenvolvedores' component={Desenvolvedores} />
                <Route path='/niveis' component={Niveis} />
                <Switch>
                    <Route path="/cadastrodenivel/:id" component={CadastroDeNivel} />
                    <Route path="/cadastrodenivel" component={CadastroDeNivel} />
                </Switch>
                <Switch>
                    <Route path="/cadastrodedesenvolvedor/:id" render={() => <CadastroDeDesenvolvedor />} />
                    <Route path="/cadastrodedesenvolvedor" render={() => <CadastroDeDesenvolvedor />} />
                </Switch>
            </Layout>
        );
    }
}
