import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as S from './LoginPage.styles';
import Button from '../components/Button'; 
import Chip from '../components/Chip';     

function LoginPage() {
  const navigate = useNavigate();
  const [isLoginTab, setIsLoginTab] = useState(true);

  return (
    <S.Container>
      <S.Header>
        <S.Logo>P4</S.Logo>
        <h1 style={{ fontSize: '24px', margin: '0 0 8px' }}>Project4</h1>
        <p style={{ color: '#6b7280', margin: 0 }}>내 손 안의 여행</p>
      </S.Header>

      <S.Card>
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#9ca3af', marginBottom: '16px' }}>시작하기</p>
        
        <S.TabWrapper>
          {/* Chip의 내부 selected와 별개로, 디자인적 일관성을 위해 label과 onClick 활용 */}
          <Chip 
            label="로그인" 
            onClick={() => setIsLoginTab(true)}
            padding="8px 45px"
            radius="50px"
          />
          <Chip 
            label="회원가입" 
            onClick={() => setIsLoginTab(false)}
            padding="8px 45px"
            radius="50px"
          />
        </S.TabWrapper>

        <S.InputSection>
          {!isLoginTab && (
            <S.InputGroup>
              <label>이름</label>
              <input type="text" placeholder="이름을 입력하세요" />
            </S.InputGroup>
          )}

          <S.InputGroup>
            <label>아이디</label>
            <input type="text" placeholder="아이디를 입력하세요" />
          </S.InputGroup>

          <S.InputGroup>
            <label>비밀번호</label>
            <input type="password" placeholder="비밀번호를 입력하세요 (8자 이상)" />
          </S.InputGroup>

          {!isLoginTab && (
            <S.InputGroup>
              <label>비밀번호 확인</label>
              <input type="password" placeholder="비밀번호를 다시 입력하세요" />
            </S.InputGroup>
          )}
        </S.InputSection>

        <Button 
          bg="#2563eb" 
          padding="15px" 
          radius="12px" 
          onClick={() => navigate('/trips')}
          style={{ width: '100%', fontWeight: 'bold' }}
        >
          {isLoginTab ? '로그인' : '회원가입'}
        </Button>
      </S.Card>
    </S.Container>
  );
}

export default LoginPage;