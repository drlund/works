import React, { useState } from 'react';
import {
  Card, PageHeader, Button
} from 'antd';
import Episodios from './Episodios';
import Gerenciar from './Gerenciar';
import IncluirEpisodio from './IncluirEpisodio';
import { usePermissaoGerenciar } from './hooks/usePermissaoGerenciar';

/**
 * @typedef {Record<string,Option>} MenuOptions
 *
 * @typedef {Object} Option
 * @property {string} title
 * @property {string} label
 * @property {JSX.Element} content
 * @property {"primary"|"secondary"} type
 */

const menuOptions = /** @satisfies {MenuOptions} */({
  episodios: {
    title: "Episódios",
    label: "Episódios",
    content: <Episodios />,
    type: "secondary",
  },
  gerenciar: {
    title: "Gerenciar",
    label: "Gerenciar",
    content: <Gerenciar />,
    type: "secondary",
  },
  incluir: {
    title: "Incluir Novo Episódio",
    label: "Incluir Novo Episódio",
    content: <IncluirEpisodio />,
    type: "primary",
  },
});


function Home() {
  const [options, setOptions] = useState(/** @type {keyof menuOptions} */('episodios'));
  const hasGerenciarPermission = usePermissaoGerenciar();

  return (
    <Card>
      <PageHeader
        className="site-page-header"
        title={<h3>{menuOptions[options].title}</h3>}
        extra={
          hasGerenciarPermission ? (
            /** @type {[keyof menuOptions, Option][]} */
            (Object.entries(menuOptions)).map(([key, value]) => (
              <Button
                key={key}
                // @ts-ignore
                type={value.type}
                disabled={key === options}
                onClick={() => setOptions(key)}
              >
                {value.label || value.title}
              </Button>
            ))
          ) : null
        }
      >
        {menuOptions[options].content}
      </PageHeader>
    </Card >
  );
}

export default Home;
