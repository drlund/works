import React from 'react';
import Icon from '@ant-design/icons';
import 'components/bootstraploader/BootstrapLogo.css';

const BBLogoSVG = () => {
  return (
    <svg className="logo" viewBox="-12 -11 114 112"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g className="logo__group">
        <path className="logo__square" strokeWidth="2" fill="none" d="M-10,-10 -10,100 100,100 100,-10z"/>
        <path className="logo__symbol" fill="none" d="m 71.18568,12.31597 9.142072,6.30318 8.946379,-6.01612 0.01628,-12.35969 -18.104734,12.07263 z M 18.321835,77.81813 9.2117252,71.56742 0,77.83019 0.09076037,89.943535 Z M 52.919628,24.35544 61.847312,30.3984 19.42483,59.28009 45.638897,77.0827 57.949441,68.68751 48.386735,62.31318 70.458089,47.42848 88.924658,59.75742 44.308851,89.682715 0.28615146,59.96607 Z M 36.208262,65.32666 27.279974,59.28462 69.702758,30.40262 43.488992,12.60002 31.178448,20.9955 40.740551,27.36923 18.669499,42.25453 0.2026278,29.9256 44.660736,0 88.798619,29.8481 z"/>
      </g>
    </svg>
  )
}

const BBLogo = props => {
  const size = props.size ? props.size : '150px';
  const style = props.style ? props.style : {};
  return <Icon component={BBLogoSVG} style={{...style, width: `${size}`, height: `${size}`}} />
}

export default BBLogo;