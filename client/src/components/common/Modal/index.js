import { Modal as AntModal } from 'antd';

const Modal = ({ type, title, content, onOk }) => {
  const renderModal = () => {
    switch (type) {
      case 'info':
        return AntModal.info({
          title,
          content,
          onOk,
        });
      case 'confirm':
        return AntModal.confirm({
          title,
          content,
          onOk,
        });
      default:
        return null;
    }
  };
  return renderModal();
};

export default Modal;