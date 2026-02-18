import styled from '@emotion/styled';
import { useState } from 'react';

export default function Tab({
  tabs = ['Tab1', 'Tab2'],
  onChange,
  defaultIndex = 0,
  selectedIndex,
}) {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);

  const activeIndex =
    selectedIndex !== undefined ? selectedIndex : internalIndex;

  const handleClick = (index) => {
    if (selectedIndex === undefined) {
      setInternalIndex(index);
    }

    if (onChange) onChange(index);
  };

  return (
    <TabWrapper>
      {tabs.map((tab, index) => (
        <TabButton
          key={index}
          active={index === activeIndex}
          onClick={() => handleClick(index)}
        >
          {tab}
        </TabButton>
      ))}
    </TabWrapper>
  );
}

const TabWrapper = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 12px 0;
  background: ${({ active }) => (active ? '#2563eb' : 'white')};
  color: ${({ active }) => (active ? 'white' : '#374151')};
  border: none;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: ${({ active }) => (active ? '#2563eb' : '#f3f4f6')};
  }
`;
