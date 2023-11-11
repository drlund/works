import React, { useState, useEffect, useCallback } from 'react';
import { Input, Select, Button, InputNumber, Pagination, Alert } from 'antd';
import { FilterOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import BrindCard from './BrindeCard';
import PageLoading from 'components/pageloading/PageLoading';
import { removerAcentos } from 'utils/Commons';
import styles from './BrindesList.module.scss';
import CommonStyles from "@/Commons.module.scss";

const Option = Select.Option;

/*const mockBrindeData = {
  id: 1,
  nome: "Panela de Pressão",
  descricao: "Esta panela de pressão é muito segura e rápida no cozimento.",
  valorEstimado: 150,
  permiteMultiplos: 0,
  limiteMinimo: 1,
  limiteMaximo: 1,
  fatorIncremento: 1,
  tipo: "quantidade",
  dadosEstoque: { //pode ser omitido, caso nao seja configurado o modo estoque
    id: 1,
    prefixo: "9009",
    ativo: 1,
    estoque: 4,
    reservas: 1
  },
  imagens: [ //1 ou mais imagens
    "https://images-na.ssl-images-amazon.com/images/I/41IjG2SoS3L._AC_SX425_.jpghttps://images-na.ssl-images-amazon.com/images/I/41IjG2SoS3L._AC_SX425_.jpg",
    "https://images-na.ssl-images-amazon.com/images/I/41IjG2SoS3L._AC_SX425_.jpghttps://images-na.ssl-images-amazon.com/images/I/41IjG2SoS3L._AC_SX425_.jpg",
    "https://images-na.ssl-images-amazon.com/images/I/41IjG2SoS3L._AC_SX425_.jpghttps://images-na.ssl-images-amazon.com/images/I/41IjG2SoS3L._AC_SX425_.jpg"
  ]
}*/

export const MODOS = {
  CATALOGO: "catalogo",
  ESTOQUE_SELECAO: "estoque-selecao",
  ESTOQUE_EXIBICAO: "estoque-exibicao",
  SOLICITACAO_SELECAO: "soicitacao-selecao",
  SOLICITACAO_EXIBICAO: "solicitacao-exibicao",
  SOMENTE_LEITURA: "somente-leitura"
}

function BrindesList(props) {
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [situacao, setSituacao] = useState("ativos");
  const [itensPerRow, setItensPerRow] = useState(props.itensPerRow);
  const [itensPerPage, setItensPerPage] = useState(10);
  const [filteredListData, setFilteredListData] = useState([]);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);

  function calculateItensPerRow() {
    let template = [];

    for (let i=0; i<itensPerRow; ++i) {
      template.push("1fr")
    }

    return template.join(" ")
  }

  function onChangeItensPerRow(value) {
    setItensPerRow(value);
  }

  function onBrindeRemoved(idBrinde) {
    if (props.onBrindeRemoved) {
      props.onBrindeRemoved(idBrinde)
    }
  }

  function onBrindeSelected(brindeData) {
    if (props.onBrindeSelected) {
      props.onBrindeSelected(brindeData)
    }
  }

  function onBrindeDeselected(brindeData) {
    if (props.onBrindeDeselected) {
      props.onBrindeDeselected(brindeData)
    }
  }

  function onReloadAllBrindes() {
    if (props.onReloadAllBrindes) {
      props.onReloadAllBrindes()
    }
  }

  function onBrindeStatusChanged() {
    if (props.onReloadAllBrindes) {
      props.onReloadAllBrindes()
    }    
  }

  function onBrindeEdited(idBrinde) {
    if (props.onEditBrindeClick) {
      props.onEditBrindeClick(idBrinde)
    }
  }

  function onBrindeAddQuantity(idEstoque) {
    if (props.onBrindeAddQuantity) {
      props.onBrindeAddQuantity(idEstoque)
    }
  }

  function onBrindeRemoveQuantity(idEstoque) {
    if (props.onBrindeRemoveQuantity) {
      props.onBrindeRemoveQuantity(idEstoque)
    }
  }

  const isModoEstoqueExibicao = useCallback(() => {
    return  props.modo === MODOS.ESTOQUE_EXIBICAO
  }, [props.modo])

  function renderBrindesList() {
    //configuracao dos botoes por modo
    const actionsPorModo = {
      [MODOS.CATALOGO] : {canEdit: true, canDeleteCatalogo: true},
      [MODOS.ESTOQUE_SELECAO]: {canCheck: true},
      [MODOS.ESTOQUE_EXIBICAO]: {
        canDeselect: true, 
        canActivate: true, 
        canDeactivate: true, 
        canAddQuantity: true, 
        canRemoveQuantity: true, 
        canDeleteEstoque: true
      },
      [MODOS.SOLICITACAO_SELECAO]: {canSelect: true, canDeselect: true},
      [MODOS.SOLICITACAO_EXIBICAO]: {} 
    }

    return currentPageData.map(elem => {
      //verifica se esta no modo selecao e o brinde esta na lista de selecionados
      let selected = false;
      let highLightSelected = false;

      if ((isAlgumModoSelecao() || isModo(MODOS.SOLICITACAO_EXIBICAO)) && props.selectedList) {
        //verifica se o id esta na lista de selecionados
        for (let brindeSelected of props.selectedList) {
          if (isModo(MODOS.SOLICITACAO_SELECAO) || isModo(MODOS.SOLICITACAO_EXIBICAO)) {
            if (brindeSelected.dadosEstoque && brindeSelected.dadosEstoque.id === elem.dadosEstoque.id) {
              selected = true;
              
              if (isModo(MODOS.SOLICITACAO_SELECAO)) {
                highLightSelected = true;
              }

              break;
            }  

          } else if (isModo(MODOS.ESTOQUE_SELECAO)) {
              if (brindeSelected.idBrinde === elem.id) {
                selected = true;    
                highLightSelected = true;
                break;
              }
          }
        }
      }

      return (
        <BrindCard 
          key={elem.id}
          selected={selected}
          highLightSelected={highLightSelected}
          showEstoqueInfo={isModo(MODOS.ESTOQUE_EXIBICAO)} 
          showResumoInfo={{
            valorEstimado: isModo(MODOS.CATALOGO),
            permiteMultiplos: true,
            validade: true,
            showQuantidade: isModo(MODOS.SOLICITACAO_EXIBICAO)
          }}
          data={elem} 
          actionsConfig={actionsPorModo[props.modo]}
          onBrindeRemoved={onBrindeRemoved}
          onBrindeEdited={onBrindeEdited}
          onBrindeSelected={onBrindeSelected}
          onBrindeDeselected={onBrindeDeselected}
          onBrindeStatusChanged={onBrindeStatusChanged}
          onBrindeAddQuantity={onBrindeAddQuantity}
          onBrindeRemoveQuantity={onBrindeRemoveQuantity}
        />
      )
    })
  }

  const showPageData = useCallback((page) => {
    let pageSize = itensPerPage;
    let startPos = page * pageSize - pageSize;
    let endPos = startPos + pageSize;
    let pageData = [];
    
    if (filteredListData.length) {
      pageData = filteredListData.slice(startPos, endPos);
    }

    setCurrentPageData(pageData);
  }, [filteredListData, itensPerPage])

  function onTermoPesquisaChange(e) {
    setTermoPesquisa(e.target.value)
  }

  const onFilterResults = useCallback(() => {
    const termoNormalized = removerAcentos(termoPesquisa).toLowerCase();

    let filteredList = props.listData.filter(elem => {
      const nomeNormalized = removerAcentos(elem.nome).toLowerCase();
      const descricaoNormalized = removerAcentos(elem.descricao).toLowerCase();

      if (termoNormalized !== "") {
        if (!nomeNormalized.includes(termoNormalized) || !descricaoNormalized.includes(termoNormalized)) {
          return false;
        }

        if (isModoEstoqueExibicao()) {
          //verifica a situacao
          if (situacao !== "todos") {
            return elem.dadosEstoque.ativo === (situacao === "ativos" ? 1 : 0)
          } else {
            return true
          }
        } else {
          return true
        }
      } else {
        if (isModoEstoqueExibicao()) {
          //verifica a situacao
          if (situacao !== "todos") {
            return elem.dadosEstoque.ativo === (situacao === "ativos" ? 1 : 0)
          } else {
            return true
          }
        } else {
          return true
        }  
      }
    })

    setFilteredListData(filteredList);
  }, [situacao, termoPesquisa, props.listData, isModoEstoqueExibicao])

  function onPageChange(page, pageSize) {
    setPageNumber(page)
  }

  function onShowSizeChange(current, size) {
    setItensPerPage(size);
    setPageNumber(1);
  }

  useEffect(() => {
    setFilteredListData(props.listData);
  }, [props.listData])

  useEffect(() => {
    setPageNumber(1)
    showPageData(1)
  }, [filteredListData, showPageData])

  useEffect(() => {
    showPageData(pageNumber)
  }, [pageNumber, showPageData])

  useEffect(() => {
    showPageData(1)
  }, [itensPerPage, showPageData])

  function isModo(modo) {
    return props.modo === modo
  }

  /*function isModoEstoqueSelecao() {
    return props.modo === MODOS.ESTOQUE_SELECAO
  }*/

  function isModoCatalogo() {
    return props.modo === MODOS.CATALOGO
  }

  function isAlgumModoSelecao() {
    return [MODOS.ESTOQUE_SELECAO, MODOS.SOLICITACAO_SELECAO].includes(props.modo)
  }

  function onChangeSituacao(value) {
    setSituacao(value)
  }

  function onHandleKey(e) {
    if (e.keyCode === 13) {
      onFilterResults()
    }
  }

  return (    
    <div className={CommonStyles.flexColumn}>
      <div className={CommonStyles.flexRow} style={{marginBottom: 15}}>
        <div className={CommonStyles.flexColumn} style={{flex: "40%", paddingRight: 10}}>
          <div style={InnerStyles.headerText}>Consultar Brindes</div>
            <Input 
              placeholder="Digite a sua pesquisa (nome ou descrição do brinde)" 
              defaultValue={termoPesquisa} 
              onChange={onTermoPesquisaChange} 
              allowClear={true} 
              onKeyUp={onHandleKey}
            />
        </div>

        { isModoEstoqueExibicao() &&
          <div className={CommonStyles.flexColumn} style={{flex: "15%", paddingRight: 10}}>
            <div style={InnerStyles.headerText}>Situação</div>
            <Select value={situacao} onChange={onChangeSituacao}>
              <Option value="ativos">Ativos</Option>
              <Option value="inativos">Inativos</Option>
              <Option value="todos">Todos</Option>
            </Select>
          </div>
        }

        <div className={CommonStyles.flexColumn} style={{flex: "5%"}}>
          <div style={InnerStyles.headerText}>&nbsp;</div>
          <Button icon={<FilterOutlined />} title="Filtrar consulta" type="primary" onClick={onFilterResults} />
        </div>

        { (isModoCatalogo() || isModoEstoqueExibicao()) && 
          <div className={CommonStyles.flexColumn} style={{flex: "5%"}}>
            <div style={InnerStyles.headerText}>&nbsp;</div>
            <Button icon={<ReloadOutlined />} title="Recarrega todos os brindes do catálogo" type="primary" onClick={onReloadAllBrindes} />          
          </div>
        }

        { (isModoCatalogo() || isModoEstoqueExibicao()) &&
          <div 
            className={`${CommonStyles.flexColumn} ${CommonStyles.selfEnd}`} 
            style={{flex: (isModoEstoqueExibicao()) ? "17%" : "32%", marginRight: 10}}
          >
            <Button className={CommonStyles.selfEnd} onClick={props.onNewBrindeClick} icon={<PlusOutlined />} type="primary">
              Inclur Novo Brinde
            </Button>
          </div>
        }

        <div className={`${CommonStyles.flexColumn} ${CommonStyles.selfEnd}`} style={{flex: "13%"}}>
          <div className={`${CommonStyles.flexColumn} ${CommonStyles.flexVEnd}`}>
            <div style={InnerStyles.headerText}>Itens por Linha:</div>
            <InputNumber min={3} max={10} value={itensPerRow} onChange={onChangeItensPerRow}/>
          </div>
        </div>

      </div>

      <div className={styles.greyBackground} style={{padding: 10, minHeight: 600}}>
        {props.loading && 
          <PageLoading />
        }

        { (!props.loading && currentPageData.length === 0) &&
            <div className={CommonStyles.flexColumn} style={{marginBottom: 20, marginTop: 15}}>
              <Alert message="Nenhum brinde encontrado nesta consulta." type="warning" showIcon />
            </div>      
        }

        { !props.loading && currentPageData.length > 0 &&
          <div style={{
            display: 'grid', 
            gridTemplateColumns: calculateItensPerRow(), 
            justifyContent: "space-evenly",
            alignItems: "flex-start"
          }}>
            {renderBrindesList()}
          </div>
        }

        { !props.loading && 
          <div className={CommonStyles.flexColumn}>
            <div style={{flex:1, display: 'flex', justifyContent: 'right', paddingTop: 5, paddingBottom: 5}}>
              <Pagination 
                showSizeChanger
                showTotal={(total, range) => `${range[0]}-${range[1]} de ${total} itens`}
                onShowSizeChange={onShowSizeChange}
                onChange={onPageChange}
                defaultCurrent={1}
                current={pageNumber}
                pageSizeOptions={['5', '10', '20', '50', '100']}
                total={filteredListData.length}            
              />
            </div>
          </div>
        }
      </div>
    </div>
  )
}

BrindesList.defaultProps = {
  modo: MODOS.SOMENTE_LEITURA,
  selectedList: [], //lista dos brindes selecionados
  itensPerRow: 5,
  onNewBrindeClick: () => {},
  onEditBrindeClick: () => {}
}

const InnerStyles = {
  headerText: {
    fontWeight: 'bold', 
    marginBottom: 5
  }
}


export default BrindesList
