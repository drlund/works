const Env = use('Env');
const SIGN_URL = Env.get('FRONTEND_URL') + "ordemserv/assinar-ordem";

const Styles = {
  bgHeader: '#1890ff'
}

const { renderHeader, renderFooter } = use('App/Templates/OrdemServ/Commons');
const headerSection = renderHeader(Styles.bgHeader);
const footerSection = renderFooter();

/**
 * Parâmetros deste template:
 * {1} - Nome de guerra do Funci
 * {2} - Título da Ordem de Serviço
 * {3} - Descrição
 * {4} - Id da Ordem
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
                  <td style="width: 100%; height: 27px;" colspan="2"><span style="">Caro(a) <strong>{1}</strong>,</span></td>
                </tr>
                <tr style="height: 26px;">
                  <td style="width: 100%; height: 26px;" colspan="2"><span style="font-family: helvetica, sans-serif;">Voc&ecirc; foi inclu&iacute;do(a) como <strong>Designante</strong> na Ordem de Servi&ccedil;o abaixo:</span></td>
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
                  <td style="width: 15%; height: 26px;"><span><strong>N&uacute;mero</strong>:</span></td>
                  <td style="width: 85%; height: 26px;"><span>{2}</span></td>
                </tr>


                  <tr style="height: 26px; border-bottom: 1px solid #ccc;">
                    <td style="width: 15%; height: 26px;"><span><strong>T&iacute;tulo da O.S</strong>:</span></td>
                    <td style="width: 85%; height: 26px;"><span>{3}</span></td>
                  </tr>
                  <tr style="height: 40px;">
                    <td style="width: 15%; height: 40px; vertical-align: top; padding-top: 10px;"><span><strong>Descri&ccedil;&atilde;o</strong>:</span></td>
                    <td style="width: 85%; height: 40px; vertical-align: top; padding-top: 10px;"><span>{4}</span></td>
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
                    <span>Verifique os dados completos desta O.S e realize a assinatura <a href="${SIGN_URL}/{5}" target="_blank" rel="noopener noreferrer">clicando aqui.</a></span>
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