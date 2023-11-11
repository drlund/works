import React, { Component } from 'react';
import styles from './BootstrapLoader.module.css';
import { Progress } from 'antd';
import BootstrapLogo from './BootstrapLogo';

class BootstrapLoader extends Component {
  state = { progress: 30, handler: null };

  incrementCounter = () => {
    if (this.state.progress < 100) {
      let inc = 10 * Math.random();
      let newProgress = this.state.progress + inc;
      this.setState({ progress: newProgress});
    }
  }

  componentDidMount() {
    const handler = setInterval(this.incrementCounter, 200);
    this.setState({handler});
  }

  componentWillUnmount() {
    clearInterval(this.state.handler);
  }

  render() {
    return (
        <div className={styles.bootstrapLoader}>
          <div className={styles.progressBar}>
            <Progress
              strokeLinecap="square"
              percent={this.state.progress}
              showInfo={false}
              strokeWidth={2}
              style={{position: 'absolute', top: '0'}}
            />
          </div>
          <div className={styles.content}>
            <BootstrapLogo />
          </div>
        </div>
    )
  }
}

export default BootstrapLoader;
