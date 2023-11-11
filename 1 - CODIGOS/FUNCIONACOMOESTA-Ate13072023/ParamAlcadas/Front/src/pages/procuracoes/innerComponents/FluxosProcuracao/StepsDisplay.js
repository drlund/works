import { Card, Steps } from 'antd';
import React from 'react';

/**
 * @typedef {import('./Fluxos').AllFluxos} AllFluxos
 */

/**
 * @param {{
 *  currentStep: number,
 *  fluxoSteps: AllFluxos[keyof AllFluxos]
 * }} props
 */
export const StepsDisplay = ({ currentStep, fluxoSteps }) => (
  <Card>
    <Steps
      current={currentStep}
      items={fluxoSteps.map(({ titulo }) => ({ title: titulo }))}
    />
  </Card>
);
