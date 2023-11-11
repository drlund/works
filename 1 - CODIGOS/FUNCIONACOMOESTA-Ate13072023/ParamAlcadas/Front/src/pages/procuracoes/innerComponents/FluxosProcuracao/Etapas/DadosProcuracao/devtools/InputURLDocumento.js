import { Input } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';

import { tiposEtapa } from '../tiposEtapa';

export function InputURLDocumento({
  tipoEtapa, form, arquivoProcuracao, urlDocumento, setUrlDocumento
}) {
  useEffect(() => {
    if (urlDocumento === '') {
      setUrlDocumento(null);
    }
  }, [urlDocumento]);

  const handleDevClick = () => {
    setUrlDocumento('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
    const extraValues = (tipoEtapa === tiposEtapa.publica) ? {
      dataManifesto: moment().subtract(1, 'days'),
      custo: form.getFieldValue('custo') || 12.34,
      prefixoCusto: form.getFieldValue('prefixoCusto') || 1234,
      folha: 42,
      livro: 42
    } : {};

    form.setFieldsValue({
      dataEmissao: moment(),
      dataVencimento: moment().add(10, 'days'),
      ...extraValues
    });
  };

  return (
    <>
      <div>Dev only:</div>
      <div style={{ display: 'flex' }}>
        <Input
          disabled={arquivoProcuracao !== null}
          value={urlDocumento}
          onChange={(e) => setUrlDocumento(e.target.value)}
          placeholder="Link do documento" />
      </div>
      <button onClick={handleDevClick} type="button">Dev Preencher Dados</button>
    </>
  );
}
