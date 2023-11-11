const Env = use("Env");
const SIGN_URL = Env.get("FRONTEND_URL") + "patrocinios/gestao";

const Styles = {
  bgHeader: "#1890ff",
};

const { renderHeader, renderFooter } = use("App/Templates/Patrocinios/Commons");
const headerSection = renderHeader(Styles.bgHeader);
const footerSection = renderFooter();

/**
 * Parâmetros deste template:
 * {1} - Nome de guerra do Funci
 * {2} - Nome do Evento
 * {3} - Motivo da Devolução
 * {4} - Id da Solicitação
 */
module.exports = `

<div style="padding-top: 30px;">

  ${headerSection}

  <div style="border:1px solid #ccc; border-bottom:none; width:80%; margin: 0 auto; top: 20px; background: #f9f9ff;">
    <table style="border-collapse: collapse; width: 100%;">
      <tbody style="font-size: 14px; color: #565656; font-family: helvetica, sans-serif;">
        <tr>
          <td style="padding-top: 15px;">
            <table style="border-collapse: collapse; width:95%; margin: 0 auto; color: #565656; border:none;" border="0">
              <tbody>
                <tr style="height: 27px;">
                  <td style="width: 100%; height: 27px;" colspan="2"><span style="">Prezado(a) <strong>{1}</strong>,</span></td>
                </tr>
                <tr style="height: 26px;">
                  <td style="width: 100%; height: 26px;" colspan="2">
                    <span style="font-family: helvetica, sans-serif;">Comunicamos a <strong>devolu&ccedil;&atilde;o</strong> da solicita&ccedil;&atilde;o de patroc&iacute;nio abaixo:</span>
                  </td>
                </tr>
              </tbody>
            </table>  
          </td>
        </tr>

        <tr>
          <td>      
            <div style="border: 1px solid #ccc; background-color:#ffffff; width:93%; margin: 0 auto; padding: 10px;">
              <table style="border-collapse: collapse; width:100%; font-size: 14px; color: #565656; border:none;" border="0">
                <tbody style="font-family: helvetica, sans-serif;">
                  <tr style="height: 26px; border-bottom: 1px solid #ccc;">
                    <td style="width: 15%; height: 26px;"><span><strong>Evento</strong>:</span></td>
                    <td style="width: 85%; height: 26px;"><span>{2}</span></td>
                  </tr>

                  <tr style="height: 26px; border-bottom: 1px solid #ccc;">
                    <td style="width: 15%; height: 26px;"><span><strong>Motivo</strong>:</span></td>
                    <td style="width: 85%; height: 26px;"><span>{3}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>

        <tr>
          <td style="padding-bottom: 20px;">      
            <table style="border-collapse: collapse; width:95%; margin: 0 auto; font-size: 14px; color: #565656; border:none;" border="0">
              <tbody style="font-family: helvetica, sans-serif;">
                <tr style="height: 43px;">
                  <td style="width: 100%; height: 43px; padding-left:4px;" colspan="2">
                    <span>Acesse a ferramenta <a href="${SIGN_URL}" target="_blank" rel="noopener noreferrer">clicando aqui.</a></span>
                  </td>
                </tr>
              </tbody>
            </table>  
          </td>
        </tr>

      </tbody>
    </table>
  </div>

  <div style="width:80%; margin: 0 auto; background-color: #eaeaf2; height: 135px; font-family: helvetica, sans-serif; border: 1px solid #ccc; border-top: 2px solid #ccc;">
    ${footerSection}
  </div>

</div>
`;
