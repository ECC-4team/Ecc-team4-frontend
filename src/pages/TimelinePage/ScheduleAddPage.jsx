import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Card from '../../components/Card';
import Select from '../../components/Select';
import TextArea from '../../components/TextArea';
import Button from '../../components/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Chip from '../../components/Chip';

import { PageWrapper, Label, Row, ChipRow } from './ScheduleAddPage.styles';

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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [memo, setMemo] = useState('');

  const handleSave = () => {
    navigate(-1);
  };

  return (
    <PageWrapper>
      <Card>
        <Row>
          <Label>장소</Label>
          <Select
            options={MOCK_PLACES}
            value={selectedPlace}
            onChange={(e) => setSelectedPlace(e.target.value)}
            width="100%"
          />
        </Row>

        <Row>
          <Label>날짜</Label>
          <DatePicker
            selected={selectedDate}
            onChange={setSelectedDate}
            dateFormat="yyyy.MM.dd"
          />

          <Label>시간</Label>
          <DatePicker
            selected={selectedDate}
            onChange={setSelectedDate}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30}
            dateFormat="HH:mm"
          />
        </Row>

        <Row>
          <Label>카테고리</Label>
          <ChipRow>
            {CATEGORY_OPTIONS.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                onClick={() => setSelectedCategory(cat)}
                selected={selectedCategory === cat}
                padding="4px 12px"
                radius="16px"
              />
            ))}
          </ChipRow>
        </Row>

        <Row>
          <Label>메모</Label>
          <TextArea
            rows={4}
            placeholder="메모를 입력하세요"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            style={{ flex: 1 }}
          />
        </Row>
      </Card>

      <div style={{ display: 'flex', gap: '8px' }}>
        <Button onClick={handleSave}>추가하기</Button>
        <Button onClick={() => navigate(-1)}>취소</Button>
      </div>
    </PageWrapper>
  );
}
