import style from './index.module.scss';
import { useState } from 'react';
interface ContentHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  // 可以获取子组件数据，并展示
  renderActions?: (msg: string) => React.ReactNode;
}
const ContentHeader = ({ title, description, children, renderActions }: ContentHeaderProps) => {
  const [msg] = useState('hello world 你好啊');
  return <div className={style['content-header']}>
    <div className={style['content-header-title']}>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
    {
      children && <div className={style['content-header-actions']}>{children}</div>
    }
    {
      renderActions && <div className={style['content-header-actions']}>{renderActions(msg)}</div>
    }
  </div>;
};

export default ContentHeader;