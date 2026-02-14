import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createTrip,
  getTripDetail,
  updateTrip,
} from '../../services/trip-main';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Input from '../../components/Input';
import Tab from '../../components/Tab';
import Button from '../../components/Button';
import TextArea from '../../components/TextArea';

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

const parseLocalDate = (dateString) => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatDateToLocal = (date) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function TripCreatePage() {
  const navigate = useNavigate();
  const { tripId } = useParams();

  const [form, setForm] = useState({
    title: '',
    destination: '',
    type: 'domestic',
    memo: '',
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openPicker, setOpenPicker] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = Boolean(tripId);

  // 상세보기 / 수정 모드일 때 데이터 불러오기
  useEffect(() => {
    if (!isEditMode) return;

    const fetchTrip = async () => {
      try {
        setIsLoading(true);
        const res = await getTripDetail(tripId);
        const data = res.data;

        setForm({
          title: data.title || '',
          destination: data.destination || '',
          type: data.isDomestic ? 'domestic' : 'overseas',
          memo: data.description || '',
        });

        setStartDate(data.startDate ? parseLocalDate(data.startDate) : null);
        setEndDate(data.endDate ? parseLocalDate(data.endDate) : null);
        setImagePreview(data.imageUrl || null);
      } catch {
        alert('여행 정보를 불러오는데 실패했습니다');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrip();
  }, [tripId, isEditMode]);

  /* 입력 핸들러 */
  const handleChange = (key) => (e) =>
    setForm({ ...form, [key]: e.target.value });
  const handleTypeChange = (index) =>
    setForm({ ...form, type: TRAVEL_TYPE_MAP[index] });

  /* 날짜 선택 */
  const handleStartClick = () => setOpenPicker('start');
  const handleEndClick = () => setOpenPicker('end');

  /* 이미지 업로드 */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setImageFile(file);
  };

  /* 저장 / 생성 / 수정 */
  const handleSave = async () => {
    if (!form.title || !form.destination || !startDate || !endDate) {
      alert('필수 항목을 입력해주세요');
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('destination', form.destination);
      formData.append('isDomestic', form.type === 'domestic');
      formData.append('startDate', startDate.toISOString().split('T')[0]);
      formData.append('endDate', endDate.toISOString().split('T')[0]);
      formData.append('description', form.memo);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (isEditMode) {
        await updateTrip(tripId, formData);
        alert('여행 정보가 수정되었습니다');
      } else {
        await createTrip(formData);
        alert('여행이 생성되었습니다');
      }

      navigate('/trips');
    } catch {
      alert('저장에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
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
                selectedIndex={form.type === 'domestic' ? 0 : 1}
                onChange={handleTypeChange}
              />
            </TabContainer>
          </Row>

          <Row>
            <Label>기간</Label>
            <DatePickerWrapper>
              <div className="input-row">
                <input
                  value={formatDateToLocal(startDate)}
                  placeholder="시작일"
                  readOnly
                  onClick={handleStartClick}
                />

                <input
                  value={formatDateToLocal(endDate)}
                  placeholder="종료일"
                  readOnly
                  onClick={handleEndClick}
                />
              </div>

              {openPicker === 'start' && (
                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    setOpenPicker(null);
                  }}
                  dateFormat="yyyy-MM-dd"
                  inline
                />
              )}
              {openPicker === 'end' && (
                <DatePicker
                  selected={endDate}
                  onChange={(date) => {
                    setEndDate(date);
                    setOpenPicker(null);
                  }}
                  dateFormat="yyyy-MM-dd"
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
        <Button onClick={handleSave} disabled={isLoading}>
          {isEditMode ? '수정 저장' : '새 여행 추가'}
        </Button>
      </FloatingButtonWrapper>
    </PageWrapper>
  );
}
