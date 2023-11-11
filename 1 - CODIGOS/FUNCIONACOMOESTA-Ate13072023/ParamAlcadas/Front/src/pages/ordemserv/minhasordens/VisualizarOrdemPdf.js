import React from "react";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import moment from "moment";
import _ from "lodash";
import ReactHtmlParser from "react-html-parser";
import { TIPOS_VINCULOS, TIPO_PARTICIPANTE, ESTADOS } from "pages/ordemserv/Types";

function VisualizarOrdemPdf(props) {

  function PDFPage(props) {
    return (
      <Page size="A4" orientation={props.orientation} style={styles.page}>
        {props.children}

        <View style={styles.footer} fixed>
          <Text style={styles.footerInfo} render={() =>
              `${props.footerInfo}`
          } fixed />

          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
          } fixed />
        </View>

        {renderWaterMark(props.watermark)}
      </Page>
    );
  }

  /**
   * Gera as marcas d'agua da assinatura e hora.
   * @param {*} mark
   */
  function renderWaterMark(mark) {
    const MAX_WIDTH = 1000;
    const MAX_HEIGHT = 1000;
    const marksList = [];
    let toggle = false;

    const horaImpressao = moment().format("DD/MM/YYYY HH:mm:ss");

    for (let i = 30; i < MAX_HEIGHT; i += 70) {
      let initial = toggle ? 35 : 0;

      for (let j = initial; j < MAX_WIDTH; j += 100) {
        marksList.push(
          <View style={{ position: "absolute", top: i, left: j }} fixed>
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
  }

  function renderRow(label, text) {
    return (
      <View style={styles.row}>
        <View style={props.isOrdemEstoque ? styles.labelEstoque : styles.label}>
          <Text>{label}</Text>
        </View>

        <View style={styles.text}>
          <Text>{text}</Text>
        </View>
      </View>
    );
  }

  function renderDadosBasicos(dadosBasicos) {
    let { numero, nomeEstado, titulo } = dadosBasicos;
    nomeEstado = nomeEstado.toUpperCase();

    let validadeOrdem =
      dadosBasicos.tipoValidade === "Determinada"
        ? dadosBasicos.dataValidade
        : dadosBasicos.tipoValidade;

    if (dadosBasicos.tipoValidade !== "Determinada") {
      validadeOrdem = validadeOrdem.toUpperCase();
    }

    let descricao = ReactHtmlParser(dadosBasicos.descricao);
    let confidencial = dadosBasicos.confidencial === 1 ? "Sim" : "Não";
    let dataRefEstado = { label: '', value: null};

    switch (dadosBasicos.estado) {
      case ESTADOS.VIGENTE: 
        dataRefEstado = { label: "Início Vigência:", value: dadosBasicos.dataVigRevog }
        break;

      case ESTADOS.REVOGADA:
        dataRefEstado = { label: "Data Revogação:", value: dadosBasicos.dataVigRevog }
        break;

      case ESTADOS.VIGENTE_PROVISORIA: 
        dataRefEstado = { label: "Dt. Lim. Vigência: ", value: dadosBasicos.dataLimVigenciaTemp }
        break;
      default:
        dataRefEstado = { label: '', value: null};
    }

    return (
      <View style={styles.section}>
        { props.isOrdemEstoque && 
          <View style={styles.row}>
            <View style={styles.labelAlertaEstoque}>
              <Text>{`ATENÇÃO: ESTA É UMA ORDEM DE SERVIÇO ESTOQUE REFERENTE A DATA DE ${props.dataHistoricoOrdem}`}</Text>
            </View>
          </View>      
        }

        {!_.isNil(numero) && renderRow("Número:", numero)}
        {renderRow("Estado Atual:", nomeEstado)}
        { !_.isNil(dataRefEstado.value) && renderRow(dataRefEstado.label, dataRefEstado.value) }
        {renderRow("Validade:", validadeOrdem)}
        {renderRow("Confidencial:", confidencial)}
        {renderRow("Título:", titulo)}

        <View style={styles.row}>
          <View style={props.isOrdemEstoque ? styles.labelEstoque : styles.label}>
            <Text>Descrição:</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ ...styles.text, flex: 1 }}>
            <Text>{descricao}</Text>
          </View>
        </View>
      </View>
    );
  }

  function renderColumnHeader(text, flexCount, extraStyle = {}) {
    return (
      <View style={{ ...styles.columnHeader, flex: flexCount, ...extraStyle }}>
        <Text>{text}</Text>
      </View>
    );
  }

  function renderColumnItem(text, itemStyle, flexCount, extraStyle = {}) {
    return (
      <View
        style={{
          ...itemStyle,
          flex: flexCount,          
          ...extraStyle,
        }}
      >
        <Text>{text}</Text>
      </View>
    );
  }

  function renderInstrucoesNormativas(instrucoesNorm) {
    let odd = false;

    return (
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={props.isOrdemEstoque ? styles.labelEstoque : styles.label}>
            <Text>Instruções Normativas</Text>
          </View>
        </View>

        <View style={{ ...styles.row, marginBottom: 0 }}>
          {renderColumnHeader("Nro.", 1, { paddingLeft: 3 })}
          {renderColumnHeader("Título", 5)}
          {renderColumnHeader("Item", 2)}
          {renderColumnHeader("Tipo", 4)}
          {renderColumnHeader("Versão", 2)}
        </View>

        {instrucoesNorm.map((elem) => {
          odd = !odd;
          let itemStyle = odd ? styles.itemOdd : styles.itemEven;
          let noBorderBottom = { borderBottom: "none" };

          return (
            <View>
              <View style={{ ...styles.row, marginBottom: 0 }}>
                {renderColumnItem(elem.nroINC, itemStyle, 1, {
                  paddingLeft: 3,
                  borderBottom: "none"
                })}
                {renderColumnItem(elem.titulo, itemStyle, 5, noBorderBottom)}
                {renderColumnItem(elem.item, itemStyle, 2, noBorderBottom)}
                {renderColumnItem(elem.tipoNormativo, itemStyle, 4, noBorderBottom)}
                {renderColumnItem(elem.versao, itemStyle, 2, noBorderBottom)}
              </View>

              <View style={{ ...styles.row, marginBottom: 0 }}>
                <View style={{ ...itemStyle, flex: 1, ...styles.itemText }}>
                  <Text>{ReactHtmlParser(elem.textoItem)}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  function renderDesignantes(participantes, modoExibicao) {
    const tipoParticipante = TIPO_PARTICIPANTE.DESIGNANTE;


    if (modoExibicao === "assinaturas") {      
      return renderAssinaturas(participantes, tipoParticipante)
    } else {
      return renderResumo(participantes, tipoParticipante);
    }
  }

  function renderDesignados(participantes, modoExibicao) {
    const tipoParticipante = TIPO_PARTICIPANTE.DESIGNADO;

    if (modoExibicao === "assinaturas") {      
      return renderAssinaturas(participantes, tipoParticipante)
    } else {
      return renderResumo(participantes, tipoParticipante);
    }
  }

  function renderAssinaturas(participantes, tipoParticipante) {
    let odd = false;

    let listaParticipantes = participantes.filter(
      (elem) => elem.tipoParticipante === tipoParticipante
    );

    //busca a lista de participantes expandidos
    let listaPartExpand = [];

    for (const part of listaParticipantes) {
      if (part.participanteExpandido) {
        for (const expand of part.participanteExpandido) {
          if (expand.naoPassivelAssinatura === false) {
            if (
              part.tipoVinculo === TIPOS_VINCULOS.COMITE &&
              part.resolvido === "Sim"
            ) {
              if (expand.assinou) {
                //se for vinculo do tipo comite e estiver resolvido, adiciona apenas os
                //participantes que ja assinaram a ordem. Evita listar participantes que nao tem
                //mais a obrigacao de assinar pelo comite.
                listaPartExpand.push({
                  ...expand,
                  nomeDependencia: part.nomeDependencia,
                });
              }
            } else {
              //adiciona apenas os funcis que sao passiveis de assinatura desta ordem.
              listaPartExpand.push({
                ...expand,
                nomeDependencia: part.nomeDependencia,
              });
            }
          }
        }
      }
    }

    let listaRegistros = [];

    if (listaPartExpand.length) {
      listaRegistros =
        listaPartExpand.map((elem) => {
          odd = !odd;
          let itemStyle = odd ? styles.itemOdd : styles.itemEven;

          return (
            <View style={{ ...styles.row, marginBottom: 0 }}>
              {renderColumnItem(elem.prefixo, itemStyle, 2, { paddingLeft: 3 })}
              {renderColumnItem(elem.nomeDependencia, itemStyle, 6)}
              {renderColumnItem(elem.matricula, itemStyle, 2)}
              {renderColumnItem(elem.nomeFunci, itemStyle, 8)}
              {renderColumnItem(elem.dataAssinatura, itemStyle, 4)}
            </View>
          );
        })
    } else {
      let notFoundText = "Nenhuma assinatura até o momento.";

      if (tipoParticipante === TIPO_PARTICIPANTE.DESIGNADO) {
        notFoundText =
          "Nenhuma assinatura até o momento. Os Designados só serão notificados para ciência após todos os Designantes assinarem e a Ordem estar Vigente.";
      }

      listaRegistros = 
        <View style={{ ...styles.row, marginBottom: 0, padding: 3 }}>
          <Text>{notFoundText}</Text>
        </View>
    }

    let labelParticipante = _.capitalize(tipoParticipante) + "s";

    return (
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={props.isOrdemEstoque ? styles.labelEstoque : styles.label}>
            <Text>{labelParticipante}</Text>
          </View>
        </View>

        <View style={{...styles.row, ...styles.headingText }}>
          <Text>Assinatura(s):</Text>
        </View>

        {listaRegistros.length > 0 && 
          <View style={{ ...styles.row, marginBottom: 0 }}>
            {renderColumnHeader("Prefixo", 2, { paddingLeft: 3 })}
            {renderColumnHeader("Dependência", 6)}
            {renderColumnHeader("Matrícula", 2)}
            {renderColumnHeader("Nome", 8)}
            {renderColumnHeader("Data Assinatura", 4)}
          </View>
        }

        {listaRegistros}      
      </View>
    )
  }

  function renderResumo(participantes, tipoParticipante) {
    let labelParticipante = _.capitalize(tipoParticipante) + "s";

    return (
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={props.isOrdemEstoque ? styles.labelEstoque : styles.label}>
            <Text>{labelParticipante}</Text>
          </View>
        </View>

        {renderVinculos(participantes, tipoParticipante)}
      </View>
    )
  }

  function renderVinculos(participantes, tipoParticipante) {
    const listaVinculos = Object.values(TIPOS_VINCULOS);
    const vinculosArray = [];

    const MATRICULA_INDIVIDUAL = TIPOS_VINCULOS.MATRICULA_INDIVIDUAL.id,
          PREFIXO = TIPOS_VINCULOS.PREFIXO.id, 
          CARGO_COMISSAO = TIPOS_VINCULOS.CARGO_COMISSAO.id, 
          COMITE = TIPOS_VINCULOS.COMITE.id;

    const fieldsConfig = {};

    fieldsConfig[MATRICULA_INDIVIDUAL] = [
      { label: "Prefixo", field: "prefixo", flex: 2},
      { label: "Dependência", field: "nomeDependencia", flex: 4},
      { label: "Matrícula", field: "matricula", flex: 2},
      { label: "Nome", field: "nomeFunci", flex: 5},
      { label: "Vínculo Resolvido", field: "resolvido", flex: 2},
    ];

    fieldsConfig[PREFIXO] = [
      { label: "Prefixo", field: "prefixo", flex: 2},
      { label: "Dependência", field: "nomeDependencia", flex: 11},
      { label: "Vínculo Resolvido", field: "resolvido", flex: 2},
    ];

    fieldsConfig[COMITE] = [
      { label: "Prefixo", field: "prefixo", flex: 2},
      { label: "Dependência", field: "nomeDependencia", flex: 6},
      { label: "Comitê", field: "nomeComite", flex: 5},
      { label: "Vínculo Resolvido", field: "resolvido", flex: 2},
    ];

    fieldsConfig[CARGO_COMISSAO] = [
      { label: "Prefixo", field: "prefixo", flex: 2},
      { label: "Dependência", field: "nomeDependencia", flex: 6},
      { label: "Cargo/Comissão", field: "cargoComissao", flex: 5},
      { label: "Vínculo Resolvido", field: "resolvido", flex: 2},
    ];

    for (let vinculo of listaVinculos) {      

      let listaParticipantes = participantes.filter(
        (elem) => elem.tipoParticipante === tipoParticipante &&
          elem.tipoVinculo === vinculo.id
      );

      if (listaParticipantes.length) {
        let listaRegistros = [];
        let odd = false;
      
        const vinculosFields = fieldsConfig[vinculo.id];

        vinculosArray.push( 
          <View style={{...styles.row, ...styles.headingText }}>
            <Text>{vinculo.titulo}:</Text>
          </View>
        );

        vinculosArray.push(
          <View style={{ ...styles.row, marginBottom: 0 }}>
            {vinculosFields.map( el => renderColumnHeader(el.label, el.flex))}
          </View>
        );

        //obtendo as linhas dos registros
        for (let participante of listaParticipantes) {
          odd = !odd;
          let itemStyle = odd ? styles.itemOdd : styles.itemEven;

          listaRegistros.push(
            <View style={{ ...styles.row, marginBottom: 0 }}>
              {vinculosFields.map( el => renderColumnItem(participante[el.field], itemStyle, el.flex))}
            </View>
          )
        }

        vinculosArray.push( listaRegistros )
        //inclui uma separacao entre um vinculo e outro
        vinculosArray.push(<View style={{ ...styles.row, marginBottom: 5 }}></View>)
      }

    }

    return vinculosArray;
  }

  let { numero, titulo } = props.dadosOrdem.dadosBasicos;
  const footerEstoque = props.isOrdemEstoque ? `- ESTA É UMA ORDEM DE SERVIÇO ESTOQUE REFERENTE A DATA DE ${props.dataHistoricoOrdem}` : '';

  if (_.isNil(numero)) {
    numero = "RASCUNHO"
  }

  return (
    <Document>
      <PDFPage 
        orientation={props.orientation || "portrait"} 
        watermark={props.matricula}
        footerInfo={`OS: ${numero} - ${titulo}` + footerEstoque}
      >
        {renderDadosBasicos(props.dadosOrdem.dadosBasicos)}
        {renderInstrucoesNormativas(props.dadosOrdem.instrucoesNorm)}
        {renderDesignantes(props.dadosOrdem.participantes, props.modoExibicao)}
        {renderDesignados(props.dadosOrdem.participantes, props.modoExibicao)}
      </PDFPage>
    </Document>
  );
}

const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "column",
    padding: 15,
    paddingBottom: 23
  },

  section: {
    padding: 4,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#bbb",
    fontSize: 7,
  },

  row: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 2,
  },

  label: {
    color: "#fff",
    backgroundColor: "#96b2c8",
    flex: 1,
    padding: 1,
    paddingLeft: 4,
  },

  labelEstoque: {
    color: "#5b5151",
    backgroundColor: "#ddd",
    flex: 1,
    padding: 1,
    paddingLeft: 4,
  },

  labelAlertaEstoque: {
    color: "#fff",
    backgroundColor: '#f2261c',
    flex: 1,
    padding: 1,
    paddingLeft: 4,
    textAlign: "center"
  },

  text: {
    flex: 5,
    paddingLeft: 7,
    paddingRight: 7,
    alignSelf: "center",
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
    paddingLeft: 3
  },

  footer: {
    position: 'absolute',
    bottom: 6,
    left: 20,
    right: 5,
    display: 'flex',
    flexDirection: "row"
  },

  pageNumber: {
    width: 30,
    fontSize: 6,
    color: '#666'
  },

  footerInfo: {
    flex: 1,
    fontSize: 6,
    color: '#666'
  },

});

export default VisualizarOrdemPdf;
