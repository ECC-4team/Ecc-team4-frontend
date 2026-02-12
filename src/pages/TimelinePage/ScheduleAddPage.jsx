import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
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

const MOCK_PLACES = [
  { value: 1, label: '서울 시내' },
  { value: 2, label: '한강공원' },
  { value: 3, label: '명동 쇼핑' },
  { value: 4, label: '강남 카페' },
];

const CATEGORY_OPTIONS = ['관광', '체험', '쇼핑', '음식', '숙소', '디저트'];

export default function ScheduleAddPage() {
  const navigate = useNavigate();

  const [selectedPlace, setSelectedPlace] = useState('');

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [memo, setMemo] = useState('');

  const handleSave = () => {
    if (!startTime || !endTime) return;

    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);

    const endDateTime = new Date(selectedDate);
    endDateTime.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

    navigate(-1);
  };

  const isInvalidTime = startTime && endTime && endTime <= startTime;

  return (
    <PageWrapper>
      <CardWrapper>
        <Card>
          <Row>
            <Label>장소</Label>
            <Select
              options={MOCK_PLACES}
              value={selectedPlace}
              onChange={(e) => setSelectedPlace(e.target.value)}
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
                const isSelected = selectedCategory === cat;

                return (
                  <div
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
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
                placeholder="메모를 입력하세요"
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
        <Button onClick={handleSave} disabled={isInvalidTime}>
          추가하기
        </Button>
        <Button onClick={() => navigate(-1)}>취소</Button>
      </div>
    </PageWrapper>
  );
}
