/**
 * 공통 버튼 컴포넌트
 *
 * props:
 * - children: 버튼 안에 들어갈 텍스트 또는 아이콘
 * - variant: 버튼 스타일 타입 (primary, outline, danger 등)
 * - size: 버튼 크기 (sm, md, lg)
 * - disabled: 비활성화 여부
 * - onClick: 클릭 이벤트 핸들러
 * - type
 *
 * 사용 예시:
 * <Button size="lg" disabled>저장</Button>
 */

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`btn ${variant} ${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
