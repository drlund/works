import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import history from "@/history.js";
import { message } from 'antd';
import { getBrindesCatalogo } from 'services/ducks/Encantar.ducks';
import { toggleSideBar } from 'services/actions/commons';
import useEffectOnce from 'utils/useEffectOnce';
import BrindesList, { MODOS } from './BrindesList';

function Catalogo() {
  const [brindesCatalogo, setBrindesCatalogo] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);
  //const [brindesSelecionados, setBrindesSelecionados] = useState([{dadosEstoque: {id: 2}}, {dadosEstoque: {id: 5}}])
  const dispatch = useDispatch();

  useEffectOnce(() => {
    dispatch(toggleSideBar(true))
  })

  const loadCatalogo = useCallback(() => {
    setFetchingData(true);
    setBrindesCatalogo([]);
    getBrindesCatalogo()
      .then(data => {
        setBrindesCatalogo(data)
      })
      .catch(error => {
        message.error(error);
      })
      .then(() => {
        //finally
        setFetchingData(false)
      })
  }, [])

  useEffectOnce(() => {
    loadCatalogo();
  })

  function onBrindeRemoved(idBrinde) {
    const newList = brindesCatalogo.filter(elem => elem.id !== idBrinde);
    setBrindesCatalogo(newList);
  }

  function onReloadAllBrindes() {
    loadCatalogo()
  }

  function onNewBrinde() {
    history.push('/encantar/novo-brinde')
  }

  function onEditBrinde(idBrinde) {
    history.push(`/encantar/editar-brinde/${idBrinde}`)
  }
  
  return (    
    <BrindesList 
      modo={MODOS.CATALOGO}
      listData={brindesCatalogo} 
      onBrindeRemoved={onBrindeRemoved} 
      onReloadAllBrindes={onReloadAllBrindes}
      loading={fetchingData}
      onNewBrindeClick={onNewBrinde}
      onEditBrindeClick={onEditBrinde}
      //selectedListIds={brindesSelecionados}
      //onBrindeSelected={(brindeData) => setBrindesSelecionados([...brindesSelecionados, brindeData]) }
      //onBrindeDeselected={(brindeData) => setBrindesSelecionados(brindesSelecionados.filter(elem => elem.dadosEstoque.id !== brindeData.dadosEstoque.id))}
    />
  )
}

export default Catalogo