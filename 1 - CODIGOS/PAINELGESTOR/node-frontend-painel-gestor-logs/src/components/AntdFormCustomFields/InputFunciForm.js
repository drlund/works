import React, { useState, useEffect } from "react";
import InputFunci from "components/inputsBB/InputFunci";

const InputFunciForm = (props) => {
  const { form, name } = props;
  const [funci, setFunci] = useState(null);

  useEffect(() => {
    if (form && funci) {
      form.setFieldsValue({ [name]: funci });
      setFunci(funci);
    }
  }, [funci, form, name]);

  return (
    <>
      <InputFunci
        allowClear={true}
        onChange={(dadosFunci) => setFunci(dadosFunci)}
      />
    </>
  );
};

export default InputFunciForm;
