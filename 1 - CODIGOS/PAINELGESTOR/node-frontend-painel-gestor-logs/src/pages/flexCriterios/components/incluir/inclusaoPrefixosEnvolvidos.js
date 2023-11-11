import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Space, Typography, message } from 'antd';
import {
  getFuncionarioAnalise,
  getPrefixoDestino,
} from 'pages/flexCriterios/apiCalls/flexFuncionariosPrefixosAPICall';
import { getFuncao } from 'pages/flexCriterios/apiCalls/flexTipoDadosAPICall';
import constantes from 'pages/flexCriterios/helpers/constantes';
import estilos from '../../flexCriterios.module.css';
import PrefixoOrigem from '../commons/cardPrefixoOrigem';
import PrefixoDestino from '../commons/cardPrefixoDestino';
import { ArrowRightOutlined, ForwardOutlined } from '@ant-design/icons';

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
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const buscarFuncao = (codFuncao) => {
    setLoading(true);
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
          .finally(() =>
            setTimeout(() => {
              setLoading(false);
            }, 1500),
          );
      })
      .catch((error) => {
        message.error(
          error ||
            'Função não encontrada, verifique o código e tente novamente.',
        );
      })
      .finally(() =>
        setTimeout(() => {
          setLoading(false);
        }, 1500),
      );
  };

  const setCodOportunidade = (codOportunidade) => {
    setFuncionarioEnvolvido({
      ...funcionarioEnvolvido,
      codOportunidade: true,
    });
  };

  return (
    <>
      <Space direction="vertical">
        <h3 className="ant-descriptions-title">Prefixo de Destino</h3>
        <Form.Item
          style={{ width: '230px' }}
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
              setLoading(true);
              setTimeout(() => {
                buscarPrefixo(codPrefixo);
                setLoading(false);
              }, 1500);
            }}
            onBlur={(codPrefixo) => {
              if (!funcionarioEnvolvido?.prefixoDestino?.prefixo) {
                setLoading(true);
                setTimeout(() => {
                  buscarPrefixo(codPrefixo.target.value);
                  setLoading(false);
                }, 1500);
              }
            }}
            enterButton
          />
        </Form.Item>
        {funcionarioEnvolvido?.prefixoDestino?.prefixo && (
          <>
            <h3 className="ant-descriptions-title">Código da Oportunidade</h3>
            <Form.Item
              /*       width={'230px'} */
              name="oportunidade"
              rules={[
                {
                  required: true,
                  message: 'Obrigatório informar o código da oportunidade.',
                },
                {
                  min: 8,                
                  message:
                    'Código da oportunidade deve ter no mínimo 8 caracteres entre letras e números!',
                },
              ]}
            >
              <Search
                style={{ width: '230px' }}
                placeholder="CFC000000"
                onBlur={(value) => {
                  if (funcionarioEnvolvido?.codOportunidade === true) {
                    return;
                  } else {
                    setLoading(true);
                    setTimeout(() => {
                      setCodOportunidade();
                      setLoading(false);
                      console.log('This will run after 1 second!');
                    }, 1000);
                  }
                }}
                onSearch={(value, e) => {
                  setLoading(true);
                  setTimeout(() => {
                    setCodOportunidade();
                    setLoading(false);
                    console.log('This will run after 1 second!');
                  }, 1000);

                  e.preventDefault();
                }}
                enterButton
              />
            </Form.Item>
          </>
        )}
        {funcionarioEnvolvido?.codOportunidade && (
          <>
            <h3 className="ant-descriptions-title">Função Pretendida</h3>
            <Form.Item
              /*      width={'230px'} */
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
                style={{ width: '230px' }}
                placeholder="Pesquisar por Cód. Função"
                onBlur={(codFuncao) => {
                  if (funcionarioEnvolvido.analise) {
                  } else {
                    buscarFuncao(codFuncao.target.value);
                  }
                }}
                onSearch={(codFuncao, e) => {
                  buscarFuncao(codFuncao);
                  e.preventDefault();
                }}
                enterButton
              />
            </Form.Item>
          </>
        )}
      </Space>

      {/* PREFIXO DESTINO + PREFIXO ORIGEM  */}
      <div
        style={{ alignItems: 'center' }}
        className={
          estilos.descricaoLinhaFlex
        } /* Esse estilo deixa os cards dos prefixos lado a lado */
      >
        <PrefixoOrigem funcionarioEnvolvido={funcionarioEnvolvido} />

        {funcionarioEnvolvido.prefixoDestino && (
          <ArrowRightOutlined style={{ fontSize: '400%', color: '#002D4B' }} />
        )}

        <PrefixoDestino
          acao={constantes.solicitar}
          funcionarioEnvolvido={funcionarioEnvolvido}
        />
      </div>
    </>
  );
}
