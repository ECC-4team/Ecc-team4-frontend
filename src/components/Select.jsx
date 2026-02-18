import styled from '@emotion/styled';

export default function Select({
  value,
  onChange,
  options = [],
  width,
  padding,
  radius,
}) {
  return (
    <StyledSelect
      value={value}
      onChange={onChange}
      width={width}
      padding={padding}
      radius={radius}
    >
      {options.map((opt, i) => (
        <option key={i} value={opt.value ?? opt}>
          {opt.label ?? opt}
        </option>
      ))}
    </StyledSelect>
  );
}

const StyledSelect = styled.select`
  width: ${({ width = '100%' }) => width};
  padding: ${({ padding = '12px 14px' }) => padding};
  border-radius: ${({ radius = '10px' }) => radius};
  border: 1px solid #d1d5db;
  font-size: 16px;
  background-color: white;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb;
  }

  option {
    font-size: 16px;
  }
`;
