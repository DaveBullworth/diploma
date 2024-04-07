import { Modal as AntModal } from 'antd';

const Modal = ({ type, title, content, onOk, okButtonProps }) => {
  const renderModal = () => {
    switch (type) {
      case 'info':
        return AntModal.info({
          title,
          content,
          onOk,
          okButtonProps
        });
      case 'confirm':
        return AntModal.confirm({
          title,
          content,
          onOk,
          okButtonProps
        });
      default:
        return null;
    }
  };
  return renderModal();
};

export default Modal;