import React from "react";
import BrindesList, { MODOS } from "../estoque/BrindesList";
import { Tabs } from "antd";
const { TabPane } = Tabs;

const AbasListaBrindes = (props) => {
  
  if (props.brindes && props.brindes.length === 0) {
    return <p> Nenhum brinde para o(s) prefixo(s) pesquisados</p>;
  }

  return (
    <>
      <Tabs type="card">
        {props.brindes !== null && (
          <TabPane tab="Pesquisar" key="1">
            <BrindesList
              key={1}
              onBrindeSelected={(newBrinde) => {
                const newListaBrindes = [...props.brindesSelecionados];
                newListaBrindes.push(newBrinde);
                props.updateFunc(newListaBrindes);
              }}
              onBrindeDeselected={(brindeRemovido) => {
                const newListaBrindes = [...props.brindesSelecionados].filter(
                  (brinde) => {
                    return brinde.id !== brindeRemovido.id;
                  }
                );

                props.updateFunc(newListaBrindes);
              }}
              modo={MODOS.SOLICITACAO_SELECAO}
              selectedList={props.brindesSelecionados}
              listData={props.brindes}
              loading={false}
            />
          </TabPane>
        )}

        {props.brindesSelecionados.length !== 0 && (
          <TabPane tab="Selecionados" key="2">
            <BrindesList
              key={2}
              modo={MODOS.SOLICITACAO_EXIBICAO}
              listData={props.brindesSelecionados}
              loading={false}
            />
          </TabPane>
        )}
      </Tabs>
    </>
  );
};

export default AbasListaBrindes;
