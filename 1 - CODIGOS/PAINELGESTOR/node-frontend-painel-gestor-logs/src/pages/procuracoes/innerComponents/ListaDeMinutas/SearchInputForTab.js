import { Input } from 'antd';
import React, {
  useEffect,
  useRef,
  useState
} from 'react';

/**
 * Renderiza um input de pesquisa caso o tab atual não seja o primeiro (posiçãozero)
 *
 * @param {Object} props props
 * @param {"0"|"1"|"2"} props.activePanel controla a visibilidade, considerando que o elemento zero não precisa mostrar o input
 * @param {Array<{
 *    label: string;
 *    key: string;
 *    children: JSX.Element;
 *    placeholder?: string;
 *    onSearch?: (query: string) => Promise<void>;
 *    validator?: (value: string) => boolean;
 *  }>} props.tabItems objetos referentes as tabs
 * @param {boolean} props.searching boolean para saber se o fetch está sendo feito
 */
export const SearchInputForTab = ({ activePanel, tabItems, searching }) => {
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    if (activePanel && ref.current) {
      ref.current.focus();
    }
  }, [activePanel]);

  const handleChange = (/** @type {import('react').ChangeEvent<HTMLInputElement>} */ { target }) => {
    if (tabItems[Number(activePanel)].validator?.(target.value) ?? true) {
      setSearch(target.value);
    }
  }

  return (
    <div style={{
      // caso diferente de zero, mostra o input
      display: activePanel !== '0' ? 'unset' : 'none'
    }}>
      <Input.Search
        key={activePanel}
        ref={ref}
        allowClear
        enterButton
        loading={searching}
        value={search}
        onChange={handleChange}
        placeholder={tabItems[Number(activePanel)].placeholder}
        onSearch={tabItems[Number(activePanel)].onSearch} />
    </div>
  );
};
