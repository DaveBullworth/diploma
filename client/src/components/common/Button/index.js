import { Button as AntButton } from 'antd';

const Button = ({ text, icon, iconPosition, onClick, ...rest }) => (
  <AntButton onClick={onClick} {...rest}>
    {iconPosition === 'left' && icon}
    {text}
    {iconPosition === 'right' && icon}
    {rest.children}
  </AntButton>
);

Button.defaultProps = {
  type: 'primary',
  iconPosition: 'right',
};

export default Button;