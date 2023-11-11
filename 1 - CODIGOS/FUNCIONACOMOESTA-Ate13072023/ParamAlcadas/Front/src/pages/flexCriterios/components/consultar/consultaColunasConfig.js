import React from 'react';
import { Tag } from 'antd';
import ConsultaAcoes from './consultaAcoes';

export default function ColunasConsulta({
  perfil,
  setIdAvocarSelecionado,
  setIdEncerrarSelecionado,
}) {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Tipo de Flexibilização',
      dataIndex: 'tipoString',
      render: (_, { tipo }) =>
        tipo.map((tipoFlex) => (
          <Tag color={tipoFlex.cor} key={tipoFlex.id}>
            {tipoFlex.nome.toUpperCase()}
          </Tag>
        )),
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Localização',
      dataIndex: 'localizacao',
    },
    {
      title: 'Funcionário',
      dataIndex: 'funcionario',
    },
    {
      title: 'Comissão Origem',
      render: (text, record) => {
        return (
          <p>
            {record.comissaoOrigem}-{record.nomeComissaoOrigem}
          </p>
        );
      },
    },
    {
      title: 'Prefixo Origem',
      dataIndex: 'origem',
    },
    {
      title: 'Claros Origem',
      render: (text, record) => {
        return <p>{record.clarosOrigem}%</p>;
      },
    },
    {
      title: 'Diretoria Origem',

      render: (text, record) => {
        let formated = JSON.parse(record.analise.dadosOrigem);
        return <p>{formated.prefixoDiretoria}</p>;
      },
    },
    {
      title: 'Comissão Destino',
      render: (text, record) => {
        return (
          <p>
            {record.comissaoDestino}-{record.nomeComissaoDestino}
          </p>
        );
      },
    },
    {
      title: 'Prefixo Destino',
      dataIndex: 'destino',
    },
    {
      title: 'Claros Destino',
      render: (text, record) => {
        return <p>{record.clarosDestino}%</p>;
      },
    },
    {
      title: 'Diretoria Destino',

      render: (text, record) => {
        let formated = JSON.parse(record.analise.dadosDestino);
        return <p>{formated.prefixoDiretoria}</p>;
      },
    },
    {
      title: 'Tipo Movimentação',
      /* dataIndex: 'analise.validacaoRH', */
      render: (text, record) => {
        let formated = JSON.parse(record.analise.validacaoRH);
        return <p>{formated.tipoMovimentacao}</p>;
      },
    },
    {
      title: 'Vantagem',
      /* dataIndex: 'analise.validacaoRH', */
      render: (text, record) => {
        let formated = JSON.parse(record.analise.validacaoRH);
        const sim = /sim|Sim/.test(formated.movimentacao[0].valor);
        return <p>{sim ? 'Sim' : 'Não'}</p>;
      },
    },
    {
      title: 'Tempo de impedimento',
      /* dataIndex: 'analise.validacaoRH', */
      render: (text, record) => {
        let formated = JSON.parse(record.analise.validacaoRH);

          return <p>{formated.validacao[8].valor}</p>; 
      /*   return <p>{record.analise.validacaoRH}</p>; */
      },
    },
    {
      title: 'Impedimento ODI',
      /* dataIndex: 'analise.validacaoRH', */
      render: (text, record) => {
        let formated = JSON.parse(record.analise.validacaoRH);

        return <p>{formated.validacao[5].valor}</p>;
      },
    },

    {
      title: 'Ações',
      render: (dados) => (
        <ConsultaAcoes
          idPedidoFlex={dados.id}
          etapa={dados.etapa}
          perfil={perfil}
          setIdAvocarSelecionado={setIdAvocarSelecionado}
          setIdEncerrarSelecionado={setIdEncerrarSelecionado}
        />
      ),
    },
  ];
}
