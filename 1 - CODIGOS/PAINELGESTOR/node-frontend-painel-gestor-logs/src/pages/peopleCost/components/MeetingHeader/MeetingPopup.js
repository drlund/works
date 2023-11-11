import { BBSpinning } from '@/components/BBSpinning/BBSpinning';
import { message } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { usePeopleCost } from '../PeopleCostContext';
import { toBRL } from '../../utils/toBRL';


/**
 * @typedef {Partial<Omit<import('../PeopleCostContext').PeopleCostContext, `set${String}`|'source'|'listas'>>} PopupMessages
 */

/**
 * @param {{
 *  window: Window,
 * }} props
 */
function PopupWrapper({ window: windowRef }) {
  const ref = useRef(/** @type {HTMLDivElement|null} */(null));
  const [values, setValues] = useState(/** @type {PopupMessages|null} */(null));

  useEffect(() => {
    windowRef.onload = () => {
      windowRef.resizeTo((ref.current?.scrollWidth || 0) + 50, (ref.current?.scrollHeight || 0) + 150);
    };
  }, []);

  useEffect(() => {

    windowRef.addEventListener('message', handleMessage);

    return () => {
      windowRef.removeEventListener('message', handleMessage);
    };
  }, []);

  /**
   * @param {MessageEvent<PopupMessages>} event
   */
  const handleMessage = (event) => {
    setValues(event.data);
  };

  const totalTimeString = (values?.maxMinutes || 0) > 60
    ? moment.utc((values?.maxMinutes || 0) * 60 * 1000).format('HH:mm:ss')
    : `${values?.maxMinutes} minutos`;
  const currentTime = moment.utc((values?.currentSeconds || 0) * 1000).format('HH:mm:ss');

  return (
    <BBSpinning spinning={!values}>
      <div
        style={{
          width: 'max-content',
          height: 'max-content',
        }}
        ref={ref}
      >
        <div style={{ fontSize: '3em', fontWeight: 'bold' }}>
          Sua reunião em andamento.
        </div>
        <div>
          <span style={{ fontSize: '9em', fontWeight: 'bolder' }}>{currentTime}</span>
          <span style={{ fontSize: '2.5em', fontWeight: 'bold' }}>/</span>
          <span style={{ fontSize: '2em' }}>{totalTimeString}</span>
        </div>
        <div>
          <span style={{ fontSize: '9em', fontWeight: 'bolder', color: 'green' }}>{toBRL(values?.currentTotal || 0)}</span>
          <span style={{ fontSize: '2.5em', fontWeight: 'bold' }}>/</span>
          <span style={{ fontSize: '2em', color: 'red' }}>{toBRL(values?.totalTempo || 0)}</span>
        </div>
      </div>
    </BBSpinning>
  );
}

export function usePopup() {
  const { currentSeconds, currentTotal, maxMinutes, totalTempo } = usePeopleCost();
  const [windowRef, setWindowRef] = useState(/** @type {Window|null} */(null));

  const openPopup = () => {
    const newWindow = window.open('', '', 'width=200,height=200');
    const div = document.createElement('div');

    if (!newWindow) {
      return message.error('Erro ao abrir popup.');
    }

    setWindowRef(newWindow);

    newWindow.document.body.appendChild(div);

    return createRoot(div)
      .render(<PopupWrapper window={newWindow} />);
  };

  const postMessages = (/** @type {PopupMessages} */ values) => {
    windowRef?.postMessage(values, '*');
  };

  useEffect(() => {
    postMessages({ currentSeconds, currentTotal, maxMinutes, totalTempo });
  }, [currentSeconds, currentTotal, maxMinutes, totalTempo]);

  return {
    openPopup,
  };
}
