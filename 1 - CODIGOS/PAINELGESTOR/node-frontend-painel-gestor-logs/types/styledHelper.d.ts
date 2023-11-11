/**
 * Helper para typar styled-components com props no JSDOC.
 *
 * O que achei, apontava para o uso no JSDoc desta maneira, o que não seria ideal.
 */
// o segundo argumento aparentemente seria theme, já injetado automaticamente
type TypedStyled<TComponent, TProps> = import('styled-components').ThemedStyledFunction<TComponent, any, TProps>;
