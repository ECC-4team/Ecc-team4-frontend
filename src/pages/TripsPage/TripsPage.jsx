import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getTrips, deleteTrip } from '../../services/trip-main';
import ReactPaginate from 'react-paginate';

import Card from '../../components/Card';
import Select from '../../components/Select';
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
  { label: '새로운 여행', value: 1 },
  { label: '다녀온 여행', value: 2 },
];

const ITEMS_PER_PAGE = 6;

const formatPeriod = (startDate, endDate) => {
  return `${startDate.replaceAll('-', '.')} - ${endDate.replaceAll('-', '.')}`;
};

export default function TripsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [filter, setFilter] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [travels, setTravels] = useState([]);

  useEffect(() => {
    getTrips()
      .then((res) => {
        setTravels(res.data);
      })
      .catch(() => {
        alert('여행 목록을 불러오지 못했어요');
      });
  }, [location.pathname]);

  const filteredTravels = travels.filter((travel) => travel.status === filter);

  const offset = currentPage * ITEMS_PER_PAGE;
  const currentTravels = filteredTravels.slice(offset, offset + ITEMS_PER_PAGE);

  const pageCount = Math.ceil(filteredTravels.length / ITEMS_PER_PAGE);

  const handlePageClick = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('이 여행을 삭제할까요?')) return;

    try {
      await deleteTrip(id);

      setTravels((prev) => prev.filter((travel) => travel.tripId !== id));
    } catch {
      alert('삭제에 실패했어요');
    }
  };

  return (
    <PageWrapper>
      <PageTitle>나의 여행</PageTitle>
      <FilterBar>
        <BlueSelectWrapper>
          <Select
            value={filter}
            onChange={(e) => {
              setFilter(Number(e.target.value));
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
            key={travel.tripId}
            onClick={() => navigate(`/trips/${travel.tripId}/places`)}
          >
            <Card padding="0" radius="12px">
              <CardInner backgroundImage={travel.imageUrl || logoImg}>
                <CardOverlay>
                  <Country>{travel.destination}</Country>
                  <Period>
                    {formatPeriod(travel.startDate, travel.endDate)}
                  </Period>

                  <CardActions>
                    <EditButton
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/trips/${travel.tripId}/edit`);
                      }}
                    >
                      수정
                    </EditButton>

                    <DeleteButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(travel.tripId);
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
