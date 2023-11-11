"use strict"

const GravarOrcamento = use ("App/Models/Mysql/Patrocinios/GestaoOrcamentoPatrocinios")

class GravarOrcamentoPatrocinioFactory {
    async gravarDetalheOrcamento(detalheOrcamento){
        const gravarOrcamento = new GravarOrcamento()
        gravarOrcamento.idProjeto = detalheOrcamento.idProjeto;
        gravarOrcamento.prefixoOrigem = detalheOrcamento.prefixoOrigem;
        gravarOrcamento.nomePrefixoOrigem = detalheOrcamento.nomePrefixoOrigem;
        gravarOrcamento.incluidoOrcMkt = detalheOrcamento.incluidoOrcMkt;
        gravarOrcamento.valorOrcamento = detalheOrcamento.valorOrcamento;
        gravarOrcamento.observacao = detalheOrcamento.observacao;
        gravarOrcamento.matriculaResponsavel = detalheOrcamento.matricula;
        gravarOrcamento.nomeResponsavel = detalheOrcamento.nome_usuario;

        return gravarOrcamento; 
        
    }

}

module.exports = GravarOrcamentoPatrocinioFactory;