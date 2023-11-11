import {
  Document, Page, PDFDownloadLink, PDFViewer, View
} from '@react-pdf/renderer';
import Html from 'react-pdf-html';

/**
 * @param {Procuracoes.CurrentStepParameters<Procuracoes.DadosProcuracao>} props
 */
export function EtapaBaixarMinuta({ dadosEtapa }) {
  const pdf = <PaginaPDF dadosEtapa={dadosEtapa} />;
  const dataYYYYMMDD = new Date().toISOString().slice(0, 10);

  return (
    <>
      <DownloadDocumento fileName={`${dataYYYYMMDD}-${dadosEtapa.minutaCadastrada.idMinuta}`}>
        {pdf}
      </DownloadDocumento>
      {/* @ts-ignore */}
      <PDFViewer style={{ width: '100%', height: '100vh' }}>
        {pdf}
      </PDFViewer>
    </>
  );
}

/**
 * @param {{
*  dadosEtapa: Procuracoes.DadosProcuracao
* }} props
*/
const PaginaPDF = ({ dadosEtapa }) => (
  // @ts-ignore
  <Document title={dadosEtapa.minutaCadastrada.idMinuta}>
    <Page>
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
          {dadosEtapa.dadosMinuta.template.replace(/\r\n /g, ' ').replace(/\r\n/g, '').replace(/ +/g, ' ')}
        </Html>
      </View>
    </Page>
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
              return { texto: loading ? 'Carregando documento...' : 'Baixe a minuta aqui!' };
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
