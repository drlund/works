import React from "react";
import { Descriptions } from "antd";

const DadosReserva = (props) => {
  const { ocorrencia } = props;

  if (!ocorrencia) {
    return null;
  }
  const { reserva } = ocorrencia;

  return (
    <Descriptions column={4} bordered>
      <Descriptions.Item span={4} label="Funcionário responsável pela reserva">
        {`${reserva.matriculaFunciReserva} - ${reserva.nomeFunciReserva}`}
      </Descriptions.Item>
      <Descriptions.Item span={4} label="Prefixo Funcionário">
        {`${reserva.prefixoDepFunciReserva} - ${reserva.nomeDepFunciReserva}`}
      </Descriptions.Item>
      <Descriptions.Item span={4} label="Tipo de pagamento">
        {reserva.tipoPagamento}
      </Descriptions.Item>
      {reserva.dadosPagamento && (
        <>
          <Descriptions.Item span={4} label="Banco">
            {reserva.dadosPagamento.nrBanco}
          </Descriptions.Item>

          <Descriptions.Item span={2} label="Agência">
            {reserva.dadosPagamento.agencia}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Conta">
            {reserva.dadosPagamento.conta}
          </Descriptions.Item>
          {reserva.dadosPagamento.observacoes && (
            <Descriptions.Item span={4} label="Observação">
              {reserva.dadosPagamento.observacoes}
            </Descriptions.Item>
          )}
        </>
      )}
    </Descriptions>
  );
};

export default DadosReserva;
