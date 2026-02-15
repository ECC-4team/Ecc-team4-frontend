import { Outlet, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import logoImg from '../../assets/logo.png';
import { logoutUser } from '../../services/login';

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (!window.confirm('로그아웃 하시겠습니까?')) return;

    try {
      const res = await logoutUser();
      if (res.data.success) {
        alert(res.data.data || '로그아웃 되었습니다.');
      }
    } catch (err) {
      console.error('로그아웃 세션 만료 혹은 서버 오류:', err);
    } finally {
      localStorage.removeItem('accessToken'); // 토큰 삭제
      navigate('/', { replace: true }); // 로그인 페이지로 이동
    }
  };

  const Wrapper = styled.div`
    min-height: 100vh;
    width: 100%;
    background-color: #f1f7ff;
    display: flex;
    flex-direction: column;
  `;

  const Header = styled.header`
    height: 96px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
  `;

  const SiteName = styled.div`
    font-size: 30px;
    font-weight: 700;
    color: #111827;
    letter-spacing: -1px;
  `;

  const Brand = styled.div`
    display: flex;
    align-items: center;
    gap: 13px;
    cursor: pointer;
  `;

  const Logo = styled.img`
    height: 30px;
    width: auto;
    object-fit: contain;
  `;

  const LogoutButton = styled.button`
    background: none;
    border: none;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: #374151;
    cursor: pointer;
    span {
      font-size: 16px;
      transform: translateY(-1px);
    }
    &:hover {
      opacity: 0.7;
    }
  `;

  const Content = styled.main`
    padding-top: 24px;
  `;

  return (
    <Wrapper>
      <Header>
        <Brand onClick={() => navigate('/trips')}>
          <Logo src={logoImg} alt="Project4 Logo" />
          <SiteName>Project4</SiteName>
        </Brand>

        {/* 3. 수정된 핸들러 연결 */}
        <LogoutButton onClick={handleLogout}>
          로그아웃 <span>[→</span>
        </LogoutButton>
      </Header>

      <Content>
        <Outlet />
      </Content>
    </Wrapper>
  );
}
