import React, { useState, useEffect } from "react";
import { Row, Col, Card, Typography, message, Alert } from "antd";
import DadosOcorrencia from "./DadosOcorrencia";
import FormularioReservaOcorrencia from "./FormularioReservaOcorrencia";
import DadosReserva from "./DadosReserva";
import { getDadosOcorrenciaReserva } from "services/ducks/Tarifas.ducks";
import BBSpinning from "components/BBSpinning/BBSpinning";
import { useParams } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

const ReservarOcorrencia = (props) => {
  const { idOcorrencia } = useParams();
  const [ocorrencia, setOcorrencia] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ocorrencia === null) {
      setLoading(true);
      getDadosOcorrenciaReserva(idOcorrencia)
        .then((dadosOcorrencia) => setOcorrencia(dadosOcorrencia))
        .catch((error) => {
          message.error(error);
        })
        .then(() => {
          setLoading(false);
        });
    }
  }, [ocorrencia, idOcorrencia]);

  const isOcorrenciaReservada = ocorrencia && ocorrencia.reserva !== null;

  return (
    <BBSpinning spinning={loading}>
      <Row gutter={[0, 20]} style={{ marginBottom: 15 }}>
        <Col span={11}>
          <Card>
            <Title level={5}>Instruções</Title>
            <Paragraph>
              Para que o pagamento seja realizado, efetue a reserva através do
              formulário abaixo, seguindo os seguintes procedimentos:
            </Paragraph>
            <Paragraph>
              <ol>
                <li>
                  Digite o número de telefone (essa informação é obrigatória) e
                  tecle nas setas (ícone azul) para inserir um ou mais contatos;
                </li>
                <li>
                  Depois de inserir um ou mais contatos, tecle em “Próximo”;
                </li>
                <li>
                  Selecione o tipo de pagamento (Em espécie ou Conta Corrente):
                  <ul>
                    <li>
                      <Text strong>Em espécie</Text> (casos em que o cliente receberá na boca do
                      caixa, após você fazer o CTR, conforme Comunicado a
                      Administradores): clique em “Próximo” {">"} clique em
                      “Reservar para pagamento”. Após efetuar a reserva, proceda
                      conforme Comunicado a Administradores para registrar o
                      CTR. O cliente receberá o valor no caixa da agência/PSO
                      vinculado ao prefixo que fez a reserva, no mesmo dia.
                      Pegue esse comprovante emitido pelo caixa, assinado pelo
                      cliente, digitalize e inclua na ferramenta na aba “Pagto
                      Espécie” do menu à esquerda.
                    </li>
                    <li>
                    <Text strong>Conta Corrente</Text>: digite os dados bancários do cliente
                      beneficiário (No BB ou em outro banco. Não pode ser conta
                      de terceiros. Pode ser conta poupança.) {">"} clique em
                      “Próximo” {">"} confira os dados {">"} clique em “Reservar para
                      pagamento”. ATENÇÃO: quando o cliente opta por pagamento
                      em conta corrente/poupança, as demais etapas do processo
                      serão feitas pelo CENOP em até 5 dias úteis e não há
                      outras ações para a agência.
                    </li>
                  </ul>
                </li>
              </ol>
            </Paragraph>
          </Card>
        </Col>
        <Col offset={1} span={11}>
          <Card>
            <DadosOcorrencia
              esconderTabs={["Reserva", "Pagamento", "Confirmacao"]}
              ocorrencia={ocorrencia}
            />
          </Card>
        </Col>

        <Col offset={4} span={16}>
          <Card>
            {isOcorrenciaReservada ? (
              <>
                <Alert
                  style={{ marginBottom: 15 }}
                  message="Esta ocorrência já foi reservada para pagamento"
                  type="error"
                />
                <DadosReserva ocorrencia={ocorrencia} />
              </>
            ) : (
              <FormularioReservaOcorrencia
                recarregarOcorrencia={() => setOcorrencia(null)}
                loadingControl={{ loading, setLoading }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </BBSpinning>
  );
};

export default ReservarOcorrencia;
