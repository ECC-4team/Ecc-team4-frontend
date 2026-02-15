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
  '기타',
];

const CATEGORY_COLORS = [
  '#EF4444',
  '#F97316',
  '#2DD4BF',
  '#22C55E',
  '#A855F7',
  '#FACC15',
  '#636363',
];

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
        const options = Array.isArray(res.data)
          ? res.data.map((place) => ({
              value: place.placeId,
              label: place.name,
            }))
          : [];
        setPlaces(options);
      } catch {
        alert('실패');
      }
    };

    fetchPlaces();
  }, [tripIdNum]);

  useEffect(() => {
    if (!selectedPlace) {
      setPlaceDetail(null);
      return;
    }

    const fetchPlaceDetail = async () => {
      try {
        const res = await getPlaceDetail(tripIdNum, selectedPlace);
        setPlaceDetail(res.data);
      } catch {
        alert('실패');
      }
    };

    fetchPlaceDetail();
  }, [selectedPlace, tripIdNum]);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchTimelineDetail = async () => {
      try {
        const res = await getTripTimeline(tripIdNum);

        const allItems = res.data.days.flatMap((day) =>
          day.items.map((item) => ({
            ...item,
            dayDate: day.dayDate,
          })),
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
    };

    fetchTimelineDetail();
  }, [isEditMode, tripIdNum, timelineIdNum]);

  const handleSave = async () => {
    if (!startTime || !endTime || !selectedPlace) return;

    setLoading(true);

    try {
      const timelineData = {
        dayDate: selectedDate.toISOString().slice(0, 10),
        startTime: startTime.toTimeString().slice(0, 5),
        endTime: endTime.toTimeString().slice(0, 5),
        placeId: selectedPlace,
      };

      if (isEditMode) {
        await updateTimelineItem(tripIdNum, timelineIdNum, timelineData);

        alert('수정 완료');
      } else {
        await addTimelineItem(tripIdNum, timelineData);

        alert('추가 완료');
      }

      navigate(-1);
    } catch {
      alert('실패');
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
            <Select
              options={places}
              value={places.find((p) => p.value === selectedPlace)}
              onChange={(selectedOption) =>
                setSelectedPlace(selectedOption?.value || null)
              }
              style={{ flex: 1 }}
            />
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
                const isSelected = placeDetail?.category === cat;
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
