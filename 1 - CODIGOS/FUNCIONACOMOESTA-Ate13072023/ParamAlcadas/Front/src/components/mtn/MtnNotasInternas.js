/* eslint-disable no-restricted-syntax */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Collapse,
  Form,
  Input,
  Button,  
  Empty,
  message,
} from 'antd';
import {
  novaNota,
  getNotasByEnvolvido,
  gravarLeituraNota,
} from 'pages/mtn/NotasInternas/apiCalls/NotasInternas';
import styles from './mtnTimeline.module.scss';

const { Panel } = Collapse;
const { TextArea } = Input;

function MtnNotasInternas({
  atualizaNotaNaoLida,
  notasInternasLidas,
  idEnvolvido,
} = props) {
  const [notasByEnvolvido, setNotasByEnvolvido] = useState([]);
  const [notasLidas, setNotasLidas] = useState(notasInternasLidas);
  const [form] = Form.useForm();

  const getNotas = () => {
    getNotasByEnvolvido(idEnvolvido)
      .then(({ notasInternas, notasInternasLidas } = listaNotas) => {
        setNotasByEnvolvido(notasInternas);
        setNotasLidas(notasInternasLidas);
        atualizaNotaNaoLida(notasInternas.length - notasInternasLidas.length);
      })
      .catch(() => {
        message.error(
          'Falha ao obter a lista de notas internas deste envolvido.',
        );
      });
  };

  useEffect(() => {
    getNotas();
  }, [idEnvolvido]);

  const onFinish = () => {
    novaNota({ ...form.getFieldsValue(), idEnvolvido })
      .then(() => {
        getNotas();
        form.resetFields();
        message.success('Nota Interna inserida com sucesso.');
      })
      .catch(() => {
        message.error('Erro ao inserir Nota Interna.');
      });
  };

  const atualizarLidos = (idsNotasLidas) => {
    /**
     * o Antd manda a lista de todos os components collapse abertos
     * o primeiro filtro é para ter a lista de collapse aberto do envolvido selecionado
     * o segundo filtro é para ficar somente com o collapse que ainda não foi gravado na tabela
     * como esse método roda a cada clique de collapse, sempre terá somente um collapse não gravado
     */
    const novasNotasLidas = idsNotasLidas
      .filter((idNota) => notasByEnvolvido.some((nota) => nota.id === parseInt(idNota)),)
      .filter(
        (idNota) => !notasLidas.some((nota) => nota.id_nota_interna === parseInt(idNota)),
      );
    if (novasNotasLidas.length) {
      const idNotaInterna = parseInt(novasNotasLidas[0]);
      gravarLeituraNota({ idEnvolvido, idNotaInterna })
        .then((atualizado) => {
          setNotasLidas(atualizado);
          notaFoiLida(idNotaInterna);
        })
        .catch(() => {
          message.error('Não foi possível marcar a nota como lida.');
        });
    }
  };

  useEffect(() => {
    atualizaNotaNaoLida(notasByEnvolvido.length - notasLidas.length);
  }, [notasLidas]);

  const notaFoiLida = (idNota) => {
    const resultado = !notasLidas.some(
      (nota) => nota.id_nota_interna === idNota,
    );
    return resultado;
  };

  const arrayNotas = [];
  for (const nota of notasByEnvolvido) {
    const elemNota = (
      <Panel
        header={(
          <Typography.Text strong={notaFoiLida(nota.id)}>
            Inserida em:
            {' '}
            {nota.created_at}
            {' '}
            por
            {' '}
            {nota.mat_resp_acao}
            -
            {nota.nome_resp_acao}
          </Typography.Text>
        )}
        key={nota.id}
      >
        <div style={{ whiteSpace: "pre-wrap" }}>
          {nota.desc_nota}
        </div>
      </Panel>
    );
    arrayNotas.push(elemNota);
  }

  return (
    <Form form={form} onFinish={onFinish} style={{ padding: 15 }}>
      <Typography.Text style={{ fontSize: '1.3em' }}>
        Texto da Nota
      </Typography.Text>
      <Form.Item name="desc_nota">
        <TextArea style={{ marginTop: 15, marginBotton: 15 }} rows={8} />
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        style={{ marginTop: 15, marginBotton: 15 }}
      >
        Adicionar Nota
      </Button>
      <Form.Item style={{ marginTop: 15, marginBotton: 15 }}>
        <Typography.Text style={{ fontSize: '1.3em' }}>
          Notas inseridas
        </Typography.Text>
        {!arrayNotas.length ? (
          <Empty description="Nenhuma Nota inserida." />
        ) : (
          <div className={styles.timelineWrapper}>
            <Collapse onChange={atualizarLidos}>{arrayNotas}</Collapse>
          </div>
        )}
      </Form.Item>
    </Form>
  );
}

export default MtnNotasInternas;
