import { notification as antNotification } from 'antd';

const notification = ({
  type,
  message,
  description,
  placement = 'bottomRight',
  ...rest
}) => {
  antNotification[type]({
    message,
    description,
    placement,
    ...rest,
  });
};

export default notification;