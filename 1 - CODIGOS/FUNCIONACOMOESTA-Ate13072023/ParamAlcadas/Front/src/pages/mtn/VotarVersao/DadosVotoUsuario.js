import React from "react";
import { Descriptions, Typography, message } from "antd";
import { downloadAnexoSemRedux } from "services/ducks/Mtn.ducks";
const { Paragraph, Link } = Typography;

const DadosVotoUsuario = (props) => {
  const { votacaoUsuario, setLoading } = props;
  const possuiAnexos =
    votacaoUsuario.anexos &&
    Array.isArray(votacaoUsuario.anexos) &&
    votacaoUsuario.anexos.length > 0;

  return (
    <Descriptions column={4} bordered>
      <Descriptions.Item label="Funcionário" span={4}>
        {`${votacaoUsuario.matricula} - ${votacaoUsuario.nome}`}
      </Descriptions.Item>
      <Descriptions.Item label="Votado Em" span={4}>
        {`${votacaoUsuario.votadoEm}`}
      </Descriptions.Item>
      <Descriptions.Item label="Tipo do voto" span={4}>
        {votacaoUsuario.tipoVoto.display}
      </Descriptions.Item>

      <Descriptions.Item label="Justificativa" span={4}>
        {votacaoUsuario.justificativa}
      </Descriptions.Item>

      {possuiAnexos && (
        <Descriptions.Item label="Anexos" span={4}>
          <Paragraph>
            <ul>
              {votacaoUsuario.anexos.map((anexo) => {
                return (
                  <Link
                    onClick={() => {
                      setLoading(true);
                      downloadAnexoSemRedux({
                        idAnexo: anexo.id,
                        fileName: anexo.nomeArquivo,
                        responseHandler: {
                          successCallback: () => {
                            console.log("Baixado");
                            setLoading(false);
                          },
                          errorCallback: () => {
                            message.error("Erro no download");
                            setLoading(false);
                          },
                        },
                      });
                    }}
                  >
                    {" "}
                    {anexo.nomeOriginal}{" "}
                  </Link>
                );
              })}
            </ul>
          </Paragraph>
        </Descriptions.Item>
      )}
    </Descriptions>
  );
};

export default DadosVotoUsuario;
