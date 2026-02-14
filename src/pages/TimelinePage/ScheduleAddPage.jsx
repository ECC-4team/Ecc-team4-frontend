import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { addTimelineItem } from '../../services/timeline';
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

const CATEGORY_OPTIONS = ['관광', '체험', '쇼핑', '음식', '숙소', '디저트'];

export default function ScheduleAddPage({ tripId }) {
  const navigate = useNavigate();

  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState('');
  const [placeDetail, setPlaceDetail] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [loading, setLoading] = useState(false);

  const isInvalidTime = startTime && endTime && endTime <= startTime;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await getPlaces(tripId);
        const options = res.data.map((place) => ({
          value: place.placeId,
          label: place.name,
        }));
        setPlaces(options);
      } catch {
        alert('실패');
      }
    };

    fetchPlaces();
  }, [tripId]);

  useEffect(() => {
    if (!selectedPlace) return;

    const fetchPlaceDetail = async () => {
      try {
        const res = await getPlaceDetail(tripId, selectedPlace);
        setPlaceDetail(res.data);
      } catch {
        alert('실패');
      }
    };

    fetchPlaceDetail();
  }, [selectedPlace, tripId]);

  const handleSave = async () => {
    if (!startTime || !endTime || !selectedPlace || !placeDetail) return;

    setLoading(true);

    try {
      const timelineData = {
        dayDate: selectedDate.toISOString().slice(0, 10), // yyyy-mm-dd
        startTime: startTime.toTimeString().slice(0, 5), // HH:mm
        endTime: endTime.toTimeString().slice(0, 5), // HH:mm
        placeId: placeDetail.placeId,
        name: placeDetail.name,
        description: placeDetail.description,
        category: placeDetail.category,
        coverImageUrl: placeDetail.coverImageUrl,
        imageUrls: placeDetail.imageUrls,
      };

      await addTimelineItem(tripId, timelineData);
      navigate(-1);
    } catch {
      alert('일정 추가에 실패했습니다.');
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
                setSelectedPlace(selectedOption.value)
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
              {CATEGORY_OPTIONS.map((cat) => {
                const isSelected = placeDetail?.category === cat;

                return (
                  <div
                    key={cat}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      backgroundColor: isSelected ? '#2563EB' : '#F3F4F6',
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
          추가하기
        </Button>
        <Button onClick={() => navigate(-1)}>취소</Button>
      </div>
    </PageWrapper>
  );
}
