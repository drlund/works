'use strict'

const Database = use("Database");
const _ = use("lodash");
const exception = use("App/Exceptions/Handler");
const moment = use("App/Commons/MomentZoneBR");
const TemplateEmailEngine = use("App/Commons/TemplateEmailEngine");

class PainelGestorController {

    async findPermissoesUsuario({ request, response, session }) {
      const { token } = request.allParams();
  
      try {
  
        let dadosUsuario = session.get('currentUserAccount');
  
        //usa todos os tipos de identificadores disponiveis para acesso
        const listaIdentificadores = [dadosUsuario.chave, dadosUsuario.prefixo, dadosUsuario.uor, dadosUsuario.uor_trabalho];
        //obtem a lista de concessoes de acesso de todas as ferramentas
        const concessoes = await concessoesAcessosModel.find({ identificador: { $in: listaIdentificadores } }).populate({ path: 'ferramenta', model: permissoesFerramentasModel });
        const listaFerramentas = [];
  
        //separa individualmente os nomes das ferramentas
        for (const registro of concessoes) {
          if (!listaFerramentas.includes(registro.ferramenta.nomeFerramenta)) {
            listaFerramentas.push(registro.ferramenta.nomeFerramenta);
          }
        }
  
        const listaPermissoes = [];
  
        for (const ferramenta of listaFerramentas) {
          let tmpDadosFerramenta = { ferramenta };
  
          const permissoesCadastradas = [];
  
          for (const reg of concessoes) {
            if (reg.ferramenta.nomeFerramenta === ferramenta) {
              let permissoes = reg.permissoes;
              for (const permissao of permissoes) {
                if (!permissoesCadastradas.includes(permissao)) {
                  permissoesCadastradas.push(permissao)
                }
              }
            }
          }
  
          tmpDadosFerramenta.permissoes = permissoesCadastradas;
          listaPermissoes.push(tmpDadosFerramenta);
        }

        const permissoesExtra = await getAcessosExtras(dadosUsuario);
        if (!_.isEmpty(permissoesExtra)) {
  
          // ! array conterá as ferramentas repetidas e as não incluídas na listaPermissoes
          const ferramRepet = !_.isEmpty(listaPermissoes) ? permissoesExtra.filter(item => listaPermissoes.map(perm => perm.ferramenta).includes(item.ferramenta)) : null;
          const ferramExtra = permissoesExtra.filter(item => !listaPermissoes.map(perm => perm.ferramenta).includes(item.ferramenta));
  
          // ! verificar se já existe ferramenta com o mesmo nome, para não repetir acesso
          if (!_.isEmpty(ferramRepet)) {
  
            // ? Se estiver na lista, faz um set com os dados das duas listas
            listaPermissoes.forEach((item) => {
  
              const [perm] = ferramRepet.filter(it => it.ferramenta === item.ferramenta);
              if (_.isEmpty(perm)) return;
  
              item.permissoes = [...new Set([...perm.permissoes, ...item.permissoes])];
            });
          }
  
          if (!_.isEmpty(ferramExtra)) listaPermissoes.push(...ferramExtra);
        }
  
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(listaPermissoes), token);
        response.header('Content-type', 'application/json');
        return response.ok("\"" + ciphertext.toString() + "\"");
  
      } catch (err) {
        var ciphertext = CryptoJS.AES.encrypt("[]", token);
        return response.badRequest(ciphertext.toString());
      }
    }
}

module.exports = PainelGestorController;