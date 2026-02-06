import styled from '@emotion/styled';

/* ===== Layout ===== */
export const PageWrapper = styled.div`
  display: flex;
  gap: 32px;
  padding: 40px 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const TabWrapper = styled.div`
  margin-bottom: 16px;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TimelineSection = styled(Column)`
  flex: 2;
`;

export const SideSection = styled.div`
  flex: 1;
  display: flex;
  gap: 16px;
`;

export const SideFooter = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

/* ===== Trip Header ===== */
export const TripHeader = styled.div`
  margin-bottom: 48px;
`;

export const TripHeaderCard = styled.div`
  background-color: #111827;
  color: white;
  border-radius: 16px;
  padding: 20px 24px;
  display: inline-block;
  width: fit-content;
`;

export const TripHeaderText = styled.div`
  font-size: 17px;
  font-weight: 700;
`;

/* ===== Day Header ===== */
export const DayBlock = styled.div`
  margin-bottom: 64px;
`;

export const DayHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-left: 90px;
`;

export const DateText = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
`;

export const DayLabel = styled.span`
  font-size: 14px;
  color: #6b7280;
  margin-left: 8px;
`;

export const DayHeaderCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 220px;
`;

/* ===== Timeline ===== */
export const TimelineWrapper = styled(Column)`
  position: relative;
  gap: 40px;

  &::before {
    content: '';
    position: absolute;
    left: 90px;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: #e5e7eb;
  }
`;

export const TimelineItem = styled.div`
  display: flex;
  gap: 24px;
  position: relative;
`;

export const TimeColumn = styled.div`
  width: 80px;
  text-align: right;
  font-size: 14px;
  color: #6b7280;
  flex-shrink: 0;
`;

export const Dot = styled.div`
  position: absolute;
  left: 82px;
  top: 8px;
  width: 12px;
  height: 12px;
  background-color: #111827;
  border-radius: 50%;
`;

export const ContentRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: stretch;
`;

/* ===== Card Inner (공통 규격) ===== */
export const FixedCardInner = styled.div`
  width: ${({ width }) => width}px;
  height: 120px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
`;

/* ===== Media ===== */
export const ImageBox = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
`;

/* ===== Text ===== */
export const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Description = styled.p`
  font-size: 14px;
  color: #4b5563;
  margin: 0;
  text-align: left;
`;

/* ===== Side ===== */
export const BlueLine = styled.div`
  width: 1px;
  background-color: #3b74ee;
`;

export const SideContent = styled(Column)`
  gap: 24px;
`;

export const MemoImageBox = styled.div`
  height: 120px;
  background-color: #f3f4f6;
  border-radius: 8px;
  margin-top: 12px;

  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 14px;

  margin-bottom: 16px;
`;

/* ===== Budget ===== */
export const BudgetItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const BudgetLabel = styled.span`
  width: 40px;
  font-size: 14px;
  color: #374151;
`;

export const Won = styled.span`
  font-size: 14px;
  color: #6b7280;
`;
