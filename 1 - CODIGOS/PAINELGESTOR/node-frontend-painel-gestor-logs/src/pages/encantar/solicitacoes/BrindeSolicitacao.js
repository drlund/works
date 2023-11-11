import React from "react";
import { Card } from "antd";
import styles from './brindeSolicitacao.module.scss';
const { Meta } = Card;

const BrindeSolicitacao = (props) => {
  return (
    <Card
      hoverable
      onClick={props.onClick ? () => {
        props.onClick(props.brinde)
      } : () => {

        console.log("Não")
      }}
      className={`${styles.brinde} ${
        props.brindeSelecionado && props.brindeSelecionado.id === props.brinde.id
          ? styles.brindeSelecionado
          : ""
      }`}
      style={{ width: 240 }}
      cover={
        <img
          alt="example"
          src={`http://localhost:3333/encantar/brinde-img/${props.brinde.id}`}
        />
      }
    >
      <Meta title={props.brinde.brinde.nome} description={props.brinde.brinde.descricao} />
    </Card>
  );
};

export default BrindeSolicitacao;
