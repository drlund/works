import React, { useState, useCallback } from 'react';
import BrindesList, { MODOS } from './BrindesList';
import { message, Modal } from 'antd';
import { useDispatch } from 'react-redux';
import { getBrindesEstoque, getBrindesCatalogo, incluirBrindesEstoque } from 'services/ducks/Encantar.ducks';
import { toggleSideBar } from 'services/actions/commons';
import useEffectOnce from 'utils/useEffectOnce';

function ConsultarEstoque() {
  const [brindesEstoque, setBrindesEstoque] = useState([]);
  const [brindesCatalogo, setBrindesCatalogo] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [fetchingCatalogoData, setFetchingCatalogoData] = useState(false);
  const [showModalInclusao, setShowModalInclusao] = useState(false);
  const [brindesSelecionados, setBrindesSelecionados] = useState([]);
  const dispatch = useDispatch();

  useEffectOnce(() => {
    dispatch(toggleSideBar(true))
  })

  const loadMeuEstoque = useCallback(() => {
    setFetchingData(true);
    setBrindesEstoque([]);
    getBrindesEstoque()
      .then(data => {
        setBrindesEstoque(data)
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
    loadMeuEstoque();
  })

  function onReloadAllBrindes() {
    loadMeuEstoque()
  }

  function onNewBrinde() {
    loadBrindesCatalogo()
    setShowModalInclusao(true)
  }

  function loadBrindesCatalogo() {
    setFetchingCatalogoData(true)
    getBrindesCatalogo()
    .then(data => {
      setBrindesCatalogo(data)
    })
    .catch(error => {
      message.error(error);
    })
    .then(() => {
      //finally
      setFetchingCatalogoData(false)
    })
  }

  function onBrindeSelected(brindeData) {
    //faz a inclusao do novo brinde no estoque
    setBrindesSelecionados([...brindesSelecionados, brindeData])
  }

  function onBrindeDeselected(brindeData) {
    setBrindesSelecionados(brindesSelecionados.filter(elem => elem.id !== brindeData.id))
  }

  function onIncludeSelected() {
    setShowModalInclusao(false);
    setFetchingData(true)
    let listaIdsBrindes = brindesSelecionados.map(elem => elem.id);
    incluirBrindesEstoque(listaIdsBrindes)
      .then(resp => {
        message.success(resp)
        setBrindesSelecionados([])
        onReloadAllBrindes()
      })
      .catch(error => {
        message.error(error)
      })
      .then(() => {
        setFetchingData(false)
      })
  }

  return (
    <React.Fragment>
      <BrindesList 
        modo={MODOS.ESTOQUE_EXIBICAO}
        listData={brindesEstoque} 
        onReloadAllBrindes={onReloadAllBrindes}
        loading={fetchingData}
        onBrindeRemoved={onReloadAllBrindes}
        onBrindeAddQuantity={onReloadAllBrindes}
        onBrindeRemoveQuantity={onReloadAllBrindes}
        onNewBrindeClick={onNewBrinde}
      />

      <Modal
        title={`Catálogo de Brindes - Total Selecionados (${brindesSelecionados.length})`}
        width={'85%'}
        maskClosable={false}
        centered={true}
        visible={showModalInclusao}
        onCancel={() => {
          setShowModalInclusao(false)
          setBrindesSelecionados([])
        }}
        onOk={onIncludeSelected}
        okText="Incluir Todos"
        okButtonProps={{disabled: !brindesSelecionados.length}}
      >
        <BrindesList
          modo={MODOS.ESTOQUE_SELECAO}
          listData={brindesCatalogo}
          selectedList={brindesEstoque}
          loading={fetchingCatalogoData}
          onBrindeSelected={onBrindeSelected}
          onBrindeDeselected={onBrindeDeselected}
        />
      </Modal>
    </React.Fragment>
  )
}

export default ConsultarEstoque
