/**
 * A aplicacao esta baseada em um Router com Historico.
 * Desta forma poderemos alterar a rota dinamicamente via codigo,
 * sem necessidade do usuario clicar em algum objeto do tipo <Link/>.
 * 
 * Exemplo: 
 *    import history from 'history.js'
 * 
 *    history.push('/minha_pagina')
 */

import { createBrowserHistory } from "history";

//base das rotas das URLs do router
const basename = process.env.REACT_APP_BASENAME || '/v8';
export default createBrowserHistory({ basename });