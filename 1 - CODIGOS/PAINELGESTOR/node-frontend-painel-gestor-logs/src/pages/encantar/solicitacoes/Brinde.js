import React, { useState, useEffect } from "react";
import {Card} from 'antd';
import style from './brinde.module.scss';

const { Meta } = Card;

const Brinde = ({brinde}) => {
  
  console.log(brinde);


  if(!brinde){
    return (
      <div className={style.semBrinde}>
        <p>Nenhum brinde selecionado</p>
      </div>
    );
  }
  return (
    <Card
      hoverable={false}
      style={{ width: 240 }}
      cover={
        <img
          alt="example"
          src={`http://localhost:3333/encantar/brinde-img/${brinde.id}`}
        />
      }
    >
      <Meta title={brinde.nome} description={brinde.descricao} />
    </Card>
  );
};

export default Brinde;
