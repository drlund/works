import React, { useState, useEffect } from 'react';
import { Form, Input, Space, message } from 'antd';
import {
  getFuncionarioAnalise,
  getPrefixoDestino,
} from 'pages/flexCriterios/apiCalls/flexFuncionariosPrefixosAPICall';
import { getFuncao } from 'pages/flexCriterios/apiCalls/flexTipoDadosAPICall';
import constantes from 'pages/flexCriterios/helpers/constantes';
import estilos from '../../flexCriterios.module.css';
import PrefixoOrigem from '../commons/cardPrefixoOrigem';
import PrefixoDestino from '../commons/cardPrefixoDestino';

const { Search } = Input;

export default function InclusaoPrefixosEnvolvidos({
  funcionarioEnvolvido,
  setFuncionarioEnvolvido,
  setLoading,
  setDadosAdicionais,
}) {
  const buscarPrefixo = (prefixo) => {
    const prefixoFormatado = prefixo.padStart(4, '0');
    getPrefixoDestino(prefixoFormatado)
      .then((destino) => {
        setFuncionarioEnvolvido({
          ...funcionarioEnvolvido,
          prefixoDestino: destino,
        });
      })
      .catch((error) => {
        message.error(error || 'Erro ao obter a lista de oportunidades.');
      });
  };

  const buscarFuncao = (codFuncao) => {
    const funcaoFormatada = codFuncao.padStart(5, '0');
    getFuncao(funcaoFormatada, funcionarioEnvolvido?.prefixoDestino?.prefixo)
      .then((funcaoBD) => {
        setLoading(true);
        getFuncionarioAnalise(
          funcionarioEnvolvido?.matricula,
          funcionarioEnvolvido?.prefixoDestino?.prefixo,
          funcaoBD.codigo,
        )
          .then((analise) => {
            setFuncionarioEnvolvido({
              ...funcionarioEnvolvido,
              existeVagaPretendida: funcaoBD.vacancia,
              cargoExiste: funcaoBD.cargoExiste,
              funcaoPretendida: funcaoBD.codigo,
              nomeFuncaoPretendida: funcaoBD.nome.trim(),
              analise,
            });
          })
          .catch(() => {
            message.error(
              'Não foi possível validar as informações do funcionário.',
            );
          })
          .finally(() => setLoading(false));
      })
      .catch((error) => {
        message.error(
          error ||
            'Função não encontrada, verifique o código e tente novamente.',
        );
      });
  };

  const setCodOportunidade = (codOportunidade) => {
    setFuncionarioEnvolvido({
      ...funcionarioEnvolvido,
      codOportunidade: true,
    });
  };

  return (
    <>
      <Space style={{ justifyContent: 'space-between' }}>
        <h3 className="ant-descriptions-title">Prefixo de Destino</h3>
        <Form.Item
          name="prefixoDestino"
          rules={[
            {
              required: true,
              message: 'Informe o prefixo de destino para a nomeação.',
            },
          ]}
        >
          <Search
            placeholder="Pesquisar por Prefixo"
            onSearch={(codPrefixo, e) => {
              buscarPrefixo(codPrefixo);
              e.preventDefault();
            }}
            enterButton
          />
        </Form.Item>
        {funcionarioEnvolvido?.prefixoDestino?.prefixo && (
          <>
            <h3 className="ant-descriptions-title">Função Pretendida</h3>
            <Form.Item
              name="funcaoPretendida"
              rules={[
                {
                  required: true,
                  message:
                    'Obrigatório informar o código da Função Pretendida.',
                },
              ]}
            >
              <Search
                placeholder="Pesquisar por Cód. Função"
                onSearch={(codFuncao, e) => {
                  buscarFuncao(codFuncao);
                  e.preventDefault();
                }}
                /*              onChange={setCodOportunidade} */
                enterButton
              />
            </Form.Item>
            <h3 className="ant-descriptions-title">Cod. da Oportunidade</h3>
            <Form.Item
              name="oportunidade"
              rules={[
                {
                  required: true,
                  message: 'Obrigatório informar o código da oportunidade.',
                },
              ]}
            >
              <Search
                placeholder="CFC000000"
                onChange={() => {
                  setCodOportunidade();
                }}
                /* onSearch={(codOportunidade, e) => {
                  setCodOportunidade(codOportunidade);
                  e.preventDefault();
                }} */
                enterButton
              />
            </Form.Item>
          </>
        )}

        {/* <Form.Item
          name="oportunidade"
          rules={[
            {
              required: true,
              message: 'Obrigatório informar o código da oportunidade.',
            },
          ]}
        >
          <Input
            onChange={() => setCodOportunidade()}
            onPressEnter={(e) => e.preventDefault()}
          />
        </Form.Item>*/}
      </Space>

      {/* <div>Atenção, esta função não consta na dotação do prefixo escolhido</div> */}
      <div className={estilos.descricaoLinhaFlex}>
        <PrefixoOrigem funcionarioEnvolvido={funcionarioEnvolvido} />
        <PrefixoDestino
          acao={constantes.solicitar}
          funcionarioEnvolvido={funcionarioEnvolvido}
        />
      </div>
    </>
  );
}
