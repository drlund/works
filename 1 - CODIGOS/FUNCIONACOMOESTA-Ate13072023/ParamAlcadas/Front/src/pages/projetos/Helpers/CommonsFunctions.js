import React from "react";
import { Modal, Typography, Select } from "antd";
import { ExclamationCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import styles from "../projetos.module.css";
import { constantes } from "../Helpers/Constantes";
const { Option } = Select;

// responsaveis = todos os responsaveis incluidos na ferramenta
// responsaveisFuncionalidade = as matriculas dos funcionarios que pertencem a funcionalidade verficada
export const filtraResponsavelFuncionalidade = (
  responsaveis,
  idFuncionalidade
) => {
  return responsaveis.filter((elemento) => {
    return elemento.funcionalidades.includes(idFuncionalidade);
  });
};

// lista = array de objetos com dados dos responsaveis
// matricula = a matricula a ser verificada
export const checkMatriculaDuplicada = (lista, matricula) => {
  return lista.some((responsavel) => {
    return responsavel.matricula === matricula
  })
}

// modal de confirmação de exclusão de dados das listas
export const confirmarExclusao = (idExcluir, callBackExclusao, mensagem) => {
  Modal.confirm({
    title: 'Confirmar Exclusão',
    icon: <ExclamationCircleOutlined />,
    content: mensagem,
    autoFocusButton: null,
    okButtonProps: {className: styles.bbBGAzul},
    cancelButtonProps: {type: 'danger'},
    onOk() {
      callBackExclusao(idExcluir)
    },
  })
};

// modal de informação
export const modalInfo = (titulo, mensagem) => {
  Modal.info({
    icon: <ClockCircleOutlined />,
    title: titulo,
    content: (
      <Typography.Paragraph>
        {mensagem}
      </Typography.Paragraph>
    ),
    onOk() {},
  });
}

// ajusta a nomenclatura dos esclarecimentos / observações
export const tituloCurto = (texto) => {
  return texto.length > 25 ?
  `${texto.substr(0, 25)} ...` :
  texto
}

// retorna o estado de validação de um input
export const validarInput = (conteudoInput) => {
  if (!conteudoInput.length) {
    return "error";
  } else {
    return "success";
  }
}

// verfica se o usuário é adm da ferramenta e alguma outra condição necessária
export const isAdmDaFerramenta = (perfis, outraCondicao = false) => {
  let condicoesAceitas = false;
  if ( perfis.includes('ADM') || outraCondicao ) {
      condicoesAceitas = true
    }
  return condicoesAceitas;
}

export const permiteIncluirResponsavel = (idStatusProjeto, perfilAcesso, soLeitura, origemSolicitacao) => {
  // projeto não concluído
  if (idStatusProjeto !== constantes.statusConcluido)
    return true;
  // é adm do projeto
  if (isAdmDaFerramenta(perfilAcesso, soLeitura))
    return true;
  // projeto concluído só pode receber responsáveis em novas funcionalidades
  if (idStatusProjeto === constantes.statusConcluido && origemSolicitacao === constantes.ORIGEM_FUNCIONALIDADE)
    return true;

  return false;
}

// retorna um componente tipo select com o conteúdo recebido
export const renderDropDown = (nomeLista, lista) => {
  let frase;
  switch (nomeLista) {
    case "projetos":
      frase = "Nenhum responsável foi encontrado.";
      break;
    case "funcionalidades":
      frase = "Nenhuma funcionalidade foi encontrada.";
      break;
    case "atividades":
      frase = "Nenhuma atividade foi encontrada.";
      break;
    default:
      frase = "Erro ao preencher a lista";
      break;
  }
  if (lista.length) {
    return lista.map((item) => {
      return (
        <Option value={item.id} key={item.id}>
          {item.titulo}
        </Option>
      );
    });
  } else {
    return (
      <Option value={0} disabled={true}>
        <Typography.Paragraph>{frase}</Typography.Paragraph>
      </Option>
    );
  }
};

// personalizar a cor dos badges informativos de status
export const badgeColor = (idStatus) => {
  let statusCor;
  switch (idStatus) {
    case -1:
      statusCor = constantes.laranja;
      break;
    case 0:
      statusCor = constantes.cinzaClaro;
      break;
    case 1:
      statusCor = constantes.cinzaEscuro;
      break;
    case 2:
      statusCor = constantes.azulNormal;
      break;
    case 3:
      statusCor = constantes.vermelhoException;
      break;
    case 4: case 6: case 7:
      statusCor = constantes.areia;
      break;
    case 5:
      statusCor = constantes.verdeSuccess;
      break;
    default:
      statusCor = constantes.cinzaEscuro;
      break;
  }
  return statusCor;
};

export const renderDropDownPausa = (listaAtividadeGeradoraPausa) => {
  if (listaAtividadeGeradoraPausa.length) {
    return listaAtividadeGeradoraPausa.map((item) => {
      return (
        <Option value={item.id} key={item.id}>
          {item.titulo}
        </Option>
      );
    });
  } else {
    return (
      <Option value={0} disabled={true}>
        <Typography.Paragraph>{
          'O Projeto selecionado não possui nenhuma Atividade em sua lista.'
        }</Typography.Paragraph>
      </Option>
    );
  }
}
