import React, { useState } from "react";
import { Card, Avatar, Tag, Tooltip, Button, Modal } from "antd";
import { getProfileURL } from "utils/Commons";
import styles from "./ComiteVotacao.module.scss";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  EditOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import LinkHumanograma from "components/LinkHumanograma/LinkHumanograma";
import constants from "../../../utils/Constants";
import DadosVotoUsuario from "./DadosVotoUsuario";

const { MTN_COMITE } = constants;
const { TIPO_VOTO_PARAMETRO } = MTN_COMITE;

const ModalVoto = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { membroComite } = props;
  const { votadoEm } = membroComite;

  const naoFoiVotado = votadoEm === null;

  if (naoFoiVotado) {
    return null;
  }

  return (
    <>
      <Button type="primary" size="small" onClick={() => setShowModal(true)}>
        Voto
      </Button>
      <Modal
        width={800}
        visible={showModal}
        onCancel={() => setShowModal(false)}
        okButtonProps={{ style: { display: "none" } }}
        title={`Voto de ${membroComite.matricula} - ${membroComite.nome}`}
      >
        <DadosVotoUsuario
          setLoading={setLoading}
          loading={loading}
          votacaoUsuario={membroComite}
        />
      </Modal>
    </>
  );
};

const TagVotacao = (props) => {
  const { membroComite } = props;
  const { votadoEm, tipoVoto } = membroComite;

  const tagProps = {
    icon: null,
    color: null,
    tooltip: null,
  };

  const naoFoiVotado = votadoEm === null;

  if (naoFoiVotado) {
    tagProps.color = "gold";
    tagProps.icon = <ClockCircleOutlined />;
    tagProps.msg = "Aguardando";
  } else {
    tagProps.msg = tipoVoto.display;
    switch (tipoVoto.id) {
      case TIPO_VOTO_PARAMETRO.APROVADO:
        tagProps.color = "green";
        tagProps.icon = <CheckCircleOutlined />;
        tagProps.tooltip = `Votado em ${votadoEm}`;
        break;

      case TIPO_VOTO_PARAMETRO.AGUARDANDO_ALTERACOES:
        tagProps.color = "red";
        tagProps.icon = <EditOutlined />;
        tagProps.tooltip = `Alterado em ${votadoEm}`;
        break;
      case TIPO_VOTO_PARAMETRO.ENCERRADO:
        tagProps.color = "red";
        tagProps.icon = <CloseOutlined />;
        tagProps.tooltip = `Encerrado ${votadoEm}`;
        break;
      default:
        break;
    }
  }
  const tag = (
    <Tag icon={tagProps.icon} color={tagProps.color}>
      {tagProps.msg}
    </Tag>
  );

  return !tagProps.tooltip ? (
    tag
  ) : (
    <Tooltip title={tagProps.tooltip}>{tag}</Tooltip>
  );
};

const ComiteVotacao = (props) => {
  const { comite } = props;

  return (
    <>
      {comite.map((membroComite) => {
        const textProps = {};
        if (membroComite.obrigatorio) {
          textProps.type = "danger";
          textProps.style = { cursor: "pointer" };
        }

        return (
          <Card
            className={styles.membroComite}
            style={membroComite.obrigatorio ? { borderColor: "red" } : {}}
          >
            <div className={styles.membroComiteContent}>
              <Tooltip
                title={
                  membroComite.obrigatorio ? "Voto Obrigatório" : undefined
                }
              >
                <Avatar src={getProfileURL(membroComite.matricula)} />
              </Tooltip>
              <LinkHumanograma matriculaFunci={membroComite.matricula}>
                {`${membroComite.matricula} - ${membroComite.nome}`}
              </LinkHumanograma>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TagVotacao membroComite={membroComite} />
                  <ModalVoto membroComite={membroComite} />
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </>
  );
};

export default ComiteVotacao;
