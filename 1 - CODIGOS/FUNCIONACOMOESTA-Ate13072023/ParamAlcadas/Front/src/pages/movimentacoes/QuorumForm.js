import React, { useState, useEffect } from 'react';
import SearchTable from 'components/searchtable/SearchTable';
import {
  PlusOutlined,
  RedoOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { getPermissoesUsuario } from 'utils/getPermissoesUsuario';
import {
  Card,
  Tooltip,
  Button,
  Row,
  Col,
  Space,
  Modal,
  Divider,
  Popconfirm,
  message,
} from 'antd';
import {
  getDadosTodosQuoruns,
  getDadosQuorumMeuPrefixo,
  deleteQuorumMeuPrefixo,
  deleteQuorumQualquerPrefixo,
  patchQuorumMeuPrefixo,
  patchQuorumQualquerPrefixo,
  postQuorumMeuPrefixo,
  postQuorumQualquerPrefixo,
} from './apiCalls/apiMovimentacoesQuorum';
import { QuorumCard } from './components/quorumCard';
import './QuorumForm.css';

function QuorumForm() {
  const authState = useSelector((state) => state.app.authState);
  const permissao = getPermissoesUsuario('Movimentações', authState);
  const [fetching, setFetching] = useState(true);
  const [prefixoNaLista, setPrefixoNaLista] = useState(false);
  const [meuQuorum, setMeuQuorum] = useState();
  const [quoruns, setQuoruns] = useState([{}]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [formPrefixo, setFormPrefixo] = useState('');
  const [formQuorum, setFormQuorum] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [disableSave, setDisableSave] = useState(true);

  const columns = [
    {
      title: 'Prefixo',
      dataIndex: 'prefixo',
      render: (prefixo) => String(prefixo).padStart(4, '0'),
    },
    {
      title: 'Quórum',
      dataIndex: 'quorum',
    },
    {
      title: 'Última modificação',
      dataIndex: 'dtAtualizacao',
    },
    {
      title: 'Ações',
      width: '10%',
      align: 'center',
      render: (text, record) => (
        <span>
          <Tooltip title="Editar">
            <EditOutlined
              className="link-color link-cursor"
              onClick={() => onEditarPrefixo(record)}
            />
          </Tooltip>
          <Divider type="vertical" />
          <Popconfirm
            title={<>Deseja excluir o prefixo {record.prefixo}?</>}
            placement="left"
            onConfirm={() => onRemoverPrefixo(record.prefixo)}
          >
            <DeleteOutlined className="link-color" />
          </Popconfirm>
        </span>
      ),
    },
  ];

  const onGetDadosQuoruns = async () => {
    const { quorum } = await getDadosQuorumMeuPrefixo();
    if (quorum) {
      setMeuQuorum(quorum);
      setPrefixoNaLista(true);
    } else {
      setMeuQuorum(0);
    }
    if (permissao.includes('ADM_QUORUM_QUALQUER')) {
      const quors = await getDadosTodosQuoruns();
      setQuoruns(quors);
    }
  };

  useEffect(() => {
    setFetching(true);
    onGetDadosQuoruns()
      .catch(() => {
        message.error('Erro ao carregar lista de quóruns');
      })
      .finally(() => {
        setFetching(false);
      });
  }, []);

  useEffect(() => {
    if (visibleModal) {
      const filterToEnableSave = quoruns.filter(
        (single) => single.prefixo === formPrefixo,
      );
      if (
        formQuorum === filterToEnableSave[0]?.quorum ||
        !formPrefixo ||
        !formQuorum
      ) {
        setDisableSave(true);
      } else {
        setDisableSave(false);
      }
    }
  }, [visibleModal, formQuorum]);

  const onAdicionarPrefixo = () => {
    setFormPrefixo('');
    setFormQuorum('');
    setFormTitle('Criar quórum');
    setVisibleModal(true);
  };

  const onEditarPrefixo = (registro) => {
    try {
      setFormPrefixo(registro.prefixo);
      setFormQuorum(registro.quorum);
      setFormTitle('Editar quórum');
    } catch (error) {
      message.error(`Erro ao editar prefixo ${registro.prefixo}.`);
    } finally {
      setVisibleModal(true);
    }
  };

  const onRemoverPrefixo = async (prefixo) => {
    if (authState.sessionData.prefixo === prefixo) {
      try {
        await deleteQuorumMeuPrefixo();
        setPrefixoNaLista(false);
      } catch (error) {
        message.error(`Erro ao remover prefixo ${prefixo}.`);
      } finally {
        await onGetDadosQuoruns();
      }
    } else {
      try {
        await deleteQuorumQualquerPrefixo(prefixo);
      } catch (error) {
        message.error(`Erro ao remover prefixo ${prefixo}.`);
      } finally {
        await onGetDadosQuoruns();
      }
    }
  };

  const onRecarregar = () => {
    setFetching(true);
    onGetDadosQuoruns()
      .catch(() => {
        message.error('Erro ao carregar lista de quóruns');
      })
      .finally(() => {
        setTimeout(() => {
          setFetching(false);
        }, 1000);
      });
  };

  const onUpdatePrefixForm = (newPrefixo) => {
    setFormPrefixo(newPrefixo);
  };

  const onUpdateQuorumForm = (newQuorum) => {
    setFormQuorum(newQuorum);
  };

  const onSalvarMeuPrefixo = async (atualQuorum) => {
    if (prefixoNaLista) {
      try {
        await patchQuorumMeuPrefixo(atualQuorum);
      } catch (error) {
        message.error('Erro ao salvar prefixo próprio.');
      } finally {
        onRecarregar();
      }
    } else {
      try {
        await postQuorumMeuPrefixo(atualQuorum);
      } catch (error) {
        message.error('Erro ao salvar prefixo próprio.');
      } finally {
        onRecarregar();
      }
    }
  };

  const onSalvarEdicao = async () => {
    if (
      formTitle.includes('Criar') &&
      authState.sessionData.prefixo === formPrefixo
    ) {
      try {
        await onSalvarMeuPrefixo(formQuorum);
      } catch (error) {
        message.error('Erro ao salvar prefixo próprio.');
      } finally {
        setDisableSave(true);
        onRecarregar();
        setVisibleModal(false);
      }
      return;
    }

    if (
      formTitle.includes('Criar') &&
      authState.sessionData.prefixo !== formPrefixo
    ) {
      try {
        await postQuorumQualquerPrefixo({
          prefixo: formPrefixo,
          quorum: formQuorum || 0,
        });
      } catch (error) {
        message.error(`Erro ao salvar prefixo ${formPrefixo}`);
      } finally {
        setDisableSave(true);
        onRecarregar();
        setVisibleModal(false);
      }
      return;
    }

    if (
      formTitle.includes('Editar') &&
      authState.sessionData.prefixo === formPrefixo
    ) {
      try {
        await onSalvarMeuPrefixo(formQuorum);
      } catch (error) {
        message.error(`Erro ao salvar prefixo ${formPrefixo}`);
      } finally {
        setDisableSave(true);
        onRecarregar();
        setVisibleModal(false);
      }
      return;
    }

    if (
      formTitle.includes('Editar') &&
      authState.sessionData.prefixo !== formPrefixo
    ) {
      try {
        await patchQuorumQualquerPrefixo({
          prefixo: formPrefixo,
          quorum: formQuorum,
        });
      } catch (error) {
        message.error(`Erro ao salvar prefixo ${formPrefixo}`);
      } finally {
        onRecarregar();
        setDisableSave(true);
        setVisibleModal(false);
      }
    }
  };

  const renderActionButtons = () => (
    <Row style={{ marginBottom: '15px' }}>
      <Col span={24} style={{ textAlign: 'right' }}>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => {
            onAdicionarPrefixo();
          }}
        >
          Adicionar Prefixo
        </Button>
        <Button
          icon={<RedoOutlined />}
          loading={fetching}
          style={{ marginLeft: '15px' }}
          onClick={() => onRecarregar()}
        />
      </Col>
    </Row>
  );

  return (
    <Space direction="vertical" size="large" style={{ display: 'flex' }}>
      <Row>
        {permissao.includes('ADM_QUORUM_PROPRIO' || 'ADM_QUORUM_QUALQUER') ? (
          <Col span={24}>
            <Card title="Meu Prefixo">
              <QuorumCard
                onSalvarMeuPrefixo={onSalvarMeuPrefixo}
                prefixInputDisable
                saveButton
                prefixo={authState.sessionData.prefixo}
                quorumDoPrefixo={meuQuorum}
              />
            </Card>
          </Col>
        ) : null}
      </Row>

      <Row>
        {permissao.includes('ADM_QUORUM_QUALQUER') ? (
          <Col span={24}>
            <Card title="Todos Prefixos">
              {renderActionButtons()}
              {quoruns ? (
                <SearchTable
                  columns={columns}
                  dataSource={quoruns}
                  size="small"
                  pagination={{ showSizeChanger: true }}
                />
              ) : null}
            </Card>
          </Col>
        ) : null}

        <Modal
          closable={false}
          visible={visibleModal}
          title={formTitle}
          centered
          footer={[
            <Button
              key="back"
              onClick={() => {
                setVisibleModal(false);
                setDisableSave(true);
              }}
            >
              Cancelar
            </Button>,
            <Button
              disabled={disableSave}
              key="submit"
              type="primary"
              onClick={() => onSalvarEdicao()}
            >
              Salvar
            </Button>,
          ]}
        >
          <QuorumCard
            key={formPrefixo}
            prefixo={formPrefixo}
            quorumDoPrefixo={formQuorum}
            prefixInputDisable={formTitle.includes('Editar')}
            onUpdatePrefixForm={onUpdatePrefixForm}
            onUpdateQuorumForm={onUpdateQuorumForm}
          />
        </Modal>
      </Row>
    </Space>
  );
}

export default QuorumForm;
