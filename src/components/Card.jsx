import styled from '@emotion/styled';

export default function Card({ children, padding, radius }) {
  return (
    <StyledCard padding={padding} radius={radius}>
      {children}
    </StyledCard>
  );
}

const StyledCard = styled.div`
  padding: ${({ padding = '16px' }) => padding};
  border: 1px solid #e5e7eb;
  border-radius: ${({ radius = '8px' }) => radius};
  background: white;
`;
