import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock } from 'react-icons/fi';

import {
  Container,
  Header,
  Logo,
  Card,
  TabWrapper,
  InputSection,
  InputGroup,
  InputWrapper,
  ErrorMessage
} from './LoginPage.styles';

import Button from '../../components/Button';
import Chip from '../../components/Chip';
import logoImg from '../../assets/logo.png';

function LoginPage() {
  const navigate = useNavigate();
  const [isLoginTab, setIsLoginTab] = useState(true);

  const [form, setForm] = useState({
    id: '',
    password: '',
    passwordConfirm: '',
  });

  const [error, setError] = useState({
    id: '',
    password: '',
    passwordConfirm: '',
  });

  useEffect(() => {
    setForm({ id: '', password: '', passwordConfirm: '' });
    setError({ id: '', password: '', passwordConfirm: '' });
  }, [isLoginTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (value !== '') {
      setError({ ...error, [name]: '' });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    if (value === '') {
      setError((prev) => ({ ...prev, [name]: '필수 입력 항목입니다.' }));
      return;
    }

    if (name === 'password' || name === 'passwordConfirm') {
      if (value.length < 8) {
        setError((prev) => ({ ...prev, [name]: '비밀번호는 8자 이상이어야 합니다.' }));
      } 
      else if (!isLoginTab && name === 'passwordConfirm' && value !== form.password) {
        setError((prev) => ({ ...prev, [name]: '비밀번호가 일치하지 않습니다.' }));
      }
      else {
        setError((prev) => ({ ...prev, [name]: '' }));
      }
    } else {
      setError((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const isButtonDisabled = isLoginTab 
    ? (form.id === '' || form.password === '' || error.id !== '' || error.password !== '') 
    : (form.id === '' || form.password === '' || form.passwordConfirm === '' || 
       error.id !== '' || error.password !== '' || error.passwordConfirm !== '');

  return (
    <Container>
      <Header>
        <Logo><img src={logoImg} alt="logo" /></Logo>
        <h1 style={{ fontSize: '24px', margin: '0 0 8px' }}>Project4</h1>
        <p style={{ color: '#6b7280', margin: 0 }}>내 손 안의 여행</p>
      </Header>

      <Card>
        <TabWrapper>
          <Chip label="로그인" selected={isLoginTab} onClick={() => setIsLoginTab(true)} padding="8px 45px" radius="50px" />
          <Chip label="회원가입" selected={!isLoginTab} onClick={() => setIsLoginTab(false)} padding="8px 45px" radius="50px" />
        </TabWrapper>

        <InputSection>
          <InputGroup>
            <label>아이디</label>
            <InputWrapper isError={!!error.id}>
              <FiUser className="input-icon" />
              <input name="id" type="text" placeholder="아이디를 입력하세요" value={form.id} onChange={handleInputChange} onBlur={handleBlur} />
            </InputWrapper>
            {error.id && <ErrorMessage>{error.id}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <label>비밀번호</label>
            <InputWrapper isError={!!error.password}>
              <FiLock className="input-icon" />
              <input name="password" type="password" placeholder="비밀번호를 입력하세요 (8자 이상)" value={form.password} onChange={handleInputChange} onBlur={handleBlur} />
            </InputWrapper>
            {error.password && <ErrorMessage>{error.password}</ErrorMessage>}
          </InputGroup>

          {!isLoginTab && (
            <InputGroup>
              <label>비밀번호 확인</label>
              <InputWrapper isError={!!error.passwordConfirm}>
                <FiLock className="input-icon" />
                <input name="passwordConfirm" type="password" placeholder="비밀번호를 다시 입력하세요" value={form.passwordConfirm} onChange={handleInputChange} onBlur={handleBlur} />
              </InputWrapper>
              {error.passwordConfirm && <ErrorMessage>{error.passwordConfirm}</ErrorMessage>}
            </InputGroup>
          )}
        </InputSection>

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '20px' }}>
          <Button
            bg="#2563eb"
            width="100%"
            padding="14px 0"
            radius="12px"
            disabled={isButtonDisabled}
            onClick={() => navigate('/trips')}
            style={{ fontWeight: 'bold' }}
          >
            {isLoginTab ? '로그인' : '회원가입'}
          </Button>
        </div>
      </Card>
    </Container>
  );
}

export default LoginPage;