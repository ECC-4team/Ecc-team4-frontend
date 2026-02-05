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

  return (
    <S.Container>
      {/* ===== Header ===== */}
      <S.Header>
        <S.Logo>
          <img src={logoImg} alt="Project4 Logo" />
        </S.Logo>
        <h1 style={{ fontSize: '24px', margin: '0 0 8px' }}>Project4</h1>
        <p style={{ color: '#6b7280', margin: 0 }}>내 손 안의 여행</p>
      </S.Header>

      {/* ===== Card ===== */}
      <S.Card>
        <p
          style={{
            textAlign: 'center',
            fontSize: '14px',
            color: '#9ca3af',
            marginTop: '-12px',
            marginBottom: '40px',
          }}
        >
          시작하기
        </p>

        {/* ===== Tabs ===== */}
        <S.TabWrapper>
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
        </S.TabWrapper>

        {/* ===== Input Section ===== */}
        <S.InputSection>
          {isLoginTab ? (
            <>
              {/* 로그인 */}
              <S.InputGroup>
                <label>아이디</label>
                <S.InputWrapper>
                  <FiUser className="input-icon" />
                  <input type="text" placeholder="아이디를 입력하세요" />
                </S.InputWrapper>
              </S.InputGroup>

              <S.InputGroup>
                <label>비밀번호</label>
                <S.InputWrapper>
                  <FiLock className="input-icon" />
                  <input type="password" placeholder="비밀번호를 입력하세요" />
                </S.InputWrapper>
              </S.InputGroup>
            </>
          ) : (
            <>
              {/* 회원가입 */}
              <S.InputGroup>
                <label>이름</label>
                <S.InputWrapper>
                  <FiUser className="input-icon" />
                  <input type="text" placeholder="이름을 입력하세요" />
                </S.InputWrapper>
              </S.InputGroup>

              <S.InputGroup>
                <label>아이디</label>
                <S.InputWrapper>
                  <FiUser className="input-icon" />
                  <input type="text" placeholder="아이디를 입력하세요" />
                </S.InputWrapper>
              </S.InputGroup>

              <S.InputGroup>
                <label>비밀번호</label>
                <S.InputWrapper>
                  <FiLock className="input-icon" />
                  <input type="password" placeholder="비밀번호를 입력하세요 (8자 이상)" />
                </S.InputWrapper>
              </S.InputGroup>

              <S.InputGroup>
                <label>비밀번호 확인</label>
                <S.InputWrapper>
                  <FiLock className="input-icon" />
                  <input
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                  />
                </S.InputWrapper>
              </S.InputGroup>
            </>
          )}
        </S.InputSection>

        {/* ===== Action Button ===== */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '40px'}}>
          <Button
            bg="#2563eb"
            padding="12px 190px"
            radius="12px"
            onClick={() => navigate('/trips')}
            style={{fontWeight: 'bold', whiteSpace: 'nowrap', display: 'block' }}
          >
          {isLoginTab ? '로그인' : '회원가입'}
          </Button>
        </div>
      </S.Card>
    </S.Container>
  );
}

export default LoginPage;