import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getPermissoesUsuario } from 'utils/getPermissoesUsuario';

import SearchTable from 'components/searchtable/SearchTable';
import {
  Col,
  Button,
  Popconfirm,
  Select,
  Row,
  Divider,
  Card,
  Space,
  message,
} from 'antd';
import {
  getDadosJurisdicaoPorPrefixo,
  getListaDePrefixos,
  postVincularSubordinadaProprioPrefixo,
  deleteSubordinadaPropriaJurisdicao,
  deleteSubordinadaQualquerJurisdicao,
  postVincularSubordinadaQualquerPrefixo,
} from 'pages/movimentacoes/apiCalls/apiMovimentacoesJurisdicao';
import { DeleteOutlined } from '@ant-design/icons';

function GerenciarJurisdicao() {
  const [subordinanteSelecionada, setSubordinanteSelecionada] = useState();
  const [subordinadaSelecionada, setSubordinadaSelecionada] = useState();
  const [selectOptions, setSelectOptions] = useState([]);
  const [dadosSearch, setDadosSearch] = useState([]);
  const authState = useSelector((state) => state.app.authState);
  const permissao = getPermissoesUsuario('Movimentações', authState);

  const onGetListaPrefixosGerenciaveis = async () => {
    let futureData = [];
    if (permissao.includes('ADM_JURISDICAO_QUALQUER')) {
      futureData = await getListaDePrefixos();
    } else if (permissao.includes('ADM_JURISDICAO_PROPRIA')) {
      futureData = await getListaDePrefixos(authState.sessionData.prefixo);
    }
    const arrayFormatadaProSelect2 = futureData.map((itemAtual) => {
      return { value: JSON.stringify(itemAtual), label: itemAtual.prefixo };
    });

    setSelectOptions(arrayFormatadaProSelect2);
  };

  useEffect(() => {
    onGetListaPrefixosGerenciaveis().catch(() => {
      message.error('Erro ao carregar lista de subordinantes e subordinadas.');
    });
  }, []);

  const gerenciarJurisdicaoColumns = [
    {
      title: 'Prefixo',
      dataIndex: 'prefixo',
      render: (prefixo) => String(prefixo).padStart(4, '0'),
    },
    {
      title: 'Nome',
      dataIndex: 'nome',
    },
    {
      title: 'Uor',
      dataIndex: 'uor',
    },
    {
      title: 'Ações',
      width: '10%',
      align: 'center',
      render: (text, record) => (
        <span>
          <Popconfirm
            title={
              <div>
                Deseja excluir o prefixo
                {record.prefixo}?
              </div>
            }
            placement="left"
            onConfirm={() => {
              onRemoverSubordinada(record.prefixo_subordinante, record.prefixo);
            }}
          >
            <DeleteOutlined className="link-color" />
          </Popconfirm>
        </span>
      ),
    },
  ];

  const onSearchSubordinadas = (prefixo) => {
    getDadosJurisdicaoPorPrefixo(prefixo)
      .then(({ subordinadas }) => setDadosSearch(subordinadas))
      .catch(() => {
        message.error(
          `Erro ao carregar lista de subordinantes e subordinadas para o prefixo ${prefixo}.`,
        );
      });
  };

  const onSelect = (value) => {
    const parsedValue = JSON.parse(value);
    setSubordinanteSelecionada(parsedValue);
    onSearchSubordinadas(parsedValue.prefixo);
  };

  const reloadSubordinadas = () => {
    onSearchSubordinadas(subordinanteSelecionada.prefixo);
  };

  const onRemoverSubordinada = (prefixoSubordinante, prefixo) => {
    if (authState.sessionData.prefixo === prefixoSubordinante) {
      deleteSubordinadaPropriaJurisdicao(prefixo)
        .then(() => {
          message.success('Prefixo removido com sucesso.');
        })
        .catch(() => {
          message.error('Erro ao remover subordinada.');
        })
        .finally(() => reloadSubordinadas());
    } else {
      deleteSubordinadaQualquerJurisdicao(prefixo)
        .then(() => {
          message.success('Prefixo removido com sucesso.');
        })
        .catch(() => {
          message.error('Erro ao remover subordinada.');
        })
        .finally(() => reloadSubordinadas());
    }
  };

  const onVincularSubordinada = () => {
    const data = {
      uor: subordinadaSelecionada.uor,
      prefixo: subordinadaSelecionada.prefixo,
      nome: subordinadaSelecionada.nome,
      uor_subordinante: subordinanteSelecionada.uor,
      prefixo_subordinante: subordinanteSelecionada.prefixo,
      nome_subordinante: subordinanteSelecionada.nome,
    };

    if (authState.sessionData.prefixo === subordinanteSelecionada.prefixo) {
      postVincularSubordinadaProprioPrefixo(data)
        .then(() => {
          message.success('Prefixo vinculado com sucesso.');
          onSearchSubordinadas(subordinanteSelecionada.prefixo);
        })
        .catch((err) => {
          message.error(err);
        });
      return;
    } else {
      postVincularSubordinadaQualquerPrefixo(data)
        .then(() => {
          message.success('Prefixo vinculado com sucesso.');
          onSearchSubordinadas(subordinanteSelecionada.prefixo);
        })
        .catch((err) => {
          message.error(err);
        });
      return;
    }
  };

  return (
    <>
      <Col span={24} style={{ marginLeft: 10 }}>
        <Divider orientation="left">Jurisdicionante</Divider>
        <Space direction="horizontal" size="large">
          <Select
            onSelect={(value) => {
              onSelect(value);
            }}
            showSearch
            style={{ width: 200 }}
            placeholder="Informe o prefixo"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '')
                .toLowerCase()
                .localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={selectOptions}
          />
          <span>{subordinanteSelecionada?.nome}</span>
        </Space>

        <Divider orientation="left">Jurisdicionada</Divider>
        <Space direction="horizontal" size="large">
          <Select
            disabled={!subordinanteSelecionada}
            onSelect={(value) => setSubordinadaSelecionada(JSON.parse(value))}
            showSearch
            style={{ width: 200 }}
            placeholder="Informe o prefixo"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '')
                .toLowerCase()
                .localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={selectOptions}
          />
          <span>{subordinadaSelecionada?.nome}</span>
        </Space>

        <Row style={{ width: 200 }}>
          <Button
            size="large"
            style={{ marginTop: 15 }}
            disabled={!subordinadaSelecionada}
            key="submit"
            type="primary"
            onClick={() => onVincularSubordinada()}
            block
          >
            Vincular jurisdicionada{' '}
          </Button>
        </Row>

        {subordinanteSelecionada && (
          <Card style={{ marginTop: 15 }}>
            {dadosSearch?.length ? (
              <span>Jurisdicionadas de {subordinanteSelecionada?.nome}</span>
            ) : (
              <span>
                Prefixo {subordinanteSelecionada?.nome} sem jurisdicionadas
                cadastradas.
              </span>
            )}

            <SearchTable
              columns={gerenciarJurisdicaoColumns}
              dataSource={dadosSearch}
              size="small"
              pagination={{ showSizeChanger: true }}
            />
          </Card>
        )}
      </Col>
    </>
  );
}

export default GerenciarJurisdicao;
