import style from './index.module.scss';

interface ContentHeaderProps {
  title: string;
  description: string;
  children: React.ReactNode;
}
const ContentHeader = ({ title, description, children }: ContentHeaderProps) => {
  return <div className={style['content-header']}>
    <div className={style['content-header-title']}>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
    <div className={style['content-header-actions']}>
      {children}
    </div>
  </div>;
};

export default ContentHeader;