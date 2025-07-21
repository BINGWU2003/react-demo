import { useUserStore } from '../../store/user';
import dayjs from 'dayjs';
const Profile = () => {
  const loginInfo = useUserStore((state) => state.loginInfo);
  return (
    <div style={{ padding: '20px' }}>
      <h2>用户资料</h2>
      <p>用户名: {loginInfo.user.name}</p>
      <p>邮箱: {loginInfo.user.email}</p>
      <p>创建时间: {dayjs(loginInfo.user.created_at).format('YYYY-MM-DD HH:mm:ss')}</p>
      <p>更新时间: {dayjs(loginInfo.user.updated_at).format('YYYY-MM-DD HH:mm:ss')}</p>
    </div>
  );
};

export default Profile; 