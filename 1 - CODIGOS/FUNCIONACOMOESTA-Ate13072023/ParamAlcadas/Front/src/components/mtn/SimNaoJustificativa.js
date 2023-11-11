import React, { useState, useEffect } from "react";
import { Input, Radio } from "antd";

const SimNaoJustificativa = (props) => {
  const [mostraJustificativa, setMostraJustificativa] = useState(false);

  useEffect( () => {
    if ( props.defaultValue && props.defaultValue !== "SIM") {
      setMostraJustificativa(true);
    }
  }, [props.defaultValue]);

  let defaultValue = "";

  if(props.defaultValue &&  props.defaultValue === "SIM"){
    defaultValue = "SIM";
  }

  if(props.defaultValue && props.defaultValue !== "SIM"){
    defaultValue = "NAO"
  }



  return (
    <>
      <Radio.Group
        defaultValue={ defaultValue}
        disabled={props.disabled}
        onChange={(evt) => {
          const { value } = evt.target;
          if (value === "SIM") {
            props.onChange(value);
          }
        }}
        buttonStyle="solid"
      >
        <Radio.Button value="SIM" onClick={() => setMostraJustificativa(false)}>
          Sim
        </Radio.Button>
        <Radio.Button
          value="NAO"
          onClick={() => {
            props.onChange("");
            setMostraJustificativa(true);
          }}
        >
          Não
        </Radio.Button>
      </Radio.Group>
      {mostraJustificativa && (
        <Input
          disabled={props.disabled}
          defaultValue={props.defaultValue}
          style={{ marginTop: 20 }}
          onBlur={(evt) => props.onChange(evt.target.value)}
          placeholder="Justificativa"
        />
      )}
    </>
  );
};

export default SimNaoJustificativa;
