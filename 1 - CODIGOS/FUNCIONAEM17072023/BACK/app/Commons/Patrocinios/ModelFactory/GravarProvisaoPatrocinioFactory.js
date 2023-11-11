"use strict"

const GravarProvisao = use ("App/Models/Mysql/Patrocinios/GestaoProvisaoPatrocinios")

class GravarProvisaoPatrocinioFactory {
    async gravarDetalheProvisao(detalheProvisao){
        const gravarProvisao = new GravarProvisao()
        gravarProvisao.idProjeto = parseInt(detalheProvisao.idProjeto);
        gravarProvisao.valorProvisao = detalheProvisao.valorProvisao;
        gravarProvisao.competenciaProvisao = detalheProvisao.competenciaProvisao;
        gravarProvisao.observacao = detalheProvisao.observacao;
        gravarProvisao.matriculaResponsavel = detalheProvisao.matricula;
        gravarProvisao.nomeResponsavel = detalheProvisao.nome_usuario;

        return gravarProvisao; 
        
    }

}

module.exports = GravarProvisaoPatrocinioFactory;