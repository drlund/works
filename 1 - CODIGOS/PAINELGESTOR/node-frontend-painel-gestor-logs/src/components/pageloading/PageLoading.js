import React from 'react';
import BBLogo from 'components/bootstraploader/BootstrapLogo';
import './PageLoading.css';

const PageLoading = (props) => (
  <div className={props.customClass ? props.customClass : "flexbox-container"}>
    <BBLogo size="50px" style={{opacity: '0.9'}} />
  </div>
);


export default PageLoading;