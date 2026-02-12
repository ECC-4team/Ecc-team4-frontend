import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Input from '../../components/Input';
import Tab from '../../components/Tab';
import Button from '../../components/Button';
import TextArea from '../../components/TextArea';
import logoImg from '../../assets/logo.png';

import {
  PageWrapper,
  FormContainer,
  Form,
  Row,
  Label,
  TabContainer,
  DatePickerWrapper,
  ImageUploadWrapper,
  FloatingButtonWrapper,
} from './TripCreatePage.styles';

const TRAVEL_TYPE_MAP = ['domestic', 'overseas'];

export default function TripCreatePage() {
  const [form, setForm] = useState({
    title: '',
    destination: '',
    type: 'domestic',
    period: '',
    memo: '',
  });

  const navigate = useNavigate();

  const handleSave = () => {
    const formData = new FormData();
    if (imageFile) {
      formData.append('image', imageFile);
    } else {
      formData.append('imageUrl', logoImg);
    }
    const newTripId = '1'; // API가 반환하는 ID 넣기
    navigate(`/trips/${newTripId}/places`);
  };

  /*셀렉트*/
  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleTypeChange = (index) => {
    setForm({
      ...form,
      type: TRAVEL_TYPE_MAP[index],
    });
  };

  /*캘린더*/
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openPicker, setOpenPicker] = useState(null);

  const handleStartClick = () => setOpenPicker('start');
  const handleEndClick = () => setOpenPicker('end');

  const handleSelectStart = (date) => {
    setStartDate(date);
    setOpenPicker(null);
  };

  const handleSelectEnd = (date) => {
    setEndDate(date);
    setOpenPicker(null);
  };

  /*이미지*/
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  return (
    <PageWrapper>
      <FormContainer>
        <Form>
          <Row>
            <Label>여행명</Label>
            <Input
              value={form.title}
              onChange={handleChange('title')}
              placeholder="여행 이름"
            />
          </Row>

          <Row>
            <Label>여행지</Label>
            <Input
              value={form.destination}
              onChange={handleChange('destination')}
              placeholder="여행지"
            />
          </Row>

          <Row alignTop>
            <Label>구분</Label>
            <TabContainer>
              <Tab
                tabs={['국내', '해외']}
                defaultIndex={0}
                onChange={handleTypeChange}
              />
            </TabContainer>
          </Row>

          <Row>
            <Label>기간</Label>
            <DatePickerWrapper>
              <div className="input-row">
                <input
                  value={startDate ? startDate.toLocaleDateString() : ''}
                  placeholder="시작일"
                  readOnly
                  onClick={handleStartClick}
                />

                <input
                  value={endDate ? endDate.toLocaleDateString() : ''}
                  placeholder="종료일"
                  readOnly
                  onClick={handleEndClick}
                />
              </div>

              {openPicker === 'start' && (
                <DatePicker
                  selected={startDate}
                  onChange={handleSelectStart}
                  inline
                />
              )}
              {openPicker === 'end' && (
                <DatePicker
                  selected={endDate}
                  onChange={handleSelectEnd}
                  inline
                />
              )}
            </DatePickerWrapper>
          </Row>

          <Row alignTop>
            <Label>대표 이미지</Label>
            <div style={{ flex: 1 }}>
              <ImageUploadWrapper>
                {imagePreview ? (
                  <img src={imagePreview} alt="대표 이미지 미리보기" />
                ) : (
                  <div className="placeholder">이미지를 선택해주세요</div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </ImageUploadWrapper>
            </div>
          </Row>

          <Row alignTop>
            <Label>메모</Label>
            <div style={{ flex: 1 }}>
              <TextArea
                value={form.memo}
                onChange={handleChange('memo')}
                placeholder="여행 메모"
              />
            </div>
          </Row>
        </Form>{' '}
      </FormContainer>

      <FloatingButtonWrapper>
        <Button onClick={handleSave}>새 여행 추가</Button>
      </FloatingButtonWrapper>
    </PageWrapper>
  );
}
