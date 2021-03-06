import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from '@material-ui/core';
import React, { ReactElement, useEffect, useState } from 'react';
import { PictureRepository, RideRepository } from 'api/repository';
import { format, parseISO } from 'date-fns';
import useStyles from './use-styles';
import { AddFineModal } from './Modals';

const Offenses = (): ReactElement => {
  const classes = useStyles();

  const [page, setPage] = React.useState(0);
  const [rideId, setRideId] = React.useState(0);
  const [speed, setSpeed] = React.useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [getData, data] = RideRepository.useGetAllRides();
  const getPicture = PictureRepository.useGetPicturePath();

  useEffect(() => {
    if (speed) {
      getData({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        speedLimit: parseInt(speed, 10),
      });
    } else {
      getData({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });
    }
  }, [getData, page, rowsPerPage, speed]);

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleModalOpen = (id: number) => {
    setIsModalOpen(true);
    setRideId(id);
  };

  const handleModalClose = () => setIsModalOpen(false);

  const handleChangeSpeedLimit = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSpeed(event.target.value);
  };

  const handleOpenImage = async (id: number) => {
    const path = await getPicture(id);
    window.open(path, '_blank');
  };

  return (
    <div className={classes.root}>
      <div className={classes.paper}>
        <TextField
          id="speed-limit"
          label="Limit prędkości"
          type="number"
          value={speed}
          onChange={handleChangeSpeedLimit}
          className={classes.textField}
        />
      </div>
      <TableContainer component={Paper}>
        <Table
          className={classes.table}
          aria-label="simple table"
          size="medium"
          stickyHeader
        >
          <TableHead>
            <TableRow>
              <TableCell>Czas przejazdu</TableCell>
              <TableCell>Zmierzona prędkość</TableCell>
              <TableCell>Numer rejestracyjny</TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {((!!data && data.results) || []).map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  {format(parseISO(row.rideDateTime), 'yyyy-MM-dd HH:mm:ss')}
                </TableCell>
                <TableCell>{row.speed} km/h</TableCell>
                <TableCell component="th" scope="row">
                  {row.plateNumber}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={async () => handleOpenImage(row.pictureId)}
                    variant="contained"
                    color="primary"
                  >
                    Zdjęcie
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleModalOpen(row.id)}
                    variant="contained"
                    color="primary"
                  >
                    Wystaw mandat
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        labelRowsPerPage=""
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} z ${count}`}
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data?.totalCount || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      <AddFineModal
        open={isModalOpen}
        handleClose={handleModalClose}
        rideId={rideId}
      />
    </div>
  );
};

export default Offenses;
