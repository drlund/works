import { PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Button, InputNumber, Slider } from 'antd';
import { useEffect, useState } from 'react';
import { usePeopleCost } from '../PeopleCostContext';
import { usePopup } from './MeetingPopup';

const secToMin = 60;

export function MeetingSlider() {
  const {
    setMaxMinutes,
    maxMinutes,
    setCurrentSeconds,
    currentSeconds,
    source,
  } = usePeopleCost();
  const [play, setPlay] = useState(false);
  const { openPopup } = usePopup();

  useEffect(() => {
    const interval = setInterval(() => {
      if (play) {
        setCurrentSeconds((prev) => {
          const newValue = prev + 1;
          // se chegar no máximo, pausa
          if ((newValue / secToMin) >= maxMinutes) {
            setPlay(false);
          }
          return newValue;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [play]);

  const handlePlay = () => {
    if (!play) {
      openPopup();
    }

    // caso já esteja no máximo (default), reseta para zero
    if (!play && (currentSeconds / secToMin) >= maxMinutes) {
      setCurrentSeconds(0);
    }

    setPlay(!play);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2em', gap: '1em' }}>
      <Button
        type="primary"
        icon={play ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
        onClick={handlePlay}
        disabled={source.length === 0}
      >
        {play ? 'Pausar' : 'Começar'}
      </Button>
      <span>0</span>
      <Slider
        onChange={setCurrentSeconds}
        value={currentSeconds}
        min={0}
        max={maxMinutes * secToMin}
        style={{ width: '100%' }}
        tooltip={{
          open: currentSeconds !== (maxMinutes * secToMin) && currentSeconds !== 0,
          formatter: (time) => `${Math.floor((time || 0) / secToMin)} minutos`,
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2em' }}>
        <InputNumber
          min={10}
          step={5}
          onChange={(v) => setMaxMinutes(v || 0)}
          value={maxMinutes}
          style={{ width: '5em' }} />
        <span>
          minutos
        </span>
      </div>
    </div>
  );
}
