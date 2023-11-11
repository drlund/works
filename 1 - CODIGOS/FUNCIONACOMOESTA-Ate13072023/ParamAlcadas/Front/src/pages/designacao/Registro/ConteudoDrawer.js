import React, { useState, useLayoutEffect } from 'react';
import SearchTable from 'components/searchtable/SearchTable';
import TabelaTemplates from 'pages/designacao/Registro/TabelaTemplates';
import { Button, Drawer, message, Skeleton, Typography } from 'antd';
import PageLoading from 'components/pageloading/PageLoading';
import useEffectOnce from 'utils/useEffectOnce';
import StyledCard from 'components/styledcard/StyledCard';
import { getAllTemplates, setTemplate } from 'services/ducks/Designacao.ducks';
import InnerDrawer from './InnerDrawer';
import { RedoOutlined } from '@ant-design/icons';

const ConteudoDrawer = () => {
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState(false);
  const [novoTemplate, setNovoTemplate] = useState(false);
  const [id, setId] = useState(null);

  const [atualizar, setAtualizar] = useState(false);

  const fetchTemplates = () => {
    setLoading((prev) => true);
    getAllTemplates(1)
      .then((templates) => setTemplates((prev) => templates))
      .catch((error) => message.error(error))
    setLoading((prev) => false);
  }

  useEffectOnce(() => {
    fetchTemplates();
  })

  useLayoutEffect(() => {
    if (atualizar) {
      fetchTemplates();
    }

    setAtualizar(prev => false)
  }, [atualizar]);

  const criarTemplate = () => {
    setNovoTemplate((prev) => true);
  }

  const fecharInnerDrawer = () => {
    setNovoTemplate((prev) => false);
    setId(prev => null);
    setAtualizar(prev => true);
  }

  const NovoTemplate = () => {
      return (
        <Drawer
          visible={novoTemplate}
          width={"60%"}
          destroyOnClose
          maskClosable
          closable={false}
          onCancel={fecharInnerDrawer}
          footer={[
            <Button key={1} onClick={fecharInnerDrawer}>
              Fechar
            </Button>,
          ]}
        >
          <InnerDrawer id={id} close={fecharInnerDrawer} />
        </Drawer>
      );
  }

  const editar = (idt) => {
    setId(prev => idt);
    criarTemplate();
  }

  const deletar = async (idt) => {
    await setTemplate({id: idt, excluir: 1});
    fecharInnerDrawer();
  }

  const tabela = () => {
    return (
      <StyledCard title={<Typography.Title level={4}>Templates</Typography.Title>} extra={<><Button type='link' onClick={() => criarTemplate()}>Novo Template</Button><Button icon={<RedoOutlined />} onClick={() => setAtualizar(prev => true)} /></>}>
        <SearchTable
          columns={TabelaTemplates({
            metodos: {
              editar: editar,
              deletar: deletar
            }
          })}
          locale={{
            emptyText: loading && <><Skeleton active /><Skeleton active /><Skeleton active /></>
          }}
          dataSource={templates}
          size="small"
          loading={
            loading
              ? {
                spinning: loading,
                indicator: <PageLoading customClass="flexbox-row" />,
              }
              : false
          }
        />
      </StyledCard>
    )
  }

  return (
    <>
      {tabela()}
      {NovoTemplate()}
    </>
  )

}

export default React.memo(ConteudoDrawer);