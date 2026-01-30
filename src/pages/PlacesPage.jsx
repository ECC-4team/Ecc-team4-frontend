import { useParams, Link, useNavigate } from 'react-router-dom';

function PlacesPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const handleTimeline = () => {
    navigate(`/trips/${tripId}/timeline`);
  };

  return (
    <div>
      <h1>{tripId}번 여행 장소</h1>

      <ul>
        <li>
          <Link to={`/trips/${tripId}/places/1`}>장소 1</Link>
        </li>
        <li>
          <Link to={`/trips/${tripId}/places/2`}>장소 2</Link>
        </li>
      </ul>

      <button onClick={handleTimeline}>타임라인 보기</button>
    </div>
  );
}

export default PlacesPage;
