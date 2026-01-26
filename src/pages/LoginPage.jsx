import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>로그인</h1>
      <button onClick={() => navigate('/trips')}>로그인</button>
    </div>
  );
}

export default LoginPage;
