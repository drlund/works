import { Divider } from 'antd';
import React from 'react';
import CriarCanalForm from './CriarCanalForm';
import ListaCanais from './ListaCanais';
import styles from './styles.module.scss';

export default function Gerenciar() {
  
  return (
    <div className={styles.containerGerenciar}>
      <Divider orientation="left" className={styles.divider}>Canais Ativos</Divider>
      <ListaCanais />
      <Divider orientation="left">Criar um Canal</Divider>
      <CriarCanalForm />
    </div>
  )
}