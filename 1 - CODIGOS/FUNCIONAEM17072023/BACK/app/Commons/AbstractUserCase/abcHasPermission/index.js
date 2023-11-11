'use strict';

const PermissoesFerramentas = require('../../../Models/Mongo/PermissoesFerramentas');
const ConcessoesAcessos = require('../../../Models/Mongo/ConcessoesAcessos');
const { ExpectedAbstractError } = require('..');

const BadRequestError = 400;
const UnauthorizedError = 401;
const ForbiddenError = 403;
const NotFoundError = 404;

/**
 * @param {Object} props
 * @param {UsuarioLogado} props.usuarioLogado - objeto com os dados de sessao do usuario.
 */
const abcHasPermission = ({ usuarioLogado }) =>
  /**
 * @param {Object} props
 * @param {String} props.nomeFerramenta - nome da ferramenta a ser verificada a permissao de acesso.
 * @param {String|String[]} props.permissoesRequeridas - array com a lista das permissoes requeridas.
 * @param {Boolean} [props.verificarTodas] - se for passado e for true, somente retorna true somente se
 *                  o usuario possuir todas as permissoes da lista.
 *
 * @returns {Promise<true>} true se usuario possui as permissoes, erro caso contrario.
 * @throws {ExpectedAbstractError} se não tiver autorização
 */
  async ({
    nomeFerramenta,
    permissoesRequeridas,
    verificarTodas = false
  }) => {
    _validateArgs();

    const errorMessageBase = `Usuário ${usuarioLogado.chave} sem permissão na ferramenta ${nomeFerramenta}`;

    const listaIdentificadores = [usuarioLogado.chave, usuarioLogado.prefixo, usuarioLogado.uor, usuarioLogado.uor_trabalho];

    const dadosFerramenta = await PermissoesFerramentas.findOne({ nomeFerramenta });

    // Usuário não tem permissão na ferramenta
    if (!dadosFerramenta) {
      _throwNotFound("Ferramenta não encontrada: " + nomeFerramenta);
    }

    /** @type {{ permissoes: string[] }[]} */
    const concessoes = await ConcessoesAcessos.find({
      ferramenta: dadosFerramenta.id,
      identificador: { $in: listaIdentificadores }
    }).select({ permissoes: 1 }).lean();

    if (concessoes.length === 0) {
      _throwForbidden();
    }

    // unifica com dedupe a lista de permissoes dos identificadores encontrados
    const permissoesCadastradas = /** @type {string[]} */ ([...new Set(
      concessoes
        .map(c => c.permissoes)
        .flat(Infinity)
    )]);

    const permissoes = Array.isArray(permissoesRequeridas)
      ? permissoesRequeridas
      : [permissoesRequeridas];

    const { intersection, needPermission } = permissoes.reduce((acc, p) => {
      const has = permissoesCadastradas.includes(p);
      if (has) {
        acc.intersection++;
      } else {
        acc.needPermission.push(p);
      }

      return acc;
    }, {
      intersection: 0,
      needPermission: /** @type {string[]} */ ([]),
    });

    const hasPermission = verificarTodas
      ? intersection === permissoes.length
      : intersection > 0;

    if (!hasPermission) {
      const allPermissionsNeeded = new Intl
        .ListFormat('pt-BR', {
          style: 'long',
          // volta lista como "e" (conjunction) ou "ou" (disjunction)
          type: verificarTodas ? 'conjunction' : 'disjunction'
        })
        .format(needPermission);

      _throwForbidden(`${errorMessageBase}, precisa acesso em: ${allPermissionsNeeded}`);
    }

    return /** @type {true} */ (hasPermission);

    function _validateArgs() {
      if (!usuarioLogado) {
        _throwUnauthorized('Usuário não encontrado');
      }

      if (!nomeFerramenta) {
        _throwErrorWithCode('Ferramenta não encontrada');
      }

      if (typeof verificarTodas !== 'boolean') {
        _throwErrorWithCode('Problema ao verificar acesso.');
      }

      if (
        // check if theres length be it a string or array
        !(
          // string or array
          (
            typeof permissoesRequeridas === 'string'
            || Array.isArray(permissoesRequeridas)
          )
          // anycase: check len
          && permissoesRequeridas.length > 0
        )
      ) {
        _throwErrorWithCode('Problema ao verificar acesso.');
      }
    }

    function _throwErrorWithCode(message = errorMessageBase, code = BadRequestError) {
      throw new ExpectedAbstractError(message, code);
    }

    function _throwUnauthorized(message = errorMessageBase) {
      _throwErrorWithCode(message, UnauthorizedError);
    }

    function _throwForbidden(message = errorMessageBase) {
      _throwErrorWithCode(message, ForbiddenError);
    }

    function _throwNotFound(message = errorMessageBase) {
      _throwErrorWithCode(message, NotFoundError);
    }
  };


/**
 * @typedef {ReturnType<abcHasPermission>} abcHasPermissionUCLevel
 */

module.exports = {
  abcHasPermission
};
