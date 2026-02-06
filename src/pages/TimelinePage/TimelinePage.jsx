/*import { useParams } from 'react-router-dom';

function TimelinePage() {
  const { tripId } = useParams();

  return (
    <div>
      <h1>{tripId} 여행 일정</h1>
      <p>Day 1</p>
      <p>Day 2</p>
    </div>
  );
}

export default TimelinePage;*/

import { useNavigate } from 'react-router-dom';

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
  MemoImageBox,
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

  return (
    <>
      <h1>MY TIMELINE</h1>
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
            <DayBlock key={index}>
              <DayHeader>
                <DateText>
                  {day.date}
                  <DayLabel>({day.dayLabel})</DayLabel>
                </DateText>

                <Card padding="12px 16px" radius="12px">
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
                        <FixedCardInner width={320}>
                          <Title>{item.title}</Title>
                          <Description>{item.description}</Description>
                        </FixedCardInner>
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
              <MemoImageBox>이미지</MemoImageBox>
              <TextArea
                placeholder="오늘의 날씨, 할 일, 컨디션, 생각 등을 자유롭게 기록해 주세요"
                rows={8}
              />
            </Card>

            <Card padding="16px" radius="12px">
              <Title>예산 / 실지출</Title>
              <Description>간단한 가계부 작성 기능</Description>
            </Card>

            <Card padding="16px" radius="12px">
              <BudgetItem>
                <BudgetLabel>예산</BudgetLabel>
                <Input placeholder="0" />
                <Won>원</Won>
              </BudgetItem>

              <BudgetItem style={{ marginTop: '12px' }}>
                <BudgetLabel>지출</BudgetLabel>
                <Input placeholder="0" />
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
