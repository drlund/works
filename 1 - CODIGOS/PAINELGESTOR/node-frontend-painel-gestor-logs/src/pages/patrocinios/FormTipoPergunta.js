import React from "react";

import {
  FormText,
  FormTextArea,
  FormCheckbox,
  FormRadio,
  FormSelect,
  FormDatePicker,
  FormMonthPicker,
  FormInputMoeda,
  FormInputInteger,
  FormInputPrefixo,
  FormInputFunci,
  FormInputCNPJ,
  FormInputContaCorrente,
  FormSimNaoSubperguntas,
  FormRadioRecorrencia,
  FormUploadFile,
  FormDatePrazoUpload,
  FormDatePrazo,
  FormInputFuncisMultiplos,
  FormRadioSubperguntas,
} from "./FormInputs";

function FormTipoPergunta(props) {
  const { opcoes, tipo } = props.pergunta;

  switch (tipo.cdTipoPergunta.toLowerCase()) {
    case "text":
      return <FormText {...props} maxLength={100} />;
    case "textarea":
      return <FormTextArea {...props} rows={5} />;
    case "checkbox":
      return <FormCheckbox {...props} itens={opcoes} />;
    case "radio":
      return <FormRadio {...props} itens={opcoes} />;
    case "select":
      return <FormSelect {...props} itens={opcoes} style={{ width: "35%" }} />;
    case "date":
      return <FormDatePicker {...props} />;
    case "date_fora_prazo":
      return <FormDatePrazo {...props} />;
    case "date_upload_fora_prazo":
      return <FormDatePrazoUpload {...props} uploadForaPrazo={opcoes[0]} />;
    case "month":
      return <FormMonthPicker {...props} placeholder="Selecionar o mês" />;
    case "moeda":
      return (
        <FormInputMoeda {...props} maxLength={21} style={{ width: "20%" }} />
      );
    case "integer":
      return (
        <FormInputInteger {...props} maxLength={13} style={{ width: "10%" }} />
      );
    case "prefixo":
      return (
        <FormInputPrefixo {...props} dv={false} style={{ width: "35%" }} />
      );
    case "funci":
      return <FormInputFunci {...props} style={{ width: "50%" }} />;
    case "funcis_multiplos":
      return <FormInputFuncisMultiplos {...props} />;
    case "cnpj":
      return <FormInputCNPJ {...props} style={{ width: "13%" }} />;
    case "prefixo_dv":
      return <FormInputPrefixo {...props} dv={true} style={{ width: "25%" }} />;
    case "conta_corrente":
      return <FormInputContaCorrente {...props} style={{ width: "10%" }} />;
    case "recorrencia":
      return <FormRadioRecorrencia {...props} itens={opcoes} />;
    case "sim_nao_subperguntas":
      return <FormSimNaoSubperguntas {...props} itens={opcoes} />;
    case "upload":
      return <FormUploadFile {...props} itens={opcoes} />;
    case "radio_subperguntas":
      return <FormRadioSubperguntas {...props} itens={opcoes} />;
    default:
      return <div>Tipo de Pergunta não encontrada.</div>;
  }
}

export default FormTipoPergunta;
