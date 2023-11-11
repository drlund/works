import React from 'react';
import styles from '../Gerenciar/styles.module.scss';
import ListaCanaisInscrito from './ListaCanaisInscrito';

export default function CanaisInscrito() {
  return (
    <div className={styles.containerGerenciar}>
      <ListaCanaisInscrito />
    </div>
  );
}
