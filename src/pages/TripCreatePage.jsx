import { useNavigate } from 'react-router-dom';

function TripCreatePage() {
  const navigate = useNavigate();

  const handleSave = () => {
    const newTripId = '1'; // API가 반환하는 ID 넣기
    navigate(`/trips/${newTripId}/places`);
  };

  return (
    <div>
      <h1>여행 추가</h1>
      <input placeholder="여행 이름" />
      <br />
      <button onClick={handleSave}>저장</button>
    </div>
  );
}

export default TripCreatePage;
