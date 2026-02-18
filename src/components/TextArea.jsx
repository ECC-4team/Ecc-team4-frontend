import styled from '@emotion/styled';

export default function TextArea({
  label,
  placeholder,
  value,
  onChange,
  rows = 5,
  padding,
  radius,
  mb,
}) {
  return (
    <TextAreaWrapper mb={mb}>
      {label && <Label>{label}</Label>}
      <TextAreaField
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        padding={padding}
        radius={radius}
      />
    </TextAreaWrapper>
  );
}

const TextAreaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ mb = '16px' }) => mb};
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 4px;
  color: #374151;
`;

const TextAreaField = styled.textarea`
  padding: ${({ padding = '12px' }) => padding};
  border-radius: ${({ radius = '8px' }) => radius};
  border: 1px solid #d1d5db;
  font-size: 14px;
  outline: none;
  resize: vertical;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb;
  }
`;
