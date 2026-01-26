import { useParams } from 'react-router-dom';

function PlaceDetailPage() {
  const { tripId, placeId } = useParams();

  return (
    <div>
      <h1>여행 {tripId}</h1>
      <h2>장소 {placeId}</h2>
      <p>상세 설명</p>
    </div>
  );
}

export default PlaceDetailPage;
