import { useParams } from 'react-router-dom';

function TimelinePage() {
  const { tripId } = useParams();

  return (
    <div>
      <h1>{tripId} 여행 일정</h1>
      <p>Day 1</p>
      <p>Day 2</p>
    </div>
  );
}

export default TimelinePage;
