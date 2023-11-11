import { SpinningContext } from '@/components/SpinningContext';
import { Button, Modal } from 'antd';
import { useCallback, useState } from 'react';

export function useModalControls() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  return {
    isModalVisible,
    showModal,
    closeModal,
  };
}

export function useModal() {
  const { closeModal, showModal, isModalVisible } = useModalControls();

  /**
   * @param {{
   *  CustomButton?: typeof Button,
   *  buttonProps?: GetProps<Button>,
   *  modalProps?: GetProps<Modal>,
   *  buttonLabel: string,
   *  modalTitle: string,
   *  children: React.ReactNode,
   * }} props
   */
  const ModalContainer = ({
    CustomButton = Button,
    buttonLabel,
    buttonProps,
    modalTitle,
    modalProps,
    children,
  }) => (
    <>
      <CustomButton
        onClick={showModal}
        {...buttonProps}
      >
        {buttonLabel}
      </CustomButton>
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
        {...modalProps}
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
