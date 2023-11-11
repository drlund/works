import { Switch, Tooltip } from 'antd';
import 'antd/dist/antd.css';
import React, { useEffect, useState } from 'react';
import {
  fetchCanaisAtivosInativosBySeguidor,
  switchSeguirCanal,
} from '../apiCalls/apiPodcasts';

/**
 * @typedef {Podcasts.Episodio} EpisodioRecord
 */

/**
 * @typedef {Podcasts.Seguidor} Seguidor
 */

function SeguirCanal({ canal }) {
  const [statusSeguidor, setStatusSeguidor] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchCanaisAtivosInativosBySeguidor()
      .then((res) => {
        const test = res.find((e) => e.idCanal === canal.id && e.ativo);
        if (test) {
          setStatusSeguidor(false);
        } else {
          setStatusSeguidor(true);
        }
      })
      .catch((error) => {
        console.error(error.response.data);
      })
      .finally(() => setLoading(false));
  }, [canal]);

  const updateStatusSeguidor = async () => {
    const newStatus = await switchSeguirCanal(canal.id);

    setStatusSeguidor(!statusSeguidor);
  };

  const handleSwitchChange = (checked) => {
    updateStatusSeguidor(checked);
  };

  return (
    <div>
      <Tooltip title="Seguir Canal">
        <Switch
          checkedChildren="Seguir" unCheckedChildren="Seguindo" checked={statusSeguidor} onChange={handleSwitchChange}
        />
      </Tooltip>
    </div>
  );
}

export default SeguirCanal;
