import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock } from 'react-icons/fi';

import * as S from './LoginPage.styles';
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // 입력 중에는 에러 메시지 초기화
    if (value !== '') {
      setError({ ...error, [name]: '' });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // 1. 공통: 필수 입력 체크
    if (value === '') {
      setError((prev) => ({ ...prev, [name]: '필수 입력 항목입니다.' }));
      return;
    }

    // 2. 비밀번호 관련 유효성 검사
    if (name === 'password' || name === 'passwordConfirm') {
      // 8자 이상 체크
      if (value.length < 8) {
        setError((prev) => ({ ...prev, [name]: '비밀번호는 8자 이상이어야 합니다.' }));
      } 
      // 회원가입 탭에서 비밀번호 일치 여부 체크
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

  // 버튼 활성화 조건
  // 모든 필드가 비어있지 않아야 하며, 에러 메시지 객체의 모든 값이 빈 문자열('')이어야 함
  const isButtonDisabled = isLoginTab 
    ? (form.id === '' || form.password === '' || error.id !== '' || error.password !== '') 
    : (form.id === '' || form.password === '' || form.passwordConfirm === '' || 
       error.id !== '' || error.password !== '' || error.passwordConfirm !== '');

  return (
    <S.Container>
      <S.Header>
        <S.Logo><img src={logoImg} alt="logo" /></S.Logo>
        <h1 style={{ fontSize: '24px', margin: '0 0 8px' }}>Project4</h1>
        <p style={{ color: '#6b7280', margin: 0 }}>내 손 안의 여행</p>
      </S.Header>

      <S.Card>
        <S.TabWrapper>
          <Chip label="로그인" selected={isLoginTab} onClick={() => setIsLoginTab(true)} padding="8px 45px" radius="50px" />
          <Chip label="회원가입" selected={!isLoginTab} onClick={() => setIsLoginTab(false)} padding="8px 45px" radius="50px" />
        </S.TabWrapper>

        <S.InputSection>
          <S.InputGroup>
            <label>아이디</label>
            <S.InputWrapper isError={!!error.id}>
              <FiUser className="input-icon" />
              <input name="id" type="text" placeholder="아이디를 입력하세요" value={form.id} onChange={handleInputChange} onBlur={handleBlur} />
            </S.InputWrapper>
            {error.id && <S.ErrorMessage>{error.id}</S.ErrorMessage>}
          </S.InputGroup>

          <S.InputGroup>
            <label>비밀번호</label>
            <S.InputWrapper isError={!!error.password}>
              <FiLock className="input-icon" />
              <input name="password" type="password" placeholder="비밀번호를 입력하세요 (8자 이상)" value={form.password} onChange={handleInputChange} onBlur={handleBlur} />
            </S.InputWrapper>
            {error.password && <S.ErrorMessage>{error.password}</S.ErrorMessage>}
          </S.InputGroup>

          {!isLoginTab && (
            <S.InputGroup>
              <label>비밀번호 확인</label>
              <S.InputWrapper isError={!!error.passwordConfirm}>
                <FiLock className="input-icon" />
                <input name="passwordConfirm" type="password" placeholder="비밀번호를 다시 입력하세요" value={form.passwordConfirm} onChange={handleInputChange} onBlur={handleBlur} />
              </S.InputWrapper>
              {error.passwordConfirm && <S.ErrorMessage>{error.passwordConfirm}</S.ErrorMessage>}
            </S.InputGroup>
          )}
        </S.InputSection>

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '20px' }}>
          <Button
            bg="#2563eb"
            padding="12px 190px"
            radius="12px"
            disabled={isButtonDisabled}
            onClick={() => navigate('/trips')}
            style={{ fontWeight: 'bold', whiteSpace: 'nowrap', display: 'block' }}
          >
            {isLoginTab ? '로그인' : '회원가입'}
          </Button>
        </div>
      </S.Card>
    </S.Container>
  );
}

export default LoginPage;