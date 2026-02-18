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
  ErrorMessage,
} from './LoginPage.styles';
import Button from '../../components/Button';
import Chip from '../../components/Chip';
import logoImg from '../../assets/logo.png';
import { loginUser, signupUser } from '../../services/login';

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
    if (value !== '') setError({ ...error, [name]: '' });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!value) {
      setError((prev) => ({ ...prev, [name]: '필수 입력 항목입니다.' }));
      return;
    }

    if (name === 'id') {
      const idRegex = /^[a-z0-9]{5,20}$/;
      if (!idRegex.test(value))
        setError((prev) => ({
          ...prev,
          id: '5~20자의 영문 소문자와 숫자만 가능합니다.',
        }));
    }

    if (name === 'password') {
      const pwRegex =
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!pwRegex.test(value))
        setError((prev) => ({
          ...prev,
          password: '8자 이상, 영문, 숫자, 특수문자를 모두 포함해야 합니다.',
        }));
    }

    if (name === 'passwordConfirm') {
      if (value !== form.password) {
        setError((prev) => ({
          ...prev,
          passwordConfirm: '비밀번호가 일치하지 않습니다.',
        }));
      }
    }
  };

  const handleSubmit = async () => {
    if (!isLoginTab && form.password !== form.passwordConfirm) {
      setError((prev) => ({
        ...prev,
        passwordConfirm: '비밀번호가 일치하지 않습니다.',
      }));
      return;
    }

    try {
      const payload = { userId: form.id, password: form.password };

      if (isLoginTab) {
        const res = await loginUser(payload);

        const token = res.data?.accessToken || res.data?.data?.accessToken;

        if (token) {
          localStorage.setItem('accessToken', token);
          navigate('/trips');
        } else {
          alert('로그인에 성공했으나 토큰 정보가 없습니다.');
        }
      } else {
        const res = await signupUser(payload);
        if (res.status === 201 || res.data?.success) {
          alert('회원가입 성공! 로그인해 주세요.');
          setIsLoginTab(true);
        }
      }
    } catch (err) {
      const serverMsg =
        err.response?.data?.message || '아이디 또는 비밀번호를 확인해주세요.';
      alert(serverMsg);
    }
  };

  const isButtonDisabled = isLoginTab
    ? !form.id || !form.password || !!error.id || !!error.password
    : !form.id ||
      !form.password ||
      !form.passwordConfirm ||
      !!error.id ||
      !!error.password ||
      !!error.passwordConfirm;

  return (
    <Container>
      <Header>
        <div className="logo-area">
          <Logo src={logoImg} alt="logo" />
        </div>
        <h1>trip-diary</h1>
        <p>내 손 안의 여행</p>
      </Header>

      <Card>
        <TabWrapper>
          <Chip
            label="로그인"
            selected={isLoginTab}
            onClick={() => setIsLoginTab(true)}
            padding="8px 45px"
            radius="50px"
          />
          <Chip
            label="회원가입"
            selected={!isLoginTab}
            onClick={() => setIsLoginTab(false)}
            padding="8px 45px"
            radius="50px"
          />
        </TabWrapper>

        <InputSection>
          <InputGroup>
            <label>아이디</label>
            <InputWrapper isError={!!error.id}>
              <FiUser className="input-icon" />
              <input
                name="id"
                type="text"
                value={form.id}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="아이디를 입력하세요."
              />
            </InputWrapper>
            {error.id && <ErrorMessage>{error.id}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <label>비밀번호</label>
            <InputWrapper isError={!!error.password}>
              <FiLock className="input-icon" />
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="비밀번호를 입력하세요."
              />
            </InputWrapper>
            {error.password && <ErrorMessage>{error.password}</ErrorMessage>}
          </InputGroup>

          {!isLoginTab && (
            <InputGroup>
              <label>비밀번호 확인</label>
              <InputWrapper isError={!!error.passwordConfirm}>
                <FiLock className="input-icon" />
                <input
                  name="passwordConfirm"
                  type="password"
                  value={form.passwordConfirm}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="비밀번호를 다시 입력하세요."
                />
              </InputWrapper>
              {error.passwordConfirm && (
                <ErrorMessage>{error.passwordConfirm}</ErrorMessage>
              )}
            </InputGroup>
          )}
        </InputSection>

        <div style={{ marginTop: '20px' }}>
          <Button
            bg="#2563eb"
            width="100%"
            padding="14px 0"
            radius="12px"
            disabled={isButtonDisabled}
            onClick={handleSubmit}
          >
            {isLoginTab ? '로그인' : '회원가입'}
          </Button>
        </div>
      </Card>
    </Container>
  );
}

export default LoginPage;
