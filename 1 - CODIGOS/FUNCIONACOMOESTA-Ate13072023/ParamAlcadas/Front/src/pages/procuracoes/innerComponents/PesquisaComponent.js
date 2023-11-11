import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Typography } from 'antd';
import React, { useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { fetch, FETCH_METHODS } from 'services/apis/GenericFetch';

const { Text } = Typography;

/**
 * @param {Object} props
 * @param {(lista: Procuracoes.Poderes['outorgantes']) => void} props.handlePesquisa
 * @param {boolean} [props.showAll] se true, retorna todas as versões dos outorgantes, se não apenas a mais recente
 */
export function PesquisaComponent({ handlePesquisa, showAll = false }) {
  const [pesquisa, setPesquisa] = useState('');
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(/** @type {string|boolean} */(false));
  /** @type {React.MutableRefObject<import('antd').InputRef>} */
  const pesquisaRef = useRef(null);

  const focusInput = () => pesquisaRef.current?.focus();

  useLayoutEffect(() => {
    if (pesquisaRef.current) {
      focusInput();
    }
  }, [pesquisa, pesquisaRef.current]);

  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
  const handleChange = ({ target: { value } }) => setPesquisa(value);

  const handleSubmit = () => {
    if (pesquisa.trim().length < 4) {
      return setError('É necessário adicionar uma pesquisa.');
    }

    setError(false);
    setFetching(true);

    return fetch(FETCH_METHODS.POST, '/procuracoes/pesquisa', {
      pesquisa: pesquisa.toString(),
      // se retorna todas as versões dos outorgantes
      // ou apenas cada versão mais recente
      maisRecente: !showAll,
    })
      .then(handlePesquisa)
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setFetching(false);
        focusInput();
      });
  };

  return (
    <>
      <DisplayText>
        Informe a matrícula, nome do funcionário ou prefixo desejado para pesquisar
      </DisplayText>
      <PesquisaInputGroup
        compact
      >
        <PesquisaInput
          placeholder="Número do prefixo, matrícula ou nome"
          onChange={handleChange}
          onPressEnter={handleSubmit}
          disabled={fetching}
          ref={pesquisaRef}
          name="pesquisa"
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSubmit}
          disabled={fetching}
        >
          Buscar
        </Button>
      </PesquisaInputGroup>
      {showAll
        ? (
          <DisplayForSmallerText>
            <SmallerBlockText>Os itens são ordenados pela ordem de cadastramento, sendo os mais recentes primeiro.</SmallerBlockText>
            <SmallerBlockText>Verifique os vencimentos de cada substalecimento conforme o documento emitido.</SmallerBlockText>
          </DisplayForSmallerText>
        ) : null
      }
      {
        error
          ? (
            <ErrorText
              type="danger"
            >
              {error}
            </ErrorText>
          )
          : null
      }
    </>
  );
}

const DisplayText = styled(Text)`
  display: inline-block;
  margin-bottom: 1em;
`;

const DisplayForSmallerText = styled.div`
  display: inline-block;
  margin-top: 1em;
`;

const SmallerBlockText = styled(Text)`
  display: block;
  font-size: 0.8rem;
`;

const PesquisaInputGroup = styled(Input.Group)`
  && {
    display: flex;
  }
  width: min(400px, 50%);
`;

const PesquisaInput = styled(Input)`
  &&& {
    margin-right: 1em;
  }
`;

const ErrorText = styled(Text)`
  display: inline-block;
  margin-top: 0.5em;
  margin-left: 0.5em;
`;