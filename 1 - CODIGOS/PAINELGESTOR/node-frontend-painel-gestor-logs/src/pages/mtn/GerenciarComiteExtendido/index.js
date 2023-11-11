import React, { useEffect, useState } from "react";
import { Col, Input, Row, Space, Typography, Spin } from 'antd';
import { getComite } from './internalFunctions/apiCalls';
import { PessoaComite } from './internalComponents/PessoaComite';
import { IncluirPessoaComite } from './internalComponents/IncluirPessoaComite';

const { Title } = Typography;

function GerenciarComiteExtendido() {
  const [comite, setComite] = useState(false);
  const [filteredComite, setFilteredComite] = useState([]);

  useEffect(() => {
    reloadComite();
  }, []);

  useEffect(() => {
    setFilteredComite(comite);
  }, [comite]);

  const filterComite = (value) => {
    setFilteredComite(comite.filter(({ nome, matricula }) => {
      return nome.toLowerCase().includes(value.toLowerCase())
        || matricula.toUpperCase().includes(value.toUpperCase());
    }));
  };

  const reloadComite = () => getComite(setComite);

  const addToComite = (newPessoa) => {
    const comiteFiltered = comite
      .filter(elem => elem.matricula !== newPessoa.matricula);
    setComite([newPessoa].concat(comiteFiltered));
  };

  if (!filteredComite) {
    return (
      <div style={{ width: '100%', height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: '1em' }}>
        <Title level={3}>Comite</Title>
        <Input.Search
          type="text"
          placeholder="Matricula ou Nome"
          onSearch={filterComite}
          allowClear
          enterButton="Procurar"
          size="middle"
        />
        <IncluirPessoaComite addToComite={addToComite} />
      </Space>
      <Row gutter={[16, 16]}>
        {
          filteredComite.map(({
            matricula,
            nome,
            data_expiracao: dataExpiracao,
            prefixo,
          }) => {
            return (
              <Col span={8} key={matricula}>
                <PessoaComite
                  matricula={matricula}
                  nome={nome}
                  dataExpiracao={dataExpiracao}
                  prefixo={prefixo}
                  reloadComite={reloadComite}
                />
              </Col>
            );
          })
        }
      </Row>
    </>
  );
}

export default GerenciarComiteExtendido;