import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  getTripTimeline,
  deleteTimelineItem,
  updateTripDays,
} from '../../services/timeline';
import { getPlaceDetail } from '../../services/places';

import Card from '../../components/Card';
import Input from '../../components/Input';
import TextArea from '../../components/TextArea';
import Button from '../../components/Button';

import {
  PageWrapper,
  TabWrapper,
  TabButton,
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
  const tripIdNum = Number(tripId);
  const navigate = useNavigate();

  const [daysData, setDaysData] = useState([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [tripTitle, setTripTitle] = useState('');
  const [nights, setNights] = useState(0);
  const [days, setDays] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const res = await getTripTimeline(tripIdNum);
        const apiDays = res.data.days;

        const mappedDays = await Promise.all(
          apiDays.map(async (day) => {
            const schedules = await Promise.all(
              day.items.map(async (item) => {
                let placeDetail = {};
                try {
                  const detailRes = await getPlaceDetail(
                    tripIdNum,
                    item.placeId,
                  );
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
  }, [tripIdNum]);

  const selectedDay = daysData[selectedDayIndex] || {};

  const handleDeleteSchedule = async (timelineId) => {
    try {
      await deleteTimelineItem(timelineId);

      setDaysData((prev) =>
        prev.map((day, index) => {
          if (index !== selectedDayIndex) return day;

          return {
            ...day,
            schedules: day.schedules.filter((s) => s.timelineId !== timelineId),
          };
        }),
      );
    } catch {
      alert('삭제 실패');
    }
  };

  const handleMemoChange = (e) => {
    setDaysData((prev) =>
      prev.map((day, index) =>
        index === selectedDayIndex ? { ...day, memo: e.target.value } : day,
      ),
    );
  };

  const handleBudgetChange = (field, value) => {
    setDaysData((prev) =>
      prev.map((day, index) =>
        index === selectedDayIndex
          ? {
              ...day,
              budget: {
                ...day.budget,
                [field]: value,
              },
            }
          : day,
      ),
    );
  };

  const handleSave = async () => {
    try {
      const requestData = {
        days: daysData.map((day) => ({
          dayId: day.dayId,
          themeTitle: day.theme,
          dayNote: day.memo,
          budgetPlanned: Number(day.budget.planned) || 0,
          budgetSpent: Number(day.budget.spent) || 0,
        })),
      };

      await updateTripDays(tripIdNum, requestData);

      alert('저장 완료');

      navigate('/trips');
    } catch {
      alert('저장 실패');
    }
  };

  const handleTabChange = (index) => {
    if (index === 1) {
      navigate(`/trips/${tripIdNum}/places`);
    }
  };

  return (
    <>
      <PageTitle>MY TIMELINE</PageTitle>
      <TabWrapper>
        {VIEW_TABS.map((tab, idx) => (
          <TabButton
            key={idx}
            isActive={activeTab === idx}
            onClick={() => {
              setActiveTab(idx);
              handleTabChange(idx);
            }}
          >
            {tab}
          </TabButton>
        ))}
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
                    <TextArea
                      rows={1}
                      value={selectedDay?.theme || ''}
                      placeholder="하루 테마 입력"
                      onChange={(e) =>
                        setDaysData((prev) =>
                          prev.map((day, idx) =>
                            idx === selectedDayIndex
                              ? { ...day, theme: e.target.value }
                              : day,
                          ),
                        )
                      }
                      style={{
                        width: '100%',
                        fontSize: '14px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        resize: 'none',
                        overflowY: 'auto',
                      }}
                    />
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
                              placeId={item.placeId}
                              handleDeleteSchedule={handleDeleteSchedule}
                            />
                          </div>

                          <FixedCardInner width={320}>
                            <Title>{item.title}</Title>
                            <Description>
                              {item.category
                                ? `${item.category} - ${item.description}`
                                : item.description}
                            </Description>
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
              <Button
                onClick={() => navigate(`/trips/${tripIdNum}/timeline/add`)}
              >
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

function MoreMenu({ timelineId, placeId, handleDeleteSchedule }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { tripId } = useParams();

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
          <MenuItem
            onClick={() => navigate(`/trips/${tripId}/places/${placeId}`)}
          >
            장소 보기
          </MenuItem>
          <MenuItem
            onClick={() =>
              navigate(`/trips/${tripId}/timeline/edit/${timelineId}`)
            }
          >
            일정 수정
          </MenuItem>
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
