import React from 'react';
import uuid from 'uuid/v4';
import moment from 'moment';
import AlfaSort from 'utils/AlfaSort';
import _ from 'lodash';
import { Tag } from 'antd';

const columns = [
  {
    key: uuid(),
    dataIndex: 'nm_gedip',
    title: 'GEDIP',
    width: '5%',
    sorter: (a, b) => parseInt(a.nm_gedip) - parseInt(b.nm_gedip),
    render: (text, record) => {
      return (record.nm_gedip)
    },
  },
  {
    key: uuid(),
    dataIndex: 'dt_julgamento_gedip',
    title: 'Data da Decisão',
    width: '5%',
    sorter: (a, b) => parseInt(moment(a.dt_julgamento_gedip).format("YYYYMMDD")) - parseInt(moment(b.dt_julgamento_gedip).format("YYYYMMDD")),
    render: (text, record) => {
      return (moment(record.dt_julgamento_gedip).format("DD/MM/YYYY"))
    },
  },
  {
    key: uuid(),
    dataIndex: 'nm_medida',
    title: 'Decisão',
    width: '5%',
    sorter: (a, b) => AlfaSort(a.medida.nm_medida, b.medida.nm_medida),
    render: (text, record) => {
      return (record.nm_medida)
    },
  },
  {
    key: uuid(),
    dataIndex: 'funcionario_gedip',
    title: 'Funcionário',
    width: '5%',
    sorter: (a, b) => parseInt(a.funcionario_gedip.replace(/[^0-9\\.]+/g, '')) - parseInt(b.funcionario_gedip.replace(/[^0-9\\.]+/g, '')),
    render: (text, record) => {
      return (record.funcionario_gedip)
    },
  },
  {
    key: uuid(),
    dataIndex: 'dt_limite_execucao',
    title: 'Prazo p/ Execução',
    width: '5%',
    sorter: (a, b) => parseInt(moment(a.dt_limite_execucao).format("YYYYMMDD")) - parseInt(moment(b.dt_limite_execucao).format("YYYYMMDD")),
    render: (text, record) => {

      const praz = moment.duration(moment(record.dt_limite_execucao).diff(moment())).asDays();

      let cor;

      const uploaded = !_.isEmpty(record.documento);

      if (!uploaded) {

        if (praz >= -1) {
          if (praz > 1) {
            cor = "#293462";
          } else {
            cor = "#EC9B3B";
          }
        } else {
          cor = "#B22222";
        }
      } else {
        cor = "#50C878"
      }


      return (
        <>
          <Tag color={cor} key={uuid()}>
            {moment(record.dt_limite_execucao).format("DD/MM/YYYY")}
          </Tag>
        </>
      )
    },
  }
];

export default columns;