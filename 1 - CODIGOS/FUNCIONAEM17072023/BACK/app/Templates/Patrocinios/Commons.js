const { base64Logo } = use("App/Templates/Patrocinios/LogoBBBase64");

module.exports = {
  renderHeader: (bgHeader) => {
    return `
    <div style="width:80%; margin: 0 auto; top: 20px; background-color: ${bgHeader}; height: 70px; 
                font-family: helvetica, sans-serif; border: 1px solid ${bgHeader};border-bottom: none;">
        <div style="color: #fff; font-weight: bold; font-size: 22px; padding: 23px 0 0 20px;">Patroc&iacute;nios</div>
    </div>`;
  },

  renderFooter: () => {
    return `    
      <table style="width:100%;">
        <tbody>
          <tr style="">
            <td style="padding-left: 30px;padding-top: 15px;width: 15%;">
              <img src="${base64Logo}" height="100">
            </td>
            <td style="vertical-align: top;">
              <div style="color: #565656; font-weight: bold; font-size: 20px;padding: 44px 0 0 0px;">Ferramenta de Patroc&iacute;nios</div>
              <div style="color: #757474; font-weight: bold; font-size: 15px;">Banco do Brasil S.A</div>
            </td>
          </tr>
        </tbody>
      </table>`;
  },
};
