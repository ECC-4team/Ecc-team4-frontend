import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  getTripTimeline,
  addTimelineItem,
  updateTimelineItem,
} from '../../services/timeline';
import { getPlaces, getPlaceDetail } from '../../services/places';

import Card from '../../components/Card';
import Select from '../../components/Select';
import TextArea from '../../components/TextArea';
import Button from '../../components/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import {
  PageWrapper,
  CardWrapper,
  Label,
  Row,
  ChipRow,
  DatePickerWrapper,
  TimeRangeWrapper,
  TextAreaWrapper,
} from './ScheduleAddPage.styles';

const CATEGORY_OPTIONS = [
  '관광',
  '체험',
  '쇼핑',
  '음식',
  '숙소',
  '카페/디저트',
];

const CATEGORY_COLORS = [
  '#EF4444',
  '#F97316',
  '#2DD4BF',
  '#22C55E',
  '#A855F7',
  '#FACC15',
];

const formatTime = (date) => {
  if (!date) return '';
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
};

export default function ScheduleAddPage() {
  const navigate = useNavigate();
  const { tripId, timelineId } = useParams();
  const tripIdNum = Number(tripId);
  const timelineIdNum = timelineId ? Number(timelineId) : null;
  const isEditMode = !!timelineIdNum;

  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placeDetail, setPlaceDetail] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [loading, setLoading] = useState(false);

  const isInvalidTime = startTime && endTime && endTime <= startTime;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await getPlaces(tripIdNum);
        const dataArray = Array.isArray(res.data) ? res.data : [];
        const options = dataArray.map((place) => ({
          value: place.placeId,
          label: place.name,
          category: place.category || '',
          description: place.description || '',
          coverImageUrl: place.coverImageUrl || '',
        }));
        setPlaces(options);
      } catch {
        alert('장소 목록 로딩 실패');
      }
    };
    fetchPlaces();
  }, [tripIdNum]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (isEditMode) {
        try {
          const resTimeline = await getTripTimeline(tripIdNum);
          const allItems = resTimeline.data.days.flatMap((day) =>
            day.items.map((item) => ({ ...item, dayDate: day.dayDate })),
          );
          const item = allItems.find((i) => i.timelineId === timelineIdNum);
          if (!item) return;

          setSelectedPlace(item.placeId);
          setSelectedDate(new Date(item.dayDate));
          setStartTime(new Date(`1970-01-01T${item.startTime}`));
          setEndTime(new Date(`1970-01-01T${item.endTime}`));
        } catch {
          alert('일정 조회 실패');
        }
      }
    };

    fetchInitialData();
  }, [isEditMode, tripIdNum, timelineIdNum]);

  useEffect(() => {
    if (!selectedPlace) {
      setPlaceDetail(null);
      return;
    }

    const foundPlace = places.find((p) => p.value === selectedPlace);
    if (foundPlace) {
      setPlaceDetail(foundPlace);
      return;
    }

    const fetchPlaceDetail = async () => {
      try {
        const res = await getPlaceDetail(tripIdNum, selectedPlace);
        setPlaceDetail(res.data);
      } catch {
        alert('장소 상세 정보 불러오기 실패');
      }
    };

    fetchPlaceDetail();
  }, [selectedPlace, places, tripIdNum]);

  const handleSave = async () => {
    if (!selectedPlace) {
      alert('장소를 선택해주세요.');
      return;
    }

    if (!startTime) {
      alert('시작 시간을 선택해주세요.');
      return;
    }

    if (!endTime) {
      alert('종료 시간을 선택해주세요.');
      return;
    }

    if (endTime <= startTime) {
      alert('종료 시간은 시작 시간보다 이후여야 합니다.');
      return;
    }

    if (!selectedDate) {
      alert('날짜를 선택해주세요.');
      return;
    }

    setLoading(true);

    try {
      const timelineData = {
        dayDate: selectedDate.toISOString().slice(0, 10),
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
        placeId: Number(selectedPlace),
      };

      if (isEditMode) {
        await updateTimelineItem(tripIdNum, timelineIdNum, timelineData);

        alert('수정이 완료되었습니다.');
      } else {
        await addTimelineItem(tripIdNum, timelineData);

        alert('추가가 완료되었습니다.');
      }

      navigate(-1);
    } catch {
      alert('일정 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <CardWrapper>
        <Card>
          <Row>
            <Label>장소</Label>
            <div style={{ flex: 1 }}>
              <Select
                options={[{ value: '', label: '장소 선택' }, ...places]}
                value={selectedPlace ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedPlace(val === '' ? null : Number(val));
                }}
                width="100%"
              />
            </div>
          </Row>

          <Row>
            <Label>날짜</Label>
            <DatePickerWrapper>
              <DatePicker
                selected={selectedDate}
                onChange={setSelectedDate}
                dateFormat="yyyy.MM.dd"
                popperPlacement="bottom-start"
              />
            </DatePickerWrapper>
          </Row>

          <Row>
            <Label>시간</Label>
            <TimeRangeWrapper>
              <DatePicker
                selected={startTime}
                onChange={setStartTime}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                dateFormat="HH:mm"
                placeholderText="시작"
              />

              <span className="tilde">-</span>

              <DatePicker
                selected={endTime}
                onChange={setEndTime}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                dateFormat="HH:mm"
                placeholderText="종료"
              />
            </TimeRangeWrapper>
          </Row>

          <Row alignTop>
            <Label>카테고리</Label>
            <ChipRow>
              {CATEGORY_OPTIONS.map((cat, idx) => {
                const isSelected = placeDetail?.category?.trim() === cat;
                const color = CATEGORY_COLORS[idx];

                return (
                  <div
                    key={cat}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      backgroundColor: isSelected ? color : '#F3F4F6',
                      cursor: 'pointer',
                      margin: '4px',
                      userSelect: 'none',
                      transition: 'all 0.2s',
                      color: isSelected ? '#fff' : '#111827',
                      fontWeight: 500,
                    }}
                  >
                    {cat}
                  </div>
                );
              })}
            </ChipRow>
          </Row>

          <Row alignTop>
            <Label>메모</Label>
            <TextAreaWrapper>
              <TextArea
                rows={6}
                placeholder="장소 설명"
                value={placeDetail?.description || ''}
                readOnly
                onChange={() => {}}
                style={{ flex: 1 }}
              />
            </TextAreaWrapper>
          </Row>
        </Card>
      </CardWrapper>

      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          display: 'flex',
          gap: '12px',
        }}
      >
        <Button onClick={handleSave} disabled={isInvalidTime || loading}>
          {isEditMode ? '수정하기' : '추가하기'}
        </Button>
        <Button onClick={() => navigate(-1)}>취소</Button>
      </div>
    </PageWrapper>
  );
}
