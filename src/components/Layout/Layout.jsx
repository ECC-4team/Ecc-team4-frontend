/**
 * 공통 Layout 컴포넌트
 *
 * 사용 위치
 * - React Router의 최상위 레이아웃 Route
 * 예시
 * <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="places" element={<PlaceList />} />
  </Route>
 */

import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
