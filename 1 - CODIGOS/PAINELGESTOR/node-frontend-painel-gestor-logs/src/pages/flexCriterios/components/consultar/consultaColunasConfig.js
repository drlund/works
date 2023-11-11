import React, { useState } from 'react';
import { Checkbox, Space, Tag, Tooltip } from 'antd';
import ConsultaAcoes from './consultaAcoes';
import { InfoCircleOutlined } from '@ant-design/icons';

export default function ColunasConsulta({
  perfil,
  setIdAvocarSelecionado,
  setIdEncerrarSelecionado,
  selecionados,
  setSelecionados,
  filtroSelecionado,
  podeAprovarEmLote,
  listaFiltrada,
}) {
  const [allIsClicked, SetAllIsClicked] = useState(false);

  const onCheckClick = ({ checked, id, all = false }) => {
    if (all === true) {
      const arrayIdString = [];

      listaFiltrada.filter((elem) => {
        if (elem.etapa.id == 5) {
          arrayIdString.push(elem.id);
        }
      });

      setSelecionados(arrayIdString);
    }
    if (all === false) {
      setSelecionados([]);
    }

    if (checked === true) {
      const newSelecionados = [...selecionados];
      newSelecionados.push(id);
      setSelecionados(newSelecionados);
    }

    if (checked === false) {
      const newSelecionados = selecionados.filter(
        (aprovacao) => aprovacao !== id,
      );
      setSelecionados(newSelecionados);
    }
  };

  const colunas = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: (
        <Tooltip
          title={
            <div style={{ whiteSpace: 'pre-line' }}>
              <p>
                Critérios: situação do prefixo de origem com vacância (claros)
                acima de 10%.
              </p>

              <p>
                Institucional: compreende o período de um ano (365 dias) a
                partir da posse na função, cargo ou dependência. (IN 369-1).
              </p>

              <p>
                Relacionamento com o Cliente: compreende o período de um ano
                (365 dias) após decorrido o prazo do indicador Institucional.
                (IN 369-1).
              </p>
            </div>
          }
        >
          Tipo de Flexibilização <InfoCircleOutlined />
        </Tooltip>
      ),
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
      /* title: 'Claros Origem', */
      title: 'Claros',

      render: (text, record) => {
        return <p>{record.clarosOrigem}%</p>;
      },
    },
    {
      /* title: 'Diretoria Origem', */
      title: 'Diretoria',

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
      backgroundColor: 'red',
      title: 'Claros ',
      /*     title: 'Claros Destino', */
      render: (text, record) => {
        return <p>{record.clarosDestino}%</p>;
      },
    },
    {
      title: 'Diretoria',
      /*       title: 'Diretoria Destino', */

      render: (text, record) => {
        let formated = JSON.parse(record.analise.dadosDestino);
        return <p>{formated.prefixoDiretoria}</p>;
      },
    },
    {
      /*  title: 'Tipo Movimentação', */
      /*      title: 'Tipo Movimentação', */
      title: 'Condição',
      /* dataIndex: 'analise.validacaoRH', */
      render: (text, record) => {
        let formated = JSON.parse(record.analise.validacaoRH);
        return <p>{formated.tipoMovimentacao}</p>;
      },
    },
    {
      title: 'Vant',
      /*  title: 'Vantagem', */

      render: (text, record) => {
        let formated = JSON.parse(record.analise.validacaoRH);
        const sim = /sim|Sim/.test(formated.movimentacao[0].valor);
        return <p>{sim ? 'Sim' : 'Não'}</p>;
      },
    },
    {
      title: 'Prazo Inst.Rel.',
      /* dataIndex: 'analise.validacaoRH', */
      render: (text, record) => {
        let formated = JSON.parse(record.analise.validacaoRH);
        let regs = /IMPEDIDO/.test(formated.validacao[8].valor);
        let brake = formated.validacao[8].valor.split(' ');
        return <p>{regs ? brake[2] : 'NÃO'}</p>;
      },
    },
    {
      /*  title: 'Impedimento ODI', */
      title: 'ODI',
      /* dataIndex: 'analise.validacaoRH', */
      render: (text, record) => {
        let formated = JSON.parse(record.analise.validacaoRH);
        const regs = /SEM/.test(formated.validacao[5].valor);

        return <p>{regs ? 'Não' : 'Sim'}</p>;
      },
    },

    {
      title: 'Ações',
      render: (dados) => (
        <ConsultaAcoes
          idPedidoFlex={dados.id}
          pedidoFlex={dados}
          etapa={dados.etapa}
          perfil={perfil}
          setIdAvocarSelecionado={setIdAvocarSelecionado}
          setIdEncerrarSelecionado={setIdEncerrarSelecionado}
          filtroSelecionado={filtroSelecionado}
        />
      ),
    },
  ];

  if (filtroSelecionado == 1 && podeAprovarEmLote) {
    colunas.unshift({
      title: (
        <Space direction="vertical">
          Seleção
          <Checkbox
            onChange={(e) => {
              SetAllIsClicked(!allIsClicked);
              onCheckClick({
                all: !allIsClicked,
              });
            }}
          />
        </Space>
      ),
      align: 'center',
      render: (record) => {
        /* console.log('RECORD', record); */
        if (record.etapa.id == 5) {
          return (
            <Space>
              <Checkbox
                checked={selecionados.includes(record.id)}
                onChange={(e) =>
                  onCheckClick({
                    checked: e.target.checked,
                    id: record.id,
                  })
                }
              />
            </Space>
          );
        }
      },
    });
  }

  return colunas;
}
