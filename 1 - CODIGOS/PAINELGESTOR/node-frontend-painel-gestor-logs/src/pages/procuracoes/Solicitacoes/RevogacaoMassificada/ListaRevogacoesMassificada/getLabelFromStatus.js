/**
 * @param {{
 *  fieldBool: boolean,
 *  fieldInfo: import('.').MatriculaTimestamp | undefined,
 *  falseBool: string,
 *  withInfoTrue: string,
 *  withInfoFalse: string,
 * }} props
 */
export const getLabelFromStatus = ({ fieldBool, fieldInfo, falseBool, withInfoTrue, withInfoFalse }) => {
  if (!fieldBool) {
    return falseBool;
  }

  if (!fieldInfo) {
    return withInfoFalse;
  }

  return withInfoTrue;
};
