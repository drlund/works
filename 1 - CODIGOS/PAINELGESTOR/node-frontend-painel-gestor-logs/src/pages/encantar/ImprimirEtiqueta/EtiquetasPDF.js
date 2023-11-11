import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import imgCorreios from "./logoCorreiosEtiqueta.png";
import moment from "moment";
const REMETENTE = "Remetente";
const DESTINATARIO = "Destinatário";

moment.locale('pt', {
  months : ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
}); 

function renderFullRow(label, text) {
  return (
    <View style={styles.fullRow}>
      <View style={styles.label}>
        <Text>{label}</Text>
      </View>
      <View style={styles.text}>
        <Text>{text}</Text>
      </View>
    </View>
  );
}

function renderDadosEnvio(dadosRecebido, tipo) {
  return (
    <>
      <View style={styles.fullRow}>
        <View style={{ ...styles.label, minHeight: 20 }}>
          <Text>{tipo}</Text>
        </View>
        <View style={{ ...styles.text, minHeight: 20 }}>
          <Text>{dadosRecebido.nome}</Text>
        </View>
      </View>
      {renderFullRow("CPF/CNPJ:", tipo === REMETENTE ? "000.000.000/5432-17" : dadosRecebido.cpf )}
      <View style={styles.fullRow}>
        <View style={{ ...styles.label }}>
          <Text>Endereço: </Text>
        </View>
        <View style={{ ...styles.text, width: "50%" }}>
          <Text>{dadosRecebido.endereco}</Text>
        </View>
        <View style={{ ...styles.text, width: "35%" }}>
          <Text>{dadosRecebido.bairro}</Text>
        </View>
      </View>
      <View style={styles.fullRow}>
        <View style={{ ...styles.label, width: "15%" }}>
          <Text>Cidade/UF: </Text>
        </View>
        <View style={{ ...styles.text, width: "35%" }}>
          <Text>{dadosRecebido.cidade}</Text>
        </View>
        <View style={{ ...styles.text, width: "15%" }}>
          <Text>CEP</Text>
        </View>
        <View style={{ ...styles.text, width: "35%" }}>
          <Text>{dadosRecebido.cep}</Text>
        </View>
      </View>
    </>
  );
}

