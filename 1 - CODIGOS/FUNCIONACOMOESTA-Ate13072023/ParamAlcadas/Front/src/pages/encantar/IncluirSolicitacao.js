import React, { useState, useEffect } from "react";
import { Steps, Button, message, Result } from "antd";

import { connect } from "react-redux";

import IncluirMCI from "pages/encantar/solicitacoes/mci";
import Capacitacao from "pages/encantar/solicitacoes/Capacitacao";
import DescricaoCaso from "pages/encantar/solicitacoes/DescricaoCaso";
import RedeSocial from "pages/encantar/solicitacoes/RedeSocial";
import SelecionarBrindes from "pages/encantar/solicitacoes/SelecionarBrindes";
import Carta from "pages/encantar/solicitacoes/Carta";
import FinalizarSolicitacao from "pages/encantar/solicitacoes/FinalizarSolicitacao";
import Entrega from "pages/encantar/solicitacoes/Entrega";
import history from "../../history";

import BBSpinning from "components/BBSpinning/BBSpinning";
import { toggleSideBar } from "services/actions/commons";

import {
  salvarSolicitacao,
  podeIncluirSolicitacao,
} from "services/ducks/Encantar.ducks";
import { fetchDependencia } from "services/ducks/Arh.ducks";
import { fetchDadosCliente } from "services/apis/ApiClientes";
import isEnderecoClienteValido from "utils/Encantar/isEnderecoClienteValido";
import styles from "./incluirSolicitacao.module.scss";

const { Step } = Steps;

