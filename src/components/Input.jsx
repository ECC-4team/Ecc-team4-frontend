/**
 * 공통 Input 컴포넌트
 *
 * props:
 * - label: input 위에 표시될 라벨
 * - value: input 값 (controlled component)
 * - onChange: 값 변경 핸들러
 * - placeholder: placeholder 텍스트
 * - type: input 타입 (text, password, email 등)
 * - error: 에러 메시지 (없으면 렌더링 안 함)
 *
 * 사용 예시:
 * <Input
    label="장소 이름"
    placeholder="장소를 입력하세요"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
 */

export default function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
}) {
  return (
    <div className="input-wrapper">
      {label && <label>{label}</label>}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      {error && <span className="error">{error}</span>}
    </div>
  );
}