function renderBrindes(brindes) {
  return (
    <>
      <View
        style={{
          ...styles.fullRow,
          borderWidth: 0.5,
          borderColor: "#000",
          paddingBottom: 5,
          paddingTop: 5,
          backgroundColor: "#d9d9d9",
          width: "100%",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        <Text>IDENTIFICAÇÕES DOS BENS</Text>
      </View>
      <View style={styles.fullRow}>
        <View style={{ ...styles.text, width: "70%" }}>
          <Text>Discriminação do Conteúdo</Text>
        </View>
        <View style={{ ...styles.text, width: "15%" }}>
          <Text>Quantidade</Text>
        </View>
        <View style={{ ...styles.text, width: "15%" }}>
          <Text>Peso</Text>
        </View>
      </View>
      {brindes.map((brinde) => {
        return (
          <View style={styles.fullRow}>
            <View style={{ ...styles.text, width: "70%" }}>
              <Text>{brinde.nome}</Text>
            </View>
            <View style={{ ...styles.text, width: "15%" }}>
              <Text>{brinde.quantidadeSelecionada}</Text>
            </View>
            <View style={{ ...styles.text, width: "15%" }}>
              <Text>400G</Text>
            </View>
          </View>
        );
      })}
      <View style={styles.fullRow}>
        <View style={{ ...styles.text, width: "85%" }}>
          <Text>Valor total</Text>
        </View>
        <View style={{ ...styles.text, width: "15%" }}>
          <Text>R$ 0.00</Text>
        </View>
      </View>
    </>
  );
}

function renderDeclaracao() {
  return (
    <>
      <View
        style={{
          ...styles.fullRow,
          borderWidth: 0.5,
          borderColor: "#000",
          paddingBottom: 5,
          backgroundColor: "#d9d9d9",
          width: "100%",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        <Text>Declaração</Text>
      </View>
      <View style={styles.fullRow}>
        <Text
          style={{
            ...styles.text,
            width: "100%",
            textAlign: "justify",
            borderBottom: 0,
            padding: 10,
          }}
        >
          Declaro, não ser pessoa física ou jurídica, que realize, com
          habitualidade ou em volume que caracterize intuito comercial,
          operações de circulação de mercadoria, ainda que estas se iniciem no
          exterior, que o conteúdo declarado não está sujeito à tributação, e
          que sou o único responsável por eventuais penalidades ou danos
          decorrentes de informações inverídicas.
        </Text>
      </View>
      <View
        style={{
          paddingTop: 100,
          borderWidth: 0.5,
          borderTop: 0,
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            padding: 10,
            borderBottom: 0,
            borderTop: 0,
            width: "50%",
            textAlign: "justify",
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Brasília</Text>, {
          moment().format('DD [de] MMMM [de] YYYY')
          }
        </Text>
        <Text
          style={{
            width: "5%",
          }}
        ></Text>
        <Text
          style={{
            borderWidth: 0.5,
            padding: 10,
            borderBottom: 0,
            borderLeft: 0,
            borderTop: 1,
            borderRight: 0,
            width: "40%",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          Assinatura do Remetente
        </Text>
        <Text
          style={{
            width: "5%",
          }}
        ></Text>
      </View>
    </>
  );
}

function renderLocalEtiqueta() {
  return (
    <View
      style={{
        height: 300,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexFlow: "row",
      }}
    >
      <Text>USO EXCLUSIVO DOS CORREIOS</Text>
      <Text>Cole aqui a etiqueta com o código identificador da encomenda.</Text>
    </View>
  );
}

const EtiquetasPDF = (props) => {
  const { dadosDestinatario, dadosRemetente, brindes } = props;

  return (
    <Document>
      <Page size="A4" orientation={"portrait"} wrap={false} style={styles.page}>
        <View
          style={{
            display: "flex",
            flexFlow: "column",
            justifyContent: "space-between",
          }}
        >
          <Text>
            <Image style={{ width: 100, height: 50 }} src={imgCorreios} />
          </Text>
          <Text style={{ marginLeft: 200 }}>Declaração de Conteúdo</Text>
        </View>

        <View style={styles.section}>
          {renderDadosEnvio(dadosRemetente, REMETENTE)}
          {renderDadosEnvio(dadosDestinatario, DESTINATARIO)}
          {renderBrindes(brindes)}
          {renderDeclaracao()}
        </View>
        <View style={{ ...styles.section, paddingLeft: 10, paddingRight: 10 }}>
          <Text>
            Atenção: O declarante/remetente é responsável exclusivamente pelas
            informações declaradas.
          </Text>
        </View>
        <View style={{ ...styles.section, paddingLeft: 10, paddingRight: 10, fontSize: 9 }}>
          <Text style={{ fontWeight: "bold" }}>Observação:</Text>
          <Text style={{ marginTop: 10 }}>
            I - É Contribuinte de ICMS qualquer pessoa física ou jurídica, que
            realize, com habitualidade ou em volume que caracterize intuito
            comercial, operações de circulação de mercadoria ou prestações de
            serviços de transportes interestadual e intermunicipal e de
            comunicação, ainda que as operações e prestações se iniciem no
            exterior (Lei Complementar nº 87/96 Art. 4º).
          </Text>
          <Text style={{ marginTop: 10 }}>
            II - Constitui crime contra a ordem tributária suprimir ou reduzir
            tributo, ou contribuição social e qualquer acessório: quando negar
            ou deixar de fornecer, quando obrigatório, nota fiscal ou documento
            equivalente, relativa a venda de mercadoria ou prestação de serviço,
            efetivamente realizada, ou fornecê-la em desacordo com a legislação.
            Sob pena de reclusão de 2 (dois) a 5 (anos), e multa (Lei 8.137/90
            Art. 1º, V).
          </Text>
        </View>
      </Page>
      <Page size="A4" orientation={"portrait"} wrap={false} style={styles.page}>      
        <View style={{ ...styles.section, width: "100%" }}>
          <View
            style={{
              ...styles.fullRow,
              borderWidth: 0.5,
              borderColor: "#000",
              paddingBottom: 5,              fontSize: 15,
              paddingTop: 5,
              backgroundColor: "#000000",
              color: "#FFFFFF",
              width: "100%",
              fontSize: 15,
              fontWeight: "bold",

            }}
          >
            <Text>Destinatário</Text>
          </View>
          <View
            style={{
              ...styles.fullRow,
              borderWidth: 0.5,
              borderColor: "#000",
              paddingBottom: 5,
              paddingTop: 5,
              color: "#000000",
              width: "100%",
              fontWeight: "bold",
            }}
          >
            <Text>{dadosDestinatario.nome}</Text>
          </View>
          <View
            style={{
              ...styles.fullRow,
              borderWidth: 0.5,
              marginTop: 0,
              borderColor: "#000",
              paddingBottom: 5,
              paddingTop: 5,
              color: "#000000",
              width: "100%",
              fontWeight: "bold",
            }}
          >
            <Text>{dadosDestinatario.endereco}</Text>
          </View>
          <View
            style={{
              ...styles.fullRow,
              borderWidth: 0.5,
              marginTop: 0,
              borderColor: "#000",
              paddingBottom: 5,
              paddingTop: 5,
              color: "#000000",
              width: "100%",
              fontWeight: "bold",
            }}
          >
            <Text>{dadosDestinatario.bairro}</Text>
          </View>
          <View
            style={{
              ...styles.fullRow,
              borderWidth: 0.5,
              marginTop: 0,
              borderColor: "#000",
              paddingBottom: 5,
              paddingTop: 5,
              color: "#000000",
              width: "100%",
              fontWeight: "bold",
            }}
          >
            <Text>
              {dadosDestinatario.cep} - {dadosDestinatario.cidade}
            </Text>
          </View>
          <View
            style={{
              ...styles.fullRow,
              borderWidth: 0.5,
              borderColor: "#000",
              paddingBottom: 5,
              paddingTop: 5,
              backgroundColor: "#000000",
              color: "#FFFFFF",
              width: "100%",
              fontSize: 15,
              fontWeight: "bold",
            }}
          >
            <Text>Remetente</Text>
          </View>
          <View
            style={{
              ...styles.fullRow,
              borderWidth: 0.5,
              marginTop: 0,
              borderColor: "#000",
              paddingBottom: 5,
              paddingTop: 5,
              color: "#000000",
              width: "100%",
              fontWeight: "bold",
            }}
          >
            <Text>9009 - SUPER ADM - DF</Text>
          </View>
          <View
            style={{
              ...styles.fullRow,
              borderWidth: 0.5,
              marginTop: 0,
              borderColor: "#000",
              paddingBottom: 5,
              paddingTop: 5,
              color: "#000000",
              width: "100%",
              fontWeight: "bold",
            }}
          >
            <Text>SAUN QUADRA 5 - LOTE B - S/N - 70040912</Text>
          </View>
          <View
            style={{
              ...styles.fullRow,
              borderWidth: 0.5,
              marginTop: 0,
              borderColor: "#000",
              paddingBottom: 5,
              paddingTop: 5,
              color: "#000000",
              width: "100%",
              fontWeight: "bold",
            }}
          >
            <Text>Asa Norte</Text>
          </View>
          <View
            style={{
              ...styles.fullRow,
              borderWidth: 0.5,
              marginTop: 0,
              borderColor: "#000",
              paddingBottom: 5,
              paddingTop: 5,
              color: "#000000",
              width: "100%",
              fontWeight: "bold",
            }}
          >
            <Text>9009 - SUPER ADM - DF</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src:
        "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
    },
    {
      src:
        "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
      fontWeight: 600,
    },
  ],
});

const styles = StyleSheet.create({
  remetenteLabel: {
    borderWidth: 0.5,
    borderColor: "#000",
    borderRight: 0,
    paddingBottom: 2,
    paddingTop: 2,
    minHeight: 30,

    width: "15%",
    justifyContent: "center",
    alignItems: "center",
  },

  remetenteText: {
    borderWidth: 0.5,
    borderColor: "#000",
    paddingBottom: 10,
    paddingTop: 10,

    width: "85%",
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
  },

  page: {
    display: "flex",
    flexDirection: "column",
    padding: 15,
    paddingBottom: 23,
    fontFamily: "Open Sans",
  },
  section: {
    padding: 4,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#bbb",
    fontSize: 10,
  },

  fullRow: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },

  label: {
    borderWidth: 0.5,
    borderColor: "#000",
    borderRight: 0,
    paddingBottom: 5,
    paddingTop: 5,
    minHeight: 15,

    width: "15%",
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    borderWidth: 0.5,
    borderColor: "#000",
    paddingBottom: 5,
    paddingTop: 5,

    width: "85%",
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
  },

  signature: {
    transform: "rotate(-45deg)",
    color: "#666",
    fontSize: 6,
    fontWeight: "bold",
    opacity: 0.2,
  },

  columnHeader: {
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#919191",
    backgroundColor: "#c6c6c6",
    fontSize: 6,
    padding: 1,
  },

  itemEven: {
    backgroundColor: "#f0f0f0",
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#c8c8c8",
    fontSize: 6,
    padding: 1,
  },

  itemOdd: {
    backgroundColor: "#e3eef7",
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#b2c2ce",
    fontSize: 6,
    padding: 1,
  },

  itemText: {
    backgroundColor: "#fff",
    padding: 3,
  },

  headingText: {
    fontWeight: "bold",
    fontSize: 7,
    paddingLeft: 3,
  },

  footer: {
    position: "absolute",
    bottom: 6,
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
});

export default EtiquetasPDF;
