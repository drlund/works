import React from 'react';
import { Tabs } from 'antd';
import GerenciadorDisponibilidade from './disponibilidade';
import MenuManager from './menu';
import './index.css';
import { toggleSideBar } from '@/services/actions/commons';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

const mytabs = [
  {
    id: 1,
    name: 'Disponibilidade',
    content: <GerenciadorDisponibilidade />,
  },
  {
    id: 2,
    name: 'Menus',
    content: <MenuManager />,
  },
];

function GerenciadorDeFerramentas() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(toggleSideBar(true));
  }, []);

  return (
    <div>
      <Tabs
        defaultActiveKey="1"
        type="card"
        size="large"
        items={mytabs.map((_, i) => {
          const id = String(i + 1);
          return {
            label: _.name,
            key: id,
            children: _.content,
          };
        })}
      />
    </div>
  );
}

export default GerenciadorDeFerramentas;
