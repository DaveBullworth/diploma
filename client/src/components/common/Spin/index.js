import { Spin as AntSpin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './style.scss';

const Spin = (props) => (
  <div className="spin-container">
    <AntSpin
      indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      {...props}
    />
  </div>
);

export default Spin;