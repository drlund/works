import React from "react";
import { Tooltip, Typography } from "antd";

const { Link } = Typography;

const urlHumanograma = "https://humanograma.intranet.bb.com.br/";

const LinkHumanograma = (props) => {
  const { matriculaFunci } = props;
  return (
    <Tooltip title="Acesso ao humanograma">
      <Link href={urlHumanograma + matriculaFunci} target="_blank">
        {props.children}
      </Link>
    </Tooltip>
  );
};

export default LinkHumanograma;
