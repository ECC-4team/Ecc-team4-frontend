/**
 * 공통 Select 컴포넌트
 *
 * props
 * - label: 셀렉트 상단에 표시할 라벨
 * - value: 현재 선택된 값
 * - onChange: 선택 변경 핸들러
 * - options: 선택지 배열 [{ value, label }]
 * - placeholder: 기본 안내 문구 (선택 불가)
 * - error: 에러 메시지
 * - disabled: 비활성화 여부
 * 
 * 사용 예시
 * <Select
    label="여행 유형"
    placeholder="여행 유형을 선택하세요"
    value={type}
    onChange={(e) => setType(e.target.value)}
    options={[
      { value: "domestic", label: "국내 여행" },
      { value: "abroad", label: "해외 여행" },
    ]}
  />
 */

export default function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  error,
  disabled = false,
}) {
  return (
    <div>
      {label && <label>{label}</label>}

      <select value={value} onChange={onChange} disabled={disabled}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <span>{error}</span>}
    </div>
  );
}
