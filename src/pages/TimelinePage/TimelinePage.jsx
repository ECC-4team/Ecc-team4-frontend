import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getTripTimeline, deleteTimelineItem } from '../../services/timeline';
import { getPlaceDetail } from '../../services/places';

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

// 시간/요일 포맷
const formatTime = (timeStr) => {
  if (!timeStr) return '';
  return timeStr.slice(0, 5);
};

const getDayLabel = (dateStr) => {
  const day = new Date(dateStr).getDay();
  return ['일', '월', '화', '수', '목', '금', '토'][day];
};

export default function TimelinePage() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [daysData, setDaysData] = useState([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [tripTitle, setTripTitle] = useState('');
  const [nights, setNights] = useState(0);
  const [days, setDays] = useState(0);

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const res = await getTripTimeline(tripId);
        const apiDays = res.data.days;

        const mappedDays = await Promise.all(
          apiDays.map(async (day) => {
            const schedules = await Promise.all(
              day.items.map(async (item) => {
                let placeDetail = {};
                try {
                  const detailRes = await getPlaceDetail(tripId, item.placeId);
                  placeDetail = detailRes.data;
                } catch {
                  alert('장소 상세 조회 실패');
                }

                return {
                  timelineId: item.timelineId,
                  time: formatTime(item.startTime),
                  endTime: formatTime(item.endTime),
                  title: placeDetail.name || item.placeName,
                  placeId: item.placeId,
                  description: placeDetail.description || '',
                  imageUrl: placeDetail.coverImageUrl || '',
                  category: placeDetail.category || '',
                  imageUrls: placeDetail.imageUrls || [],
                };
              }),
            );

            return {
              dayId: day.dayId,
              date: day.dayDate,
              dayLabel: getDayLabel(day.dayDate),
              theme: day.themeTitle,
              memo: day.dayNote,
              budget: { planned: day.budgetPlanned, spent: day.budgetSpent },
              schedules,
            };
          }),
        );

        setDaysData(mappedDays);
        setTripTitle(res.data.tripTitle || '여행');
        setNights(res.data.nights || 0);
        setDays(res.data.daysCount || mappedDays.length);
      } catch {
        alert('타임라인 조회 실패');
      }
    }

    fetchTimeline();
  }, [tripId]);

  const selectedDay = daysData[selectedDayIndex];

  const handleDeleteSchedule = async (timelineId) => {
    try {
      await deleteTimelineItem(timelineId);

      const newDays = [...daysData];
      newDays[selectedDayIndex].schedules = newDays[
        selectedDayIndex
      ].schedules.filter((s) => s.timelineId !== timelineId);
      setDaysData(newDays);
    } catch {
      alert('삭제 실패');
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

  const handleSave = () => {
    // 저장 API
    navigate('/trips');
  };

  const handleTabChange = (index) => {
    if (index === 1) {
      navigate(`/trips/${tripId}/places`);
    }
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
            {tripTitle} | {nights}박 {days}일
          </TripHeaderText>
        </TripHeaderCard>
      </TripHeader>
      <PageWrapper>
        <TimelineSection>
          {daysData.map((day, index) => (
            <DayBlock
              key={day.dayId}
              onClick={() => setSelectedDayIndex(index)}
            >
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
                {day.schedules.map((item) => (
                  <TimelineItem key={item.timelineId}>
                    <TimeColumn>
                      <div>{item.time}</div>
                      {item.endTime && (
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                          ~ {item.endTime}
                        </div>
                      )}
                    </TimeColumn>
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
                            <MoreMenu
                              timelineId={item.timelineId}
                              handleDeleteSchedule={handleDeleteSchedule}
                            />
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
                value={selectedDay?.memo || ''}
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
                  value={selectedDay?.budget?.planned || ''}
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
                  value={selectedDay?.budget?.spent || ''}
                  onChange={(e) => handleBudgetChange('spent', e.target.value)}
                />
                <Won>원</Won>
              </BudgetItem>
            </Card>

            <SideFooter>
              <Button onClick={() => navigate(`/trips/${tripId}/timeline/add`)}>
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

function MoreMenu({ timelineId, handleDeleteSchedule }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
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
          <MenuItem danger onClick={() => handleDeleteSchedule(timelineId)}>
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
