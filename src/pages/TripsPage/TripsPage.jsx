import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Select from '../../components/Select';
import { useState } from 'react';
import ReactPaginate from 'react-paginate';

import logoImg from '../../assets/logo.png';

import {
  PageWrapper,
  PageTitle,
  Grid,
  ClickWrapper,
  FloatingAddButton,
  CardInner,
  CardOverlay,
  Country,
  Period,
  FilterBar,
  BlueSelectWrapper,
  PaginationWrapper,
  CardActions,
  EditButton,
  DeleteButton,
} from './TripsPage.styles';

const TRAVEL_FILTER_OPTIONS = [
  { label: '새로운 여행', value: 'New' },
  { label: '다녀온 여행', value: 'Past' },
];

const MOCK_TRAVELS = [
  {
    id: 1,
    country: '대전',
    period: '24.09.07.-24.09.10.',
    status: 'New',
    imageUrl: logoImg,
  },
  {
    id: 2,
    country: '바르셀로나',
    period: '24.12.14.-24.12.19.',
    status: 'Past',
  },
  { id: 3, country: '오사카', period: '25.01.22.-25.01.25.', status: 'New' },
  { id: 4, country: '오사카', period: '25.01.22.-25.01.25.', status: 'New' },
  { id: 5, country: '오사카', period: '25.01.22.-25.01.25.', status: 'New' },
  { id: 6, country: '오사카', period: '25.01.22.-25.01.25.', status: 'New' },
  { id: 7, country: '오사카', period: '25.01.22.-25.01.25.', status: 'New' },
  { id: 8, country: '오사카', period: '25.01.22.-25.01.25.', status: 'New' },
  { id: 9, country: '오사카', period: '25.01.22.-25.01.25.', status: 'New' },
];

const ITEMS_PER_PAGE = 6;

export default function TripsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('New');
  const [currentPage, setCurrentPage] = useState(0);
  const [travels, setTravels] = useState(MOCK_TRAVELS);

  const filteredTravels = travels.filter((travel) => travel.status === filter);

  const offset = currentPage * ITEMS_PER_PAGE;
  const currentTravels = filteredTravels.slice(offset, offset + ITEMS_PER_PAGE);

  const pageCount = Math.ceil(filteredTravels.length / ITEMS_PER_PAGE);

  const handlePageClick = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const handleDelete = (id) => {
    if (!window.confirm('이 여행을 삭제할까요?')) return;

    setTravels((prev) => prev.filter((travel) => travel.id !== id));
  };

  return (
    <PageWrapper>
      <PageTitle>나의 여행</PageTitle>
      <FilterBar>
        <BlueSelectWrapper>
          <Select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(0);
            }}
            options={TRAVEL_FILTER_OPTIONS}
            width="160px"
          />
        </BlueSelectWrapper>
      </FilterBar>

      <Grid>
        {currentTravels.map((travel) => (
          <ClickWrapper
            key={travel.id}
            onClick={() => navigate(`/trips/${travel.id}/places`)}
          >
            <Card padding="0" radius="12px">
              <CardInner backgroundImage={travel.imageUrl || logoImg}>
                <CardOverlay>
                  <Country>{travel.country}</Country>
                  <Period>{travel.period}</Period>

                  <CardActions>
                    <EditButton
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/trips/${travel.id}/places`);
                      }}
                    >
                      수정
                    </EditButton>

                    <DeleteButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(travel.id);
                      }}
                    >
                      삭제
                    </DeleteButton>
                  </CardActions>
                </CardOverlay>
              </CardInner>
            </Card>
          </ClickWrapper>
        ))}
      </Grid>

      <PaginationWrapper>
        <ReactPaginate
          previousLabel={'<'}
          nextLabel={'>'}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
        />
      </PaginationWrapper>

      <FloatingAddButton onClick={() => navigate('/trips/new')}>
        +
      </FloatingAddButton>
    </PageWrapper>
  );
}
