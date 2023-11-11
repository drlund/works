import React, { useState } from 'react';
import { message, Alert } from 'antd';
import { fetchBrindeCatalogo } from 'services/ducks/Encantar.ducks';
import PageLoading from 'components/pageloading/PageLoading';
import useEffectOnce from 'utils/useEffectOnce';
import BrindeForm from './BrindeForm';

function EditarBrinde(props) {
  const [dadosBrinde, setDadosBrinde] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [errorFetch, setErrorFetch] = useState(null);
  const id = parseInt(props.match.params.id);

  useEffectOnce(() => {
    fetchBrindeCatalogo(id)
      .then((data) => {
        console.log("dados do brinde: ", data);
        setDadosBrinde(data);
        setErrorFetch(null);
      })
      .catch(error => {
        message.error(error);
        setErrorFetch(error);
      })
      .then(() => setLoading(false))
  })

  if (loading) {
    return <PageLoading />;
  }

  if (errorFetch) {
    return (
      <div style={{ height: "600px"}}>
        <div style={{paddingLeft: "20px"}}>
          <Alert message={errorFetch} type="error" showIcon />
        </div>
      </div>
    )
  }

  return (
    <BrindeForm formData={dadosBrinde} />
  )
}

export default EditarBrinde
