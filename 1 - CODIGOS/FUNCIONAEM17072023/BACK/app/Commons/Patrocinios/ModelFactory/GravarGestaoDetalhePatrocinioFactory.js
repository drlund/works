"use strict"

const GravarGestao = use("App/Models/Mysql/Patrocinios/GestaoDePatrocinios");

class GravarGestaoDetalhePatrocinioFactory {
    async gravarDetalheGestao(detalheGestao){
        const gravarGestao = new GravarGestao()
        gravarGestao.idSolicitacao = detalheGestao.idSolicitacao;
        gravarGestao.dataSac = detalheGestao.dataSac;
        gravarGestao.notaTecnicaAssinada = detalheGestao.notaTecnica;
        gravarGestao.idSituacaoProjeto = detalheGestao.idSituacaoProjeto;
        gravarGestao.idSituacaoProvisao = detalheGestao.idSituacaoProvisao;
        gravarGestao.publicoProjeto = detalheGestao.publicoAlvo;
        gravarGestao.matriculaResponsavel = detalheGestao.matricula;
        gravarGestao.nomeResponsavel = detalheGestao.nome_usuario;

        return gravarGestao;
    }
}

module.exports = GravarGestaoDetalhePatrocinioFactory;
