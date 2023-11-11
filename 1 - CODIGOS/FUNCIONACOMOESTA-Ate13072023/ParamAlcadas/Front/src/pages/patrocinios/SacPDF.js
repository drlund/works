import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import moment from "moment";

const styles = StyleSheet.create({
  page: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#AAA",
  },
  header: {
    borderWidth: 1,
    borderRadius: 3,
    borderColor: "#4169E1",
    backgroundColor: "#4169E1",
    color: "#F5F5F5",
    padding: 3,
    textAlign: "center",
  },
  title: {
    fontSize: 10,
  },
  section: {
    marginVertical: 5,
  },
  titleSectionContainer: {
    borderWidth: 0.5,
    borderColor: "#DDD",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    backgroundColor: "#FFD700",
    padding: 3,
  },
  titleSection: {
    fontSize: 8,
    color: "#00008B",
  },
  sectionBody: {
    borderWidth: 0.5,
    borderColor: "#CCC",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingTop: 5,
    paddingHorizontal: 8,
  },
  fieldContainer: {
    marginBottom: 8,
  },
  pergunta: {
    fontSize: 8,
    color: "#00008B",
    opacity: 0.85,
    marginBottom: 2,
  },
  resposta: {
    fontSize: 8,
    opacity: 0.85,
    minHeight: 15,
    paddingTop: 4,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: "#BBB",
    backgroundColor: "#FAFAFA",
  },
  votoContainer: {
    flexDirection: "row",
  },
  voto: {
    fontSize: 8,
    opacity: 0.85,
    marginBottom: 5,
  },
  footer: {
    position: "absolute",
    bottom: 3,
    left: 20,
    right: 5,
    display: "flex",
    flexDirection: "row",
  },
  pageNumber: {
    width: 30,
    fontSize: 6,
    color: "#666",
  },
  footerInfo: {
    flex: 1,
    fontSize: 6,
    color: "#666",
  },
  signature: {
    transform: "rotate(-45deg)",
    color: "#666",
    fontSize: 6,
    fontWeight: "bold",
    opacity: 0.2,
  },
});

const PDFPage = (props) => {
  return (
    <Page size="A4" orientation="portrait" style={styles.page}>
      {props.children}

      <View style={styles.footer} fixed>
        <Text
          style={styles.footerInfo}
          render={() => `${props.footerInfo}`}
          fixed
        />

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </View>

      <RenderWaterMark mark={props.watermark} />
    </Page>
  );
};

/**
 * Gera as marcas d'agua da assinatura e hora.
 * @param {*} mark
 */
const RenderWaterMark = ({ mark }) => {
  const MAX_WIDTH = 1000;
  const MAX_HEIGHT = 1000;
  const marksList = [];
  let toggle = false;

  const horaImpressao = moment().format("DD/MM/YYYY HH:mm:ss");

  for (let i = 30; i < MAX_HEIGHT; i += 70) {
    let initial = toggle ? 35 : 0;

    for (let j = initial; j < MAX_WIDTH; j += 100) {
      marksList.push(
        <View
          key={moment().toString() + Math.random()}
          style={{ position: "absolute", top: i, left: j }}
          fixed
        >
          <Text
            style={{
              ...styles.signature,
              fontSize: 12,
              marginBottom: 3,
            }}
          >
            {mark}
          </Text>
          <Text
            style={{
              ...styles.signature,
              paddingLeft: 8,
            }}
          >
            {horaImpressao}
          </Text>
        </View>
      );
    }

    toggle = !toggle;
  }

  return marksList;
};

const RenderSection = ({ title, children }) => (
  <View style={styles.section}>
    <View style={styles.titleSectionContainer}>
      <Text style={styles.titleSection}>{title}</Text>
    </View>
    <View style={styles.sectionBody}>{children}</View>
  </View>
);

const RenderCampos = ({ campos }) => {
  const resposta = (campo) => {
    const descricaoResposta = campo.resposta
      ? campo.resposta.descricaoResposta
      : "";

    if (
      campo.tipo &&
      campo.tipo.cdTipoPergunta === "radio" &&
      descricaoResposta
    ) {
      const respostaRadio = campo.opcoes.find(
        (opcao) => opcao.id === Number(descricaoResposta)
      );

      if (respostaRadio) {
        return respostaRadio.descricao;
      }
    }

    return descricaoResposta;
  };

  return campos.map((item) => (
    <View key={item.id} style={styles.fieldContainer}>
      <Text style={styles.pergunta}>{item.descricaoPergunta}</Text>
      <Text style={styles.resposta}>{resposta(item)}</Text>
    </View>
  ));
};

