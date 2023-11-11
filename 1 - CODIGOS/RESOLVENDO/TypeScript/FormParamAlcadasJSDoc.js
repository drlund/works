// Aqui está o código com a adição de anotações JSDoc:

import { Button, Card, Col, Form, Input, message, Row, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import history from 'history.js';
import InputPrefixo from 'components/inputsBB/InputPrefixo';
import InputPrefixoAlcada from 'components/inputsBB/InputPrefixoAlcada';

import { useSelector } from 'react-redux';
import { getPermissoesUsuario } from 'utils/getPermissoesUsuario';
import useUsuarioLogado from 'hooks/useUsuarioLogado';

import {
  gravarParametro,
  getCargosComissoesFot09,
  getJurisdicoesSubordinadas,
  listaComiteParamAlcadas
} from '../../apiCalls/apiParamAlcadas';
import './ParamAlcadasForm.css';

const { TextArea } = Input;

/**
 * @typedef {Object} LocationState
 * @property {number} idParametro - O ID do parâmetro
 * @property {string} prefixoDestino - O prefixo de destino
 * @property {string} nomePrefixo - O nome do prefixo
 * @property {string} comite - O comitê
 * @property {string} nomeComite - O nome do comitê
 */

/**
 * @typedef {Object} DadosDoUsuario
 * @property {string} prefixo - O prefixo
 * @property {string} matricula - A matrícula
 * @property {string} nome_usuario - O nome do usuário
 */

/**
 * @typedef {Object} ComissaoDestinoOption
 * @property {string} cod_cargo - O código do cargo
 * @property {string} nome_cargo - O nome do cargo
 */

/**
 * @typedef {Object} DadosForm
 * @property {Object} prefixoDestino - O prefixo de destino
 * @property {string} prefixoDestino.value - O valor do prefixo de destino
 * @property {string} nomePrefixo - O nome do prefixo
 * @property {Object} comite - O comitê
 * @property {string} comite.value - O valor do comitê
 * @property {string} nomeComite - O nome do comitê
 * @property {string} observacao - A observação
 */

/**
 * @typedef {Object} DadosParametro
 * @property {Object} prefixoDestino - O prefixo de destino
 * @property {string} prefixoDestino.value - O valor do prefixo de destino
 * @property {string} nomePrefixo - O nome do prefixo
 * @property {Object} comite - O comitê
 * @property {string} comite.value - O valor do comitê
 * @property {string} nomeComite - O nome do comitê
 * @property {string} observacao - A observação
 */

/**
 * @typedef {Object} FormParamAlcadasProps
 * @property {import('history').Location<LocationState>} location - O objeto de localização
 */

/**
 * @typedef {Object} FormLayout
 * @property {Object} labelCol - O layout da coluna de rótulo
 * @property {Object} wrapperCol - O layout da coluna de conteúdo
 */

/**
 * @typedef {Object} FormTailLayout
 * @property {Object} wrapperCol - O layout da coluna de conteúdo
 * @property {number} wrapperCol

.offset - A margem da coluna de conteúdo
 * @property {number} wrapperCol.span - A largura da coluna de conteúdo
 */

/**
 * @typedef {Object} Props
 * @property {Object} form - O formulário do Ant Design
 */

/**
 * @typedef {Object} PrefixoSubordinado
 * @property {string} prefixo_subordinada - O prefixo subordinado
 */

/**
 * @typedef {Object} Jurisdicao
 * @property {string} prefixo - O prefixo
 */

/**
 * @typedef {Object} ComitePrefixo
 * @property {string} prefixo - O prefixo
 */

/**
 * @typedef {Object} ComiteParamAlcada
 * @property {string} prefixo - O prefixo
 */

/**
 * Componente de formulário ParamAlcadas.
 * @param {FormParamAlcadasProps} props - As props do componente
 * @returns {JSX.Element} O elemento JSX do componente
 */
function FormParamAlcadas({ location }) {
  const authState = useSelector((state) => state.app.authState);
  const permissao = getPermissoesUsuario('Movimentações', authState);
  const { idParametro } = parseInt(location.state.id, 10);
  const [, setDadosParametroForm] = useState();
  const [form] = Form.useForm();
  const dadosDoUsuario = useUsuarioLogado();
  const [comissaoDestinoOptions, setComissaoDestinoOptions] = useState([]);
  const [, setJurisdicaoUsuario] = useState('');
  const [nomeComissaoDestino] = useState('');

  const [prefixoDestino, setPrefixoDestino] = useState('');
  const [comite, setComite] = useState('');

  const [prefixosSubordinados, setPrefixosSubordinados] = useState([]);
  const [temComite, setTemComite] = useState([]);

  const initialValues = {
    comissaoDestino: undefined,
    prefixo: prefixoDestino,
  };

  const {
    prefixo: prefixoUsuario,
    matricula,
    nome_usuario: nomeUsuario,
  } = dadosDoUsuario;

  /**
   * Função que busca as jurisdições subordinadas.
   * @param {Object} prefixoDestino - O prefixo de destino
   */
  useEffect(() => {
    if (![null, undefined, 'NaN'].includes()) {
      /**
       * @param {string} prefixoDestino.value - O valor do prefixo de destino
       */
      getJurisdicoesSubordinadas(prefixoDestino)
        .then((jurisdicoes) => {
          setJurisdicaoUsuario(jurisdicoes[0]);
        })
        .catch(() => {
          setJurisdicaoUsuario('');
        });
    }
  }, []);

  /**
   * Função que busca os comitês.
   * @param {Object} comite - O comitê
   */
  function buscarComites(comite) {
    if (comite.value) {
      setComite(comite.value);
      listaComiteParamAlcadas(comite.value)
        .then((result) => {
          const comitePrefixo = result.map((item) => item.prefixo);
          setTemComite(comitePrefixo);
          console.log(comitePrefixo);
        })
        .catch(() => {
          setTemComite([]);
        });
    } else {
      setTemComite([]);
    }
  }

  /**
   * Função que busca os prefixos subordinados

.
   * @param {string} prefixo - O prefixo
   */
  function buscarPrefixosSubordinados(prefixo) {
    if (prefixo) {
      setPrefixoDestino(prefixo);
      getCargosComissoesFot09(prefixo)
        .then((result) => {
          const prefixos = result.map((item) => item.prefixo_subordinada);
          setPrefixosSubordinados(prefixos);
          console.log(prefixos);
        })
        .catch(() => {
          setPrefixosSubordinados([]);
        });
    } else {
      setPrefixosSubordinados([]);
    }
  }

  /**
   * Função para tratar o submit do formulário.
   * @param {DadosForm} values - Os valores do formulário
   */
  function onFinish(values) {
    const { prefixoDestino, comite, observacao } = values;

    const dadosParametro = {
      prefixoDestino: prefixoDestino.value,
      nomePrefixo: prefixoDestino.label,
      comite: comite.value,
      nomeComite: nomeComissaoDestino,
      observacao,
    };

    gravarParametro(dadosParametro)
      .then(() => {
        message.success('Parâmetro salvo com sucesso!');
        history.push('/parametros-alcadas');
      })
      .catch(() => {
        message.error('Erro ao salvar parâmetro!');
      });
  }

  return (
    <Card>
      <Row>
        <Col span={12}>
          <Form
            form={form}
            initialValues={initialValues}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item label="Prefixo de destino" name="prefixoDestino">
              <InputPrefixo
                id="prefixoDestino"
                onChange={buscarPrefixosSubordinados}
                prefixosSubordinados={prefixosSubordinados}
              />
            </Form.Item>
            <Form.Item label="Comitê" name="comite">
              <Select
                onChange={buscarComites}
                options={comissaoDestinoOptions}
              />
            </Form.Item>
            <Form.Item label="Observação" name="observacao">
              <TextArea />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Salvar
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Card>
  );
}

export default FormParamAlcadas;

/** 
 * Observe que adicionei as anotações JSDoc para as props do componente, os tipos dos parâmetros e os tipos 
 * de retorno das funções. Além disso, incluí anotações para os objetos de dados usados no componente, como 
 * `LocationState`, `DadosDoUsuario`, `ComissaoDestinoOption`, `DadosForm`, `DadosParametro`, entre outros.
 * 
 * Certifique-se de que o JSDoc esteja alinhado com os tipos reais dos dados em seu código para garantir que 
 * as ferramentas e editores corretamente reconheçam essas anotações.
*/