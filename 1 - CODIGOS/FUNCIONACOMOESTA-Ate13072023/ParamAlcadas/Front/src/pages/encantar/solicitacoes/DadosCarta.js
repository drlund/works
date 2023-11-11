import React, { useState, useEffect } from "react";
import ReactHtmlParser from "react-html-parser";
import { Card } from "antd";
import style from "./dadosCarta.module.scss";

const DadosCarta = (props) => {
  if (props.txtMsgBrinde === null) {
    return (
      <Card title={"Carta"} className={style.carta}>
        <div className={style.semCarta}>
          <p>Nenhuma carta foi especificada</p>
        </div>
      </Card>
    );
  }
  return (
    <Card title={"Carta"}>
      {ReactHtmlParser(props.txtMsgBrinde)}
    </Card>
  );
};

export default DadosCarta;
