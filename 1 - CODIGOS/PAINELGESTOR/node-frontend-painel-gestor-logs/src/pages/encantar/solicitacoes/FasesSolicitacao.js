import React from "react";

import { Steps, Typography } from "antd";
import {
  PlusCircleOutlined,
  SolutionOutlined,
  FileDoneOutlined,
  SmileOutlined,
  GiftOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import style from "./fasesSolicitacao.module.scss";
const { Step } = Steps;

const { Title } = Typography;


const FINISHED = "finish";
const WAIT = "wait";
const process = "process";
const finish = "finish";
const error = "error";

const fases = [{ status: "" }];

const FasesSolicitacao = (props) => {
  return (
      
      <Steps direction="vertical" className={style.customSteps}>
        <Step status="finish" title="Criação" icon={<PlusCircleOutlined />} />
        <Step
          status="finish"
          description={"Descrição exemplo"}
          title="Autorização Gestor"
          icon={<SolutionOutlined />}
        />
        <Step
          status="process"
          title="Deferimento Ação"
          icon={<FileDoneOutlined />}
        />
        <Step status="process" title="Execução" icon={<GiftOutlined />} />
        <Step
          status="process"
          title="Deferimento Ação"
          icon={<LoadingOutlined />}
        />
        <Step status="wait" title="Done" icon={<SmileOutlined />} />
      </Steps>

  );
};

export default FasesSolicitacao;
