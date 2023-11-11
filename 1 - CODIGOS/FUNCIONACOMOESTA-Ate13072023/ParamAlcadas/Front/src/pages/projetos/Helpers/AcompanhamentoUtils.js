import React from "react";
import { Tooltip} from "antd";
import {
  CheckCircleFilled,
  CheckOutlined,
  CloseCircleFilled,
  CloseOutlined,
  ExclamationCircleFilled,
  ExclamationOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { constantes } from "./Constantes";
import styles from "../projetos.module.css";

export const progressColor = (cor) => {};

export const informacaoConclusao = (percent, idStatus, situacao) => {
  let margem, alinhamento, iconConcluido, iconInterrompido, iconAtrasado;
  if (situacao) {
    margem = "auto";
    alinhamento = "center";
    iconConcluido = <CheckOutlined />;
    iconInterrompido = <CloseOutlined />;
    iconAtrasado = <ExclamationOutlined />;
  } else {
    margem = "2em";
    alinhamento = "end";
    iconConcluido = <CheckCircleFilled />;
    iconInterrompido = <CloseCircleFilled />;
    iconAtrasado = <ExclamationCircleFilled />;
  }
  if (
    percent === constantes.percentual100 ||
    idStatus === constantes.statusConcluido
  ) {
    return (
      <Tooltip title="Desenvolvimento Finalizado">
        <p
          style={{
            marginLeft: margem,
            marginBottom: 0,
            textAlign: alinhamento,
            color: constantes.verdeSuccess,
          }}
        >
          {iconConcluido}
        </p>
      </Tooltip>
    );
  } else if (idStatus === constantes.statusInterrompido) {
    return (
      <Tooltip title="Desenvolvimento Interrompido">
        <p
          style={{
            marginLeft: margem,
            marginBottom: 0,
            textAlign: alinhamento,
            color: constantes.vermelhoEsception,
          }}
        >
          {iconInterrompido}
        </p>
      </Tooltip>
    );
  } else if (
    idStatus === constantes.statusEmAndamento &&
    situacao === "Atrasado"
  ) {
    return (
      <Tooltip title="Desenvolvimento Atrasado">
        <p
          style={{
            marginLeft: margem,
            marginBottom: 0,
            textAlign: alinhamento,
            color: constantes.laranja,
          }}
        >
          {iconAtrasado}
        </p>
      </Tooltip>
    );
  } else {
    return <Tooltip title="Percentual Concluído">{percent + "%"}</Tooltip>;
  }
};

export const percentualProgresso = (funcionalidade) => {
  const atividadesTotal = funcionalidade.atividades.length;
  const atividadesEmAndamento = funcionalidade.atividades.filter(
    (atividade) => !atividade.dtConclusao
  ).length;
  const atividadesConcluidas =
    funcionalidade.atividades.length - atividadesEmAndamento;

  const percentual = atividadesTotal
      ? (atividadesConcluidas / atividadesTotal) * 100
      : 0;

  return percentual.toFixed(2);
};

export const atividadesToModal = (atividades) => {
  return atividades.map((atividade) => {
    let percentual;
    let estado = "normal";
    let cor = styles.azulNormal;
    let inicio = "não iniciado";
    const informacao = atividade.situacao;
    let trabalhando = 0;
    let total = atividade.prazo + atividade.prazoPausas;
    // corrigir erro de divisão por 0 (caso o prazo da atividade seja 0)
    total = total === 0 ? 1 : total;

    if (atividade.dtInicio) {
      [inicio] = atividade.dtInicio.split(" ");
      trabalhando = moment().diff(moment(inicio, "DD/MM/YYYY"), "days");
      percentual = ((trabalhando / total) * 100).toFixed(0);
    } else {
      percentual = 0;
      cor = constantes.cinzaEscuro;
    }

    if (atividade.idStatus === constantes.statusConcluido) {
      estado = "success";
      percentual = 100;
      cor = constantes.verdeSuccess;
    } else if (
      trabalhando > total &&
      atividade.idStatus === constantes.statusEmAndamento
    ) {
      cor = constantes.laranja;
    } else {
      cor = constantes.azulNormal;
    }
    atividade.key = atividade.id;
    atividade.percentual = percentual;
    atividade.informacao = informacao;
    atividade.estado = estado;
    atividade.cor = cor;
    return atividade;
  });
};

const filtrarAtividadeByDataInicio = (dtInicio, dtInicioRange) => {
  if (dtInicio) {
    let [data] = dtInicio.split(" ");
    data = moment(data, "DD/MM/YYYY");
    if (
      // entre as datas mas não inclui as datas
      data.isBetween(
        moment(dtInicioRange[0], "DD/MM/YYYY"),
        moment(dtInicioRange[1], "DD/MM/YYYY")
      ) ||
      // igual ao inicio do range
      data.isSame(moment(dtInicioRange[0], "DD/MM/YYYY")) ||
      // igual ao fim do range
      data.isSame(moment(dtInicioRange[1], "DD/MM/YYYY"))
    ) {
      return true;
    }
    return false;
  }
};

const filtrarAtividadeByStatus = (somenteConcluidas, idStatus) => {
  return somenteConcluidas && idStatus !== constantes.statusConcluido ? false : true;
};

const filtrarAtividadeByMatricula = (matriculaAtividade, matriculaPesquisa) => {
  return matriculaAtividade === matriculaPesquisa ? true : false;
};

/**
 * Realiza o loop no projeto para verificar se alguma atividade atende o critério do filtro selecionado
 * @param {Array} projetos a lista de projetos a serem verificados
 * @param {String} tipoFiltro especifica o tipo de filtro que será aplicado a lista de projetos
 * @param {Variable} parametro pode ser um array de datas, um inteiro para status ou string para matricula
 * @returns {Array} A lista de projetos que atendem aos critérios de filtro
 */
export const filtrarAtividades = (projetos, tipoFiltro, parametro) => {
  const idsProjetosDentroDoRange = [];
  projetos.map((projeto) => {
    return projeto.funcionalidades.map((funcionalidade) => {
      return funcionalidade.atividades.filter((atividade) => {
        switch (tipoFiltro) {
          case constantes.filtroByDataInicio:
            if(filtrarAtividadeByDataInicio(atividade.dtInicio, parametro)) idsProjetosDentroDoRange.push(projeto.id);
            break;
          case (constantes.filtroByConcluida):
            if(filtrarAtividadeByStatus(parametro, atividade.idStatus)) idsProjetosDentroDoRange.push(projeto.id);
            break;
          case (constantes.filtroByMatricula):
            const responsavelAtividade = projeto.responsaveis.find(responsavel => atividade.responsavel.includes(responsavel.id));
            if(typeof responsavelAtividade === "object" && filtrarAtividadeByMatricula(responsavelAtividade.matricula, parametro)) idsProjetosDentroDoRange.push(projeto.id);
            break;
          default:
            break;
        }
        return atividade;
      })
    })
  })
  const filtrados = projetos.filter(projeto => idsProjetosDentroDoRange.includes(projeto.id))
  return filtrados;
}

// export const filtrarAtividades = (projetos, dtInicioRange, atividadeConcluida) => {
//   const idsProjetosDentroDoRange = [];

//   projetos.map((projeto) => {
//     return projeto.funcionalidades.map((funcionalidade) => {
//       return funcionalidade.atividades.filter((atividade) => {
//         if (
//           filtrarAtividadeByDataInicio(atividade.dtInicio, dtInicioRange) &&
//           filtrarAtividadeByStatus(atividadeConcluida, atividade.idStatus) &&
//           filtrarAtividadeByMatricula('teste', 'teste')
//         ) {
//           idsProjetosDentroDoRange.push(projeto.id);
//         }
//         return atividade;
//       });
//     });
//   });

//   projetos = projetos.filter((projeto) =>
//     idsProjetosDentroDoRange.includes(projeto.id)
//   );

//   return projetos;
// };
