import React from 'react';
import history from "@/history.js";
import FrameVerSolicitacao from  './FrameVerSolicitacao';

class VisualizaSolicitacao extends React.Component {
    render() {
        const { match } = this.props;

        if (match) {
            const { id } = match.params;
            
            if (id) {
                return (
                    <FrameVerSolicitacao
                        idSolicitacao={id} 
                        onClickButtonVoltar={() => history.push("/patrocinios/cadastrar-consultar-sac")}
                    />
                );
            }
        }

        return <div>Solicitação não encontrada.</div>
    }
}

export default VisualizaSolicitacao;