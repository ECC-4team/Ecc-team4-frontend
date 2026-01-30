import { useNavigate } from 'react-router-dom';

function TripsPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>내 여행</h1>

      <button onClick={() => navigate('/trips/new')}>여행 추가</button>

      <ul>
        <li onClick={() => navigate('/trips/1/places')}>제주 여행</li>
        <li onClick={() => navigate('/trips/2/places')}>부산 여행</li>
      </ul>
    </div>
  );
}

export default TripsPage;
