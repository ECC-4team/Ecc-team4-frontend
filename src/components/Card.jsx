/**
 * 카드 형태 공통 컴포넌트
 * - 리스트 페이지에서 반복 사용
 * - 내부 구조는 children으로 위임
 */
export default function Card({ children, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      {children}
    </div>
  );
}
