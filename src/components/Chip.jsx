import styled from '@emotion/styled';

export default function Chip({ label, onClick, onClose, padding, radius, selected = false}) {

  return (
    <ChipWrapper
      padding={padding}
      radius={radius}
      selected={selected}
      onClick={onClick}
    >
      <ChipLabel>{label}</ChipLabel>
      {onClose && (
        <ChipClose
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          ×
        </ChipClose>
      )}
    </ChipWrapper>
  );
}

const ChipWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  padding: ${({ padding = '6px 12px' }) => padding};
  border-radius: ${({ radius = '16px' }) => radius};

  background-color: ${({ selected }) => selected ? 'white' : 'transparent'};

  color: ${({ selected }) => (selected ? '#111827' : '#6b7280')};
  font-size: 14px;
  font-weight: ${({ selected }) => (selected ? 600 : 500)};

  cursor: pointer;
  margin: 4px;
  user-select: none;

  &:hover {
    background-color: white;
  }
`;

const ChipLabel = styled.span`
  margin-right: 8px;
`;

const ChipClose = styled.span`
  font-weight: bold;
  cursor: pointer;
`;
