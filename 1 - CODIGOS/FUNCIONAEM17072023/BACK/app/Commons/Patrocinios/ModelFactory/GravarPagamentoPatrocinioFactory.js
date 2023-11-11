"use strict"

const GravarPagamento = use ("App/Models/Mysql/Patrocinios/GestaoPagamentosPatrocinios")

class GravarPagamentoPatrocinioFactory {
    async gravarDetalhePagamento(detalhePagamento){
        const gravarPagamento = new GravarPagamento()
        gravarPagamento.idProjeto = parseInt(detalhePagamento.dataPagamento.idProjeto);
        gravarPagamento.valorPagamento = detalhePagamento.dataPagamento.valorPagamento;
        gravarPagamento.dataDoPagamento = detalhePagamento.dataPagamento.dataDoPagamento;
        gravarPagamento.observacao = detalhePagamento.dataPagamento.observacao;
        gravarPagamento.matriculaResponsavel = detalhePagamento.matricula;
        gravarPagamento.nomeResponsavel = detalhePagamento.nome_usuario;

        return gravarPagamento; 
        
    }

}

module.exports = GravarPagamentoPatrocinioFactory;