import React, { Comoponent, useState } from 'react';
// import history from "history.js";
// import {  gravaGestao }  from "services/ducks/Patrocinios.ducks";
import { Modal,   
  DatePicker,
  Form,
  Radio,
  Select,} from 'antd';

  const valoresIniciais = {
    idSolicitacao: '',
    dataSac: '',
    notaTecnicaAssinada: '',
    idSituacaoProjeto: '',
    idSituacaoProvisao:'',
  };


  class ModalGestao extends Comoponent {

    constructor(props){
      super(props)
      this.state = {
        registro: null
      }
    }


// function ModalGestao ({visible, onCancel, submit, registro, id}) {
  // const history = history();

//   const retorno = { solicitacoes, recorrencia}

//   retorno.solicitacoes = {
//     ...retorno.solicitacoes,
//     prefixoSolicitante: prefAutSelecionado,
//     nomeSolicitante,
//     nomeEvento: values[pergNomeEvento.id],
//     dataInicioEvento: values[pergDataInicioEvento.id],
//     dataFimEvento: values[pergDataFimEvento.id],
//     valorEvento: valorPatrocinio + valorAcaoPromocional,
//     idAcao: Acoes.IncluirSolic,
//   };

//   gravaGestao({
//     solicitacao: retorno,
//     responseHandler: {
//       successCallback: () => {
//         message.success("Solicitação salva com sucesso!");
//         history.push("/patrocinios/gestaoProjeto");
//       },
//       errorCallback: (error) => {
//         message.error(error);
//         this.setState({ submitForm: false });
//       },
//     },
//   });


    // if(!registro){
    //     return null;
    // }

  render(){
      return (
    <>
      <Modal title={`Evento: ${registro.nomeEvento}`} 
      visible={visible} onCancel={onCancel} onOk={submit} >
        <Form
      labelCol={{
        span: 10,
      }}
      wrapperCol={{
        span: 14,
        formataData: true,
      }}
      layout="horizontal"
      >
          <Form.Item label="Data SAC">
            <DatePicker format='DD/MM/YYYY'/>
          </Form.Item>
          <Form.Item label="A Nota técnica foi assinada?">
            <Select>
              <Select.Option value="sim">Sim</Select.Option>
              <Select.Option value="nao">Não</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Situação do Projeto">
            <Select>
              <Select.Option value="andamento">Em andamento</Select.Option>
              <Select.Option value="adiado">Adiado</Select.Option>
              <Select.Option value="cancelado">Cancelado</Select.Option>
              <Select.Option value="encerrado">Encerrado</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Situação do Provisionamento" higth='150px'>
            <Select>
              <Select.Option value="andamento">Em andamento</Select.Option>
              <Select.Option value="concluido">Concluído</Select.Option>
              <Select.Option value="cancelado">Cancelado</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="radio-group" label="Público">
            <Radio.Group>
              <Radio value="pf">PF</Radio>
              <Radio value="pj">PJ</Radio>
              <Radio value="agro">Agro</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
  }

};

export default ModalGestao;