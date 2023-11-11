import { useState, useEffect } from "react";
import { fetchPermVotar } from "services/ducks/MtnComite.ducks";
import { message } from "antd";
export default function usePermVotar() {
  const [permVotacao, setPermVotacao] = useState(null);

  useEffect((onBefore = null, onAfter = null) => {
    if (onBefore && typeof onBefore === "function") {
      onBefore();
    }
    fetchPermVotar()
      .then((perm) => {
        setPermVotacao(perm);
      })
      .catch((error) => {
        message.error(error);
      })
      .then(() => {
        if (onBefore && typeof onBefore === "function") {
          onAfter();
        }
      });
  }, []);

  return permVotacao;
}
