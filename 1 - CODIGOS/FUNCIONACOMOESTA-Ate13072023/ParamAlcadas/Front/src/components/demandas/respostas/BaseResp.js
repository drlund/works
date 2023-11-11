import React, { Component } from 'react';
import PropTypes from 'prop-types';

class BaseResp extends Component {
  render() {
    return (
      <div></div>
    )
  }
}

BaseResp.propTypes = {
  question: PropTypes.object.isRequired,
  response: PropTypes.object,
  errorList: PropTypes.array
}

export default BaseResp;