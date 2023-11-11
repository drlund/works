/**
 * @param {{
 *  label: string,
 *  children: import('react').ReactNode,
 * }} props
 */
export function FieldWrapper({ label, children }) {
  return (
    <fieldset style={{
      border: '1px solid black',
      padding: '1em',
      marginTop: '-1.5em',
      display: 'flex',
      gap: '0.5em',
      alignItems: 'center'
    }}>
      <legend style={{
        width: 'auto',
        padding: '0 0.5em',
        margin: '0 0 -0.5em 0',
      }}>
        {label}
      </legend>
      {children}
    </fieldset>
  );
}
