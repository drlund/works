import React from "react";
import { Descriptions } from "antd";

const DadosEntrega = (props) => {
  const { solicitacao } = props;

  /**
   *
   *  A partir de certo momento o fez-se necessário incluir campos com os dados de endereço do cliente. As solicitaçõs anteriores a essa
   *  alteração tem o campo 'modeloEnderecoAntigo' como true.
   */
  const renderEnderecoEntrega = () => {
    console.log("solicitacao.modeloEnderecoAntigo")
    console.log(solicitacao.modeloEnderecoAntigo)
    if (solicitacao.modeloEnderecoAntigo) {
      return (
        <Descriptions.Item span={4} label="Complemento">
          {solicitacao.dadosEntrega &&
          solicitacao.dadosEntrega.complementoEntrega
            ? solicitacao.dadosEntrega.complementoEntrega
            : "Não informado"}
        </Descriptions.Item>
      );
    }

    const {
      cep,
      endereco,
      complemento,
      numero,
      bairro,
      cidade,
    } = solicitacao.enderecoCliente;

    return (
      <>
        <Descriptions.Item span={2} label="CEP">
          {cep}
        </Descriptions.Item>
        <Descriptions.Item span={2} label="Número">
          {numero}
        </Descriptions.Item>
        <Descriptions.Item span={2} label="Bairro">
          {bairro}
        </Descriptions.Item>
        <Descriptions.Item span={2} label="Cidade">
          {cidade}
        </Descriptions.Item>
        <Descriptions.Item span={4} label="Endereço">
          {endereco}
        </Descriptions.Item>
        <Descriptions.Item span={4} label="Complemento">
          {complemento}
        </Descriptions.Item>
      </>
    );
  };

  return (
    
      <Descriptions layout="vertical" column={4} size={"small"} bordered>
        <Descriptions.Item span={4} label="Local da entrega">
          {solicitacao.dadosEntrega && solicitacao.dadosEntrega.localEntrega
            ? solicitacao.dadosEntrega.localEntrega
            : "Não informado"}
        </Descriptions.Item>

        {solicitacao.dadosEntrega && solicitacao.dadosEntrega.prefixoEntrega && (
          <Descriptions.Item span={4} label="Prefixo da entrega">
            {`${solicitacao.dadosEntrega.prefixoEntrega.prefixo} - ${solicitacao.dadosEntrega.prefixoEntrega.nome}`}
          </Descriptions.Item>
        )}

        {renderEnderecoEntrega()}
      </Descriptions>
    
  );
};

export default DadosEntrega;