const IncluirSolicitacao = (props) => {
  //Hooks de state

  const [current, setCurrent] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [capacitacao, setCapacitacao] = useState(null);
  const [permIncluirSolicitacao, setPermIncluirSolicitacao] = useState(null);
  const [msgNenhumBrindeLida, setMsgNenhumBrindeLida] = useState(null);
  const [
    msgClienteJaRecebeuSolicitacaoLida,
    setMsgClienteJaRecebeuSolicitacaoLida,
  ] = useState(null);

  const [dadosForm, setDadosForm] = useState({
    mci: "",
    dadosCliente: {},
    enderecoCliente: {
      cep: "",
      endereco: "",
      complemento: "",
      numero: "",
      bairro: "",
      cidade: "",
    },
    descricaoCaso: "",
    prefixoFato: null,
    produtoBB: null,
    dadosEntrega: {},
    anexos: [],
    redesSociais: [],
    brindesSelecionados: [],
    txtCarta: "",
  });

  const { toggleSideBar } = props;
  //UseEffect
  useEffect(() => {
    toggleSideBar(false);
  }, [toggleSideBar]);

  useEffect(() => {
    if (permIncluirSolicitacao === null) {
      podeIncluirSolicitacao().then((permissao) => {
        setPermIncluirSolicitacao(permissao.podeIncluirSolicitacao);
      });
    }
  }, [permIncluirSolicitacao]);

  //Dados Diversos
  const steps = [
    //Capacitação
    {
      title: "Capacitação",
      content: (
        <Capacitacao
          capacitacao={capacitacao}
          setCapacitacao={setCapacitacao}
          setCarregando={setCarregando}
        />
      ),
      next: async () => {
        return new Promise((resolve, reject) => {
          if (capacitacao.isento) {
            resolve();
            return;
          }

          const tiposCapacitacao = ["videos", "cursos"];
          for (let tipoCapacitacao of tiposCapacitacao) {
            const { length } = capacitacao[tipoCapacitacao].filter(
              (elem) => elem.finalizado === false
            );
            if (length > 0) {
              reject("Assista todos os vídeos e finalize todos os cursos!");
            }
          }
          resolve("Finalizou");
          return;
        });
      },
    },

    //MCI
    {
      title: "MCI",
      content: (
        <IncluirMCI
          msgClienteJaRecebeuSolicitacaoLida={
            msgClienteJaRecebeuSolicitacaoLida
          }
          setMsgClienteJaRecebeuSolicitacaoLida={() =>
            setMsgClienteJaRecebeuSolicitacaoLida(true)
          }
          value={dadosForm.mci}
          updateFunc={(value) => setDadosForm({ ...dadosForm, mci: value })}
        />
      ),
      next: async () => {
        if (
          dadosForm.mci === "" ||
          dadosForm.dadosCliente.MCI !== dadosForm.mci
        ) {
          const dadosCliente = await fetchDadosCliente(dadosForm.mci, true);

          return new Promise((resolve, reject) => {
            if (
              dadosCliente.solicitacoesAnteriores.length > 0 &&
              msgClienteJaRecebeuSolicitacaoLida === null
            ) {
              setMsgClienteJaRecebeuSolicitacaoLida(false);
              reject(null);
            }
            setDadosForm({ ...dadosForm, dadosCliente });
            resolve();
          });
        }
      },
    },

    //Rede Social
    {
      title: "Rede Social",
      content: (
        <RedeSocial
          dadosCliente={dadosForm.dadosCliente}
          redesSociais={dadosForm.redesSociais}
          updateRedesSociais={(redesSociais) => {
            setDadosForm({ ...dadosForm, redesSociais });
          }}
        />
      ),
      next: async () => {},
    },

    //Descrição do Caso
    {
      title: "Caso",
      content: (
        <DescricaoCaso
          loading={carregando}
          anexos={dadosForm.anexos}
          updateProdutoBB={(produtoBB) => {
            setDadosForm({ ...dadosForm, produtoBB });
          }}
          updatePrefixoFato={(prefixo) => {
            setDadosForm({ ...dadosForm, prefixoFato: prefixo });
          }}
          updateDescricao={(descricao) => {
            setDadosForm({ ...dadosForm, descricaoCaso: descricao });
          }}
          updateFiles={(anexos) => {
            setDadosForm({ ...dadosForm, anexos: anexos });
          }}
          produtoBB={dadosForm.produtoBB}
          prefixoFato={dadosForm.prefixoFato}
          descricao={dadosForm.descricaoCaso}
          dadosCliente={dadosForm.dadosCliente}
        />
      ),
      next: async () => {
        const promise = new Promise((resolve, reject) => {
          if (dadosForm.descricaoCaso === "") {
            reject("A descrição do caso é obrigatória!");
          }

          if (dadosForm.prefixoFato === null) {
            setDadosForm({
              ...dadosForm,
              prefixoFato: dadosForm.dadosCliente.prefixoEncarteirado,
            });
          }

          if (!dadosForm.produtoBB) {
            reject("Selecione o produto BB vinculado ao fato!");
          }
          resolve();
        });

        return promise;
      },
    },

    //Selecionar Brindes
    {
      title: "Brindes",
      content: (
        <SelecionarBrindes
          msgNenhumBrindeLida={msgNenhumBrindeLida}
          setMsgNenhumBrindeLida={() => setMsgNenhumBrindeLida(false)}
          prefixoFato={dadosForm.prefixoFato}
          classificacaoCliente={dadosForm.dadosCliente.classificacao}
          value={dadosForm.brindeSelecionado}
          brindesSelecionados={dadosForm.brindesSelecionados}
          updateFunc={(newBrindesSelecionados) =>
            setDadosForm({
              ...dadosForm,
              brindesSelecionados: newBrindesSelecionados,
            })
          }
        />
      ),
      next: async () => {
        return new Promise((resolve, reject) => {
          if (
            dadosForm.brindesSelecionados.length === 0 &&
            msgNenhumBrindeLida === null
          ) {
            setMsgNenhumBrindeLida(true);
            reject(null);
          }
          resolve();
        });
      },
    },

    //Entrega
    {
      title: "Entrega",
      content: (
        <Entrega
          dadosEntrega={dadosForm.dadosEntrega}
          setDadosEntrega={(newDadosEntrega) => {
            setDadosForm({
              ...dadosForm,
              dadosEntrega: { ...newDadosEntrega },
            });
          }}
          enderecoCliente={dadosForm.enderecoCliente}
          setEnderecoCliente={(newEnderecoCliente) => {
            setDadosForm({
              ...dadosForm,
              enderecoCliente: newEnderecoCliente,
            });
          }}
        />
      ),
      next: async () => {
        return new Promise((resolve, reject) => {
          console.log(dadosForm);
          if (
            !dadosForm.dadosEntrega.localEntrega ||
            dadosForm.dadosEntrega.localEntrega === ""
          ) {
            message.error("Local da entrega é obrigatório.");
            return reject();
          }

          if (
            dadosForm.dadosEntrega.localEntrega === "Agência" &&
            !dadosForm.dadosEntrega.prefixoEntrega
          ) {
            message.error(
              "Caso o local de entrega seja Agência, informa a agência da entrega."
            );
            return reject();
          }

          if (!isEnderecoClienteValido(dadosForm.enderecoCliente)) {
            message.error("Endereço do cliente inválido.");
            return reject();
          }

          return resolve();
        });
      },
    },

    //Carta
    {
      title: "Carta",
      content: (
        <Carta
          txtCarta={dadosForm.txtCarta}
          updateFunc={(txtCarta) => setDadosForm({ ...dadosForm, txtCarta })}
        />
      ),
      next: async () => {
        return new Promise((resolve, reject) => {
          if (dadosForm.brindeSelecionado === null && !dadosForm.txtCarta) {
            reject(
              "É obrigatório, pelo menos, escolher um brinde ou escrever uma carta."
            );
          }
          resolve();
        });
      },
    },

    //Finalizar
    {
      title: "Finalizar",
      content: <FinalizarSolicitacao dadosForm={dadosForm} />,
      next: async () => {
        return new Promise((reject, resolve) => resolve());
      },
    },
  ];

  //Funções

  /**
   *
   *  Função para navegar pelo formulário
   *
   * @param {*} tipo Tipo de navegação. Pode ser "next" ou "prev"
   */
  const navForm = async (tipo) => {
    switch (tipo) {
      case "next":
        setCarregando(true);
        await steps[current]
          .next()
          .then(() => {
            setCurrent(current + 1);
          })
          .catch((msg) => {
            if (msg) {
              message.error(msg);
            }
          })
          .then(() => {
            setCarregando(false);
          });
        break;
      case "prev":
        setCurrent(current - 1);
        break;
      default:
        break;
    }
  };

  if (!podeIncluirSolicitacao) {
    return <p>Sem acesso</p>;
  }

  if (permIncluirSolicitacao === false) {
    return (
      <Result
        status="403"
        title="Prefixo Sem acesso"
        subTitle="Seu prefixo não tem acesso para acessar essa ferramenta."
      />
    );
  }
  //Render
  return (
    <BBSpinning spinning={carregando}>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <div className={styles.stepContent}>{steps[current].content}</div>
      <div className={styles.stepAction}>
        {current > 0 && (
          <Button
            style={{ margin: "10px 8px" }}
            onClick={() => navForm("prev")}
          >
            Anterior
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => navForm("next")}>
            Próximo
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={async () => {
              setCarregando(true);
              await salvarSolicitacao(dadosForm)
                .then(() => {
                  history.push("/encantar/solicitacoes/aprovacoes");
                  return new Promise((resolve, reject) => resolve());
                })
                .catch(() => {
                  message.error(
                    "Erro ao salvar solicitação. Favor tentar novamente."
                  );
                  setCarregando(false);
                });
            }}
          >
            Finalizar
          </Button>
        )}
      </div>
    </BBSpinning>
  );
};

export default connect(null, {
  toggleSideBar,
  fetchDependencia,
})(IncluirSolicitacao);
