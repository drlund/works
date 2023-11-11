import React from 'react';
import { Typography } from 'antd';
import ImgManutencao from "../FerramentaEmManutencao/imgManutencao.svg";
import styles from "../FerramentaEmManutencao/ferramentaEmManutencao.module.scss";

const endereco = "https://falecom.intranet.bb.com.br/";

export default function Manutencao() {
  return <div className={styles.container}>
    <img src={ImgManutencao} />
    <Typography.Title level={2}>Esta ferramenta está em manutenção</Typography.Title>
    <Typography.Paragraph strong>As solicitações de Movimentação Transitória deverão ser feitas pelo <a href={endereco} target="_blank" rel="noopener noref">Falecom da Superadm</a>!</Typography.Paragraph>
  </div>
}