const RenderCamposSolicitacao = ({ solicitacao, tiposSolicitacao }) => {
  const tpSolicitacao = tiposSolicitacao.find(
    (tpSolic) => tpSolic.id === solicitacao.idTipoSolicitacao
  );
  const descricaoTpSolicitacao = tpSolicitacao ? tpSolicitacao.descricao : "";

  const perguntasSolicitacao = [
    {
      id: "idTipoSolicitacao",
      descricaoPergunta: "Tipo de Solicitação",
      resposta: { descricaoResposta: descricaoTpSolicitacao },
    },
    {
      id: "prefixoSolicitante",
      descricaoPergunta: "Super Solicitante",
      resposta: {
        descricaoResposta: `${solicitacao.prefixoSolicitante} - ${solicitacao.nomeSolicitante}`,
      },
    },
    {
      id: "nomeEvento",
      descricaoPergunta: "Nome do Evento",
      resposta: { descricaoResposta: solicitacao.nomeEvento },
    },
    {
      id: "dataInicioEvento",
      descricaoPergunta: "Data Início do Evento",
      resposta: { descricaoResposta: solicitacao.dataInicioEvento },
    },
    {
      id: "dataFimEvento",
      descricaoPergunta: "Data Fim do Evento",
      resposta: { descricaoResposta: solicitacao.dataFimEvento },
    },
  ];

  return <RenderCampos campos={perguntasSolicitacao} />;
};

const RenderRespostaRecorrencia = ({ campoRecorrencia }) => {
  const { resposta, opcoes } = campoRecorrencia;
  const campos = [];

  if (resposta) {
    const respostaRecorrencia = opcoes.find(
      (opc) => opc.id === parseInt(resposta.descricaoResposta)
    );

    if (respostaRecorrencia) {
      resposta.descricaoResposta = respostaRecorrencia.descricao;
      campos.push(campoRecorrencia);
    }
  }

  return <RenderCampos campos={campos} />;
};

const RenderCamposRecorrencia = ({ solicitacao }) => {
  const { recorrencia } = solicitacao;
  let campos = [];

  if (recorrencia) {
    campos = [
      {
        id: "nmEventoRecorrencia",
        descricaoPergunta: "Evento",
        resposta: { descricaoResposta: recorrencia.nomeEvento },
      },
      {
        id: "dtEventoRecorrencia",
        descricaoPergunta: "Data",
        resposta: { descricaoResposta: recorrencia.dtEvento },
      },
      {
        id: "vlEventoRecorrencia",
        descricaoPergunta: "Valor",
        resposta: { descricaoResposta: recorrencia.valorEvento },
      },
      {
        id: "avaliacaoEventoRecorrencia",
        descricaoPergunta: "Avaliação do Resultado",
        resposta: {
          descricaoResposta: recorrencia.avaliacaoResultado
            ? recorrencia.avaliacaoResultado
            : "",
        },
      },
    ];
  }

  return (
    <>
      {recorrencia && (
        <RenderSection title="Dados da Recorrência">
          <RenderCampos campos={campos} />
        </RenderSection>
      )}
    </>
  );
};

const RenderVotosComite = ({ solicitacao }) => {
  const { voto } = solicitacao;

  return voto ? (
    <RenderSection title="Votos do Comitê">
      {voto.map((item) => (
        <View key={item.matriculaVotante} style={styles.votoContainer}>
          <Text style={styles.voto}>
            {`${item.matriculaVotante} ${item.nomeVotante} (${item.nomeFuncaoVotante}) - ${item.dtVoto} - `}
          </Text>
          <Text
            style={{ ...styles.voto, color: item.deferido ? "green" : "red" }}
          >
            {item.deferido ? "DEFERIDO" : "INDEFERIDO"}
          </Text>
        </View>
      ))}
    </RenderSection>
  ) : null;
};

const SacPDF = (props) => {
  const { solicitacao, tiposSolicitacao, perguntas, campoRecorrencia } = props;

  return (
    tiposSolicitacao &&
    solicitacao &&
    perguntas &&
    campoRecorrencia && (
      <Document>
        <PDFPage
          watermark={props.matricula}
          footerInfo={`Solicitante: ${solicitacao.prefixoSolicitante} - ${solicitacao.nomeSolicitante}     Evento: ${solicitacao.nomeEvento}`}
        >
          <View style={styles.header}>
            <Text style={styles.title}>
              Solicitação de Ações de Comunicação (SAC)
            </Text>
          </View>

          <RenderSection title="Dados da Solicitação">
            <RenderCamposSolicitacao
              solicitacao={solicitacao}
              tiposSolicitacao={tiposSolicitacao}
            />
            <RenderCampos campos={perguntas} />
            <RenderRespostaRecorrencia campoRecorrencia={campoRecorrencia} />
          </RenderSection>

          <RenderCamposRecorrencia solicitacao={solicitacao} />
          <RenderVotosComite solicitacao={solicitacao} />
        </PDFPage>
      </Document>
    )
  );
};

export default SacPDF;
