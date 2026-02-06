import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage/LoginPage.jsx';
import TripsPage from './pages/TripsPage/TripsPage.jsx';
import TripCreatePage from './pages/TripCreatePage/TripCreatePage.jsx';
import PlacesPage from './pages/PlacesPage.jsx';
import PlaceDetailPage from './pages/PlaceDetailPage';
import TimelinePage from './pages/TimelinePage/TimelinePage.jsx';
import ScheduleAddPage from './pages/TimelinePage/ScheduleAddPage.jsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 */}
        <Route path="/" element={<LoginPage />} />

        {/* 메인(여행 목록) */}
        <Route path="/trips" element={<TripsPage />} />

        {/* 여행 추가 */}
        <Route path="/trips/new" element={<TripCreatePage />} />

        {/* 장소 리스트 */}
        <Route path="/trips/:tripId/places" element={<PlacesPage />} />

        {/* 장소 상세 */}
        <Route
          path="/trips/:tripId/places/:placeId"
          element={<PlaceDetailPage />}
        />

        {/* 일정 타임라인 */}
        <Route path="/trips/:tripId/timeline" element={<TimelinePage />} />

        {/* 스케쥴 추가 */}
        <Route path="/trips/timeline/add" element={<ScheduleAddPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
