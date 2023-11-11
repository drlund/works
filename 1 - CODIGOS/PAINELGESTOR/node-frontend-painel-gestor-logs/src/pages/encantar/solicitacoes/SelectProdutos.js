import React, { useState, useEffect } from "react";
import { Select, message } from "antd";
import { fetchProdutosBB } from "services/ducks/Encantar.ducks";

const SelectProdutosBB = (props) => {
  const [listaProdutos, setListaProdutos] = useState([]);

  useEffect(() => {
    if (listaProdutos.length === 0) {
      fetchProdutosBB()
        .then((produtos) => {
          setListaProdutos(produtos);
        })
        .catch((error) => {
          message.error(error);
        });
    }
  }, [listaProdutos]);

  return (
    <>
      <Select
        showSearch
        loading={listaProdutos === null}
        options={listaProdutos.map((produtoBB) => {
          return { label: produtoBB.descricao, value: produtoBB.id };
        })}
        style={{ width: "100%", textAlign: "left" }}
        placeholder={
          props.placeholder ? props.placeholder : "Selecione o produto"
        }
        value={props.produtoBB?.descricao}
        onChange={(idProduto) =>
          props.updateProdutoBB(
            listaProdutos.find((produto) => produto.id === idProduto)
          )
        }
        optionFilterProp="children"
      />
      {/* {listaProdutos.map((produto) => {
          return <Option value={produto.id} sele> {produto.descricao} </Option>;
        })} */}
      {/* </Select> */}
    </>
  );
};

export default SelectProdutosBB;
