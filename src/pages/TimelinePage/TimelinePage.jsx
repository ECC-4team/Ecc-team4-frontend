import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import Card from '../../components/Card';
import Input from '../../components/Input';
import TextArea from '../../components/TextArea';
import Button from '../../components/Button';
import Tab from '../../components/Tab';

import {
  PageWrapper,
  TabWrapper,
  TimelineSection,
  SideSection,
  SideFooter,
  PageTitle,
  TripHeader,
  TripHeaderCard,
  TripHeaderText,
  DayBlock,
  DayHeader,
  DateText,
  DayLabel,
  DayHeaderCard,
  TimelineWrapper,
  TimelineItem,
  TimeColumn,
  Dot,
  ContentRow,
  FixedCardInner,
  ImageBox,
  Title,
  Description,
  BlueLine,
  SideContent,
  BudgetItem,
  BudgetLabel,
  Won,
} from './TimelinePage.styles';

const VIEW_TABS = ['일정', '장소'];

const TIMELINE_DATA = {
  tripTitle: '홍콩 여행 with 화연',
  nights: 4,
  days: 5,
  daysData: [
    {
      date: '2026.03.12',
      dayLabel: '목',
      theme: '시내 야경',
      memo: '',
      budget: { planned: '', spent: '' },
      schedules: [
        {
          time: '19:00',
          title: '침사추이',
          description: '관광명소-침사추이 시계탑',
        },
        {
          time: '20:00',
          title: '빅토리아 하버',
          description: '체험-심포니오브라이트쇼',
        },
      ],
    },
    {
      date: '2026.03.13',
      dayLabel: '금',
      theme: '시내 야경',
      memo: '',
      budget: { planned: '', spent: '' },
      schedules: [
        {
          time: '20:30',
          title: '1881 헤리티지',
          description: '쇼핑-쇼핑몰',
        },
      ],
    },
  ],
};

export default function TimelinePage() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [daysData, setDaysData] = useState(TIMELINE_DATA.daysData);

  const selectedDay = daysData[selectedDayIndex];
  const navigate = useNavigate();

  const handleSave = () => {
    // 저장 API
    navigate('/trips');
  };

  const handleTabChange = (index) => {
    if (index === 1) {
      const newTripId = '1'; // API가 반환하는 ID
      navigate(`/trips/${newTripId}/places`);
    }
  };

  const handleMemoChange = (e) => {
    const newDays = [...daysData];
    newDays[selectedDayIndex].memo = e.target.value;
    setDaysData(newDays);
  };

  const handleBudgetChange = (field, value) => {
    const newDays = [...daysData];
    newDays[selectedDayIndex].budget[field] = value;
    setDaysData(newDays);
  };

  return (
    <>
      <PageTitle>MY TIMELINE</PageTitle>
      <TabWrapper>
        <Tab tabs={VIEW_TABS} onChange={handleTabChange} defaultIndex={0} />
      </TabWrapper>

      <TripHeader>
        <TripHeaderCard>
          <TripHeaderText>
            {TIMELINE_DATA.tripTitle} | {TIMELINE_DATA.nights}박{' '}
            {TIMELINE_DATA.days}일
          </TripHeaderText>
        </TripHeaderCard>
      </TripHeader>
      <PageWrapper>
        <TimelineSection>
          {TIMELINE_DATA.daysData.map((day, index) => (
            <DayBlock key={index} onClick={() => setSelectedDayIndex(index)}>
              <DayHeader>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    boxShadow:
                      selectedDayIndex === index
                        ? '0 2px 6px rgba(0,0,0,0.15)'
                        : 'none',
                  }}
                >
                  <DateText>
                    {day.date}
                    <DayLabel>({day.dayLabel})</DayLabel>
                  </DateText>
                </div>

                <Card padding="4px 16px" radius="12px">
                  <DayHeaderCard>
                    <Title>하루 테마</Title>
                    <Description>{day.theme}</Description>
                  </DayHeaderCard>
                </Card>
              </DayHeader>

              <TimelineWrapper>
                {day.schedules.map((item, index) => (
                  <TimelineItem key={index}>
                    <TimeColumn>{item.time}</TimeColumn>
                    <Dot />

                    <ContentRow>
                      <Card padding="8px" radius="12px">
                        <FixedCardInner width={160}>
                          <ImageBox src={item.imageUrl} alt={item.title} />
                        </FixedCardInner>
                      </Card>

                      <Card padding="16px" radius="12px">
                        <div style={{ position: 'relative' }}>
                          <div
                            style={{ position: 'absolute', top: 0, right: 0 }}
                          >
                            <MoreMenu />
                          </div>

                          <FixedCardInner width={320}>
                            <Title>{item.title}</Title>
                            <Description>{item.description}</Description>
                          </FixedCardInner>
                        </div>
                      </Card>
                    </ContentRow>
                  </TimelineItem>
                ))}
              </TimelineWrapper>
            </DayBlock>
          ))}
        </TimelineSection>

        <SideSection>
          <BlueLine />

          <SideContent>
            <Card padding="16px" radius="12px">
              <Title>오늘의 메모</Title>
              <Description>오늘의 하루를 기록해보세요</Description>
            </Card>

            <Card padding="16px" radius="12px">
              <TextArea
                placeholder="날짜를 클릭해 오늘의 날씨, 할 일, 컨디션, 생각 등을 자유롭게 기록해 주세요"
                rows={8}
                value={selectedDay.memo}
                onChange={handleMemoChange}
              />
            </Card>

            <Card padding="16px" radius="12px">
              <Title>예산 / 실지출</Title>
              <Description>간단한 가계부 작성 기능</Description>
            </Card>

            <Card padding="16px" radius="12px">
              <BudgetItem>
                <BudgetLabel>예산</BudgetLabel>
                <Input
                  placeholder="0"
                  value={selectedDay.budget.planned}
                  onChange={(e) =>
                    handleBudgetChange('planned', e.target.value)
                  }
                />
                <Won>원</Won>
              </BudgetItem>

              <BudgetItem style={{ marginTop: '12px' }}>
                <BudgetLabel>지출</BudgetLabel>
                <Input
                  placeholder="0"
                  value={selectedDay.budget.spent}
                  onChange={(e) => handleBudgetChange('spent', e.target.value)}
                />
                <Won>원</Won>
              </BudgetItem>
            </Card>

            <SideFooter>
              <Button onClick={() => navigate(`/trips/timeline/add`)}>
                새 일정 추가
              </Button>

              <Button onClick={handleSave}>저장하기</Button>
            </SideFooter>
          </SideContent>
        </SideSection>
      </PageWrapper>
    </>
  );
}

function MoreMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      {/* ⋮ 버튼 */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '18px',
          cursor: 'pointer',
        }}
      >
        ⋮
      </button>

      {/* 팝업 */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '24px',
            left: '0',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 10,
            minWidth: '120px',
          }}
        >
          <MenuItem onClick={() => alert('장소 보기')}>장소 보기</MenuItem>
          <MenuItem onClick={() => alert('시간 수정')}>시간 수정</MenuItem>
          <MenuItem onClick={() => alert('내용 수정')}>내용 수정</MenuItem>
          <MenuItem danger onClick={() => alert('일정 삭제')}>
            일정 삭제
          </MenuItem>
        </div>
      )}
    </div>
  );
}

function MenuItem({ children, onClick, danger }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '8px 12px',
        fontSize: '14px',
        cursor: 'pointer',
        color: danger ? '#dc2626' : '#111827',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {children}
    </div>
  );
}
