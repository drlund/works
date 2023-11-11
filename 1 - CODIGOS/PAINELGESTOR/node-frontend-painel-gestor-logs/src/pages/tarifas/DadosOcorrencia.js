import React from "react";
import { Descriptions, Tabs } from "antd";
import DadosReserva from "./DadosReserva";
import DadosPagamento from "./DadosPagamento";
import DadosConfirmacao from "./DadosConfirmacao";
import ContatosCliente from "./ContatosCliente";
const { TabPane } = Tabs;

const DadosOcorrencia = (props) => {
  const { ocorrencia, esconderTabs = [] } = props;
  if (!ocorrencia) {
    return null;
  }
  const { dadosCliente } = ocorrencia;

  return (
    <Tabs type="card">
      <TabPane tab="Dados da Ocorrência" key="1">
        {dadosCliente && (
          <Descriptions column={4} bordered>
            <Descriptions.Item span={4} label="Nome do Cliente">
              {dadosCliente.nome ? dadosCliente.nome : "Não disponível"}
            </Descriptions.Item>
            <Descriptions.Item span={2} label="MCI">
              {ocorrencia.mci}
            </Descriptions.Item>
            <Descriptions.Item span={4} label="CPF/CNPJ">
              {ocorrencia.cpf_cnpj}
            </Descriptions.Item>
            {/* <Descriptions.Item span={2} label="Valor Débito">
              {ocorrencia.vlrDebito}
            </Descriptions.Item> */}
            <Descriptions.Item span={4} label="Valor">
              {ocorrencia.vlrAtual}
            </Descriptions.Item>
            {ocorrencia.observacoes && (
              <Descriptions.Item span={4} label="Observação">
                {ocorrencia.observacoes}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </TabPane>

      {!esconderTabs.includes("Reserva") && (
        <>
          <TabPane tab="Contatos Cliente">
            <ContatosCliente contatos={ocorrencia.reserva.contatos} />
          </TabPane>
          <TabPane tab="Reserva" key="2">
            <DadosReserva ocorrencia={ocorrencia} />
          </TabPane>
        </>
      )}

      {!esconderTabs.includes("Pagamento") && (
        <TabPane tab="Pagamento" key="3">
          <DadosPagamento ocorrencia={ocorrencia} />
        </TabPane>
      )}

      {!esconderTabs.includes("Confirmacao") && (
        <TabPane tab="Confirmacao" key="4">
          <DadosConfirmacao ocorrencia={ocorrencia} />
        </TabPane>
      )}
    </Tabs>
  );
};

export default DadosOcorrencia;
