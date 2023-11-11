import React from "react";
import { Descriptions, Modal } from "antd";
import estilos from '../../flexCriterios.module.css';

export default function ModalQualificacao (listaQualificacao, titulo) {
  return (
    Modal.info({
      title: titulo,
      width: '40%',
      content: (
        <Descriptions
          // title="Qualificações"
          column={1}
          className={estilos.descricaoCheia}
          bordered
        >
          {listaQualificacao.map((qualificacao) => (
            <>
              <Descriptions.Item
                label="Código"
                className={estilos.descricaoLinha}
              >
                {qualificacao?.cdQualificacao}
              </Descriptions.Item>
              <Descriptions.Item
                label="Qualificação"
                className={estilos.descricaoLinha}
              >
                {qualificacao?.tpQualificacao}
              </Descriptions.Item>
              <Descriptions.Item
                label="Cód. Conhecimento"
                className={estilos.descricaoLinha}
              >
                {qualificacao?.cdConhecimentoQualificacao}
              </Descriptions.Item>
              <Descriptions.Item
                label="Cód. CSO"
                className={estilos.descricaoLinha}
              >
                {qualificacao?.cdCsoQualificacao}
              </Descriptions.Item>
              <Descriptions.Item
                label="Validade"
                className={estilos.descricaoLinha}
              >
                {qualificacao?.dataExpiracaoQualificacao}
              </Descriptions.Item>
            </>
          ))}
        </Descriptions>
      ),
      onOk() {},
    })
  )
}