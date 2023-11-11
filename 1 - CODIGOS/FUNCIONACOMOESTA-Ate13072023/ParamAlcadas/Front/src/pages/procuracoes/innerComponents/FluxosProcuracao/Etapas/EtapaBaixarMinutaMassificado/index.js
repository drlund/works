import { DownloadOutlined } from '@ant-design/icons';
import {
  Document,
  Page,
  PDFDownloadLink,
  PDFViewer,
  View
} from '@react-pdf/renderer';
import { Button } from 'antd';
import { useEffect } from 'react';
import Html from 'react-pdf-html';
import { useParams } from 'react-router-dom';

/**
 * @param {Procuracoes.CurrentStepParameters<Procuracoes.DadosProcuracao>} props
 */
export function EtapaBaixarMinutaMassificado({ dadosEtapa }) {
  /** @type {{idMassificado: string}} */
  const { idMassificado } = useParams();
  const listaMinutas = JSON.parse(window.sessionStorage.getItem(`listaMinutas-${idMassificado}`));
  useEffect(() => () => window.sessionStorage.removeItem(`listaMinutas-${idMassificado}`), []);

  const dataYYYYMMDD = new Date().toISOString().slice(0, 10);
  const fileName = `${dataYYYYMMDD}-${dadosEtapa.dadosMinuta.idMinuta}`;

  const fileLink = createCSV(dadosEtapa);

  const templates = mapOutorgadosFilteringErrors(dadosEtapa, (m) => {
    const minutaOutorgado = dadosEtapa.dadosMinuta.massificado[m];
    if (!listaMinutas || listaMinutas.includes(minutaOutorgado.idMinuta)) {
      return minutaOutorgado.template;
    }

    return false;
  });

  const pdf = <ArquivoPDF templates={templates} fileName={fileName} />;

  return (
    <>
      <div style={{ display: 'flex', gap: '1em' }}>
        <Button
          type="link"
          shape="round"
          icon={<DownloadOutlined />}
          size="large"
          href={fileLink}
          download={`${fileName}.csv`}
          style={{ background: '#1890ff', color: 'white' }}
        >
          Download da Lista para Cartório
        </Button>
        <DownloadDocumento fileName={fileName}>
          {pdf}
        </DownloadDocumento>
      </div>
      {/* @ts-ignore */}
      <PDFViewer style={{ width: '100%', height: '100vh' }}>
        {pdf}
      </PDFViewer>
    </>
  );
}

/**
 * @param {{
 *  templates: string[],
 *  fileName: string,
 * }} props
 */
const ArquivoPDF = ({ templates, fileName }) => (
  // @ts-ignore
  <Document title={fileName}>
    {
      templates.map((t) => (
        <PagePDF templatePage={t} key={t} />
      ))
    }
  </Document >
);

/**
 * @param {{
 *  children: React.ReactNode,
 *  fileName: string,
 * }} props
 */
const DownloadDocumento = ({ children, fileName }) => {
  try {
    return (
      // @ts-ignore
      <PDFDownloadLink
        document={children}
        fileName={fileName}
      >
        {
          /**
           * @param {{
           *  loading: boolean,
           *  error: string,
           * }} props
           */
          ({ loading, error }) => {
            /** @type {{ texto: string, color?: string }} */
            const { texto, color } = (() => {
              if (error) {
                return { texto: `Arquivo com erro: ${error}`, color: 'red' };
              }
              return { texto: loading ? 'Carregando documento...' : 'Baixe as minutas aqui!' };
            })();
            return (
              <div style={{ fontSize: '1.5em', marginBottom: '1em', color }}>
                {texto}
              </div>
            );
          }}
      </PDFDownloadLink>
    );
  } catch (error) {
    return <div>{`Arquivo com erro: ${error}`}</div>;
  }
};

/**
 * @param {Procuracoes.DadosProcuracao} dadosEtapa
 */
function createCSV(dadosEtapa) {
  // necessário para o csv funcionar em sistemas onde o separador padrão não é virgula
  const csvFileSeparator = 'sep=,';
  const csvHeaders = [
    'idLote',
    'idMinuta',
    'matricula',
    'outorgado',
    'outorgante',
    'prefixo',
    'dependencia',
    'uf',
    'super',
    'data',
    'livro',
    'folha',
    'dataVencimento',
    'dataManifesto'
  ];

  /** @param {string} matricula */
  function createRowsData(matricula) {
    return [
      /* idLote */ dadosEtapa.dadosMinuta.idMinuta,
      /* idMinuta */ dadosEtapa.dadosMinuta.massificado[matricula].idMinuta,
      /* matricula */ matricula,
      /* outorgado */ dadosEtapa.outorgadoMassificado.outorgados[matricula].nome,
      /* outorgante */ dadosEtapa.poderes.outorganteSelecionado.nome,
      /* prefixo */ /** @type {Funci} */ (dadosEtapa.outorgadoMassificado.outorgados[matricula]).dependencia.prefixo,
      /* dependencia */ /** @type {Funci} */ (dadosEtapa.outorgadoMassificado.outorgados[matricula]).dependencia.nome,
      /* uf */ /** @type {Funci} */ (dadosEtapa.outorgadoMassificado.outorgados[matricula]).dependencia.uf,
      /* super */ /** @type {Funci} */ (dadosEtapa.outorgadoMassificado.outorgados[matricula]).dependencia.super,
      /* data */ '',
      /* livro */ '',
      /* folha */ '',
      /* dataVencimento */ '',
      /* dataManifesto */ ''
    ];
  }

  const csvBody = mapOutorgadosFilteringErrors(dadosEtapa, createRowsData);

  const csvFile = new Blob([[csvFileSeparator, csvHeaders, ...csvBody].join('\n')], { type: 'text/csv' });
  return window.URL.createObjectURL(csvFile);
}

/**
 * @template {(matricula: string) => any} TFunc
 * @param {Procuracoes.DadosProcuracao} dadosEtapa
 * @param {TFunc} cb
 * @returns {NonFalsy<ReturnType<TFunc>>[]}
 */
function mapOutorgadosFilteringErrors(dadosEtapa, cb) {
  return dadosEtapa.outorgadoMassificado.listaDeMatriculas.map((matricula) => {
    if ( /** @type {Procuracoes.FunciError} */(dadosEtapa.outorgadoMassificado.outorgados[matricula]).error !== null) {
      return false;
    }

    return cb(matricula);
  }).filter(Boolean);
}

/**
 * @param {{
 *  templatePage: string
 * }} props
 */
function PagePDF({ templatePage }) {
  return <Page>
    {/* @ts-ignore */}
    <View
      style={{
        margin: 30,
        textAlign: 'justify',
        flexWrap: 'wrap',
        fontSize: '2rem',
      }}
    >
      <Html
        resetStyles
        stylesheet={{
          strong: {
            fontFamily: 'Times-Bold',
            fontSize: 12,
          },
          p: {
            fontFamily: 'Times-Roman',
          },
          '*': {
            fontSize: 12,
            lineHeight: '1.2',
          }
        }}>
        {
          templatePage
            .replace(/\r\n /g, ' ')
            .replace(/\r\n/g, '')
            .replace(/ +/g, ' ')
        }
      </Html>
    </View>
  </Page>;
}

