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
  return `${h}:${m}`; // HH:mm 형식
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

  // 메모(장소 설명) 상태 관리
  const [memo, setMemo] = useState('');

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
      } catch (err) {
        console.error('장소 목록 로딩 실패:', err);
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
          
          // 수정 모드일 때 기존 데이터에서 설명 로드
          setMemo(item.description || item.memo || item.content || '');
        } catch (err) {
          console.error('일정 조회 실패:', err);
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
      // 새 일정 추가 모드이고 메모가 비어있을 때만 기본 설명 채우기
      if (!isEditMode && !memo) setMemo(foundPlace.description || '');
      return;
    }

    const fetchPlaceDetail = async () => {
      try {
        const res = await getPlaceDetail(tripIdNum, selectedPlace);
        setPlaceDetail(res.data);
        if (!isEditMode && !memo) setMemo(res.data.description || '');
      } catch (err) {
        console.error('장소 상세 정보 불러오기 실패:', err);
      }
    };

    fetchPlaceDetail();
  }, [selectedPlace, places, tripIdNum, isEditMode]);

  const handleSave = async () => {
    if (!selectedPlace) {
      alert('장소를 선택해주세요.');
      return;
    }

    if (!startTime || !endTime || !selectedDate) {
      alert('필수 입력 항목을 확인해주세요.');
      return;
    }

    if (endTime <= startTime) {
      alert('종료 시간은 시작 시간보다 이후여야 합니다.');
      return;
    }

    setLoading(true);

    try {
      // 서버에서 요구할 수 있는 다양한 필드명을 모두 대응하여 객체 생성
      const timelineData = {
        dayDate: selectedDate.toISOString().slice(0, 10),
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
        placeId: Number(selectedPlace),
        description: memo || '', // TimelinePage에서 주로 사용하는 필드
        memo: memo || '',        // 백엔드 DB 컬럼 후보 1
        content: memo || ''      // 백엔드 DB 컬럼 후보 2
      };

      console.log('Save Request Data:', timelineData);

      if (isEditMode) {
        await updateTimelineItem(tripIdNum, timelineIdNum, timelineData);
        alert('수정이 완료되었습니다.');
      } else {
        await addTimelineItem(tripIdNum, timelineData);
        alert('추가가 완료되었습니다.');
      }

      navigate(-1);
    } catch (error) {
      // 에러 발생 시 콘솔에 상세 내용을 찍어 원인 파악을 도움
      console.error('Save Error Response:', error.response?.data);
      console.error('Save Error Message:', error.message);
      alert('일정 저장 중 오류가 발생했습니다. 개발자 도구 콘솔을 확인해주세요.');
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
                options={places}
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
                      cursor: 'default',
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
                placeholder="장소 설명을 입력하세요"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
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
