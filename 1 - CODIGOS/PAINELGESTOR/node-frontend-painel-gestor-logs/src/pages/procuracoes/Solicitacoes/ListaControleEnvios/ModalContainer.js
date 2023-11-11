
import { FormOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import React, { useState } from 'react';

import { SpinningContext } from 'components/SpinningContext';
import { ThemedButton } from './ThemedButton';

const colors = {
  copia: '#c8c8ff',
  manifesto: '#dcb4ff',
  revogacao: '#ff8282',
};


export function useModalContainer() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  /**
   * @param {{
   *  buttonLabel: string,
   *  modalTitle: string,
   *  type: keyof colors,
   *  children: React.ReactNode,
   * }} props
   */
  const ModalContainer = ({ buttonLabel, modalTitle, type, children }) => (
    <>
      <ThemedButton
        size="large"
        type='primary'
        maincolor={colors[type] ?? ''}
        textcolor={colors[type] ? 'black' : undefined}
        icon={<FormOutlined />}
        onClick={showModal}
      >
        {buttonLabel}
      </ThemedButton>
      <Modal
        title={(
          <span style={{ fontSize: '1.2em' }}>
            {modalTitle}
          </span>
        )}
        open={isModalVisible}
        onOk={closeModal}
        onCancel={closeModal}
        width="70%"
        footer={[
          <Button
            type="primary"
            key="ok"
            onClick={closeModal}>
            Ok
          </Button>
        ]}
      >
        <SpinningContext>
          {children}
        </SpinningContext>
      </Modal>
    </>
  );

  return {
    ModalContainer,
    showModal,
    closeModal,
  };
}
