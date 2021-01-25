import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';
import React, { ReactElement } from 'react';
import fineGenerator from '../../generators/fine-generator';
import useStyles from './use-styles';

interface CarsTabProps {
  className?: string;
}
const fines = Array.from(Array(12), () => fineGenerator());

const FinesTab = (props: CarsTabProps): ReactElement => {
  const { className } = props;
  const classes = useStyles();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, fines.length - page * rowsPerPage);

  return (
    <div className={className}>
      <TableContainer component={Paper}>
        <Table
          className={classes.table}
          aria-label="simple table"
          size="medium"
        >
          <TableHead>
            <TableRow>
              <TableCell>Numer rejestracyjny</TableCell>
              <TableCell>Opis mandatu</TableCell>
              <TableCell>Wysokość mandatu</TableCell>
              <TableCell>Data wystawienia</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fines
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.plateNumber}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.cost} PLN</TableCell>
                  <TableCell component="th" scope="row">
                    {row.createTime}
                  </TableCell>
                </TableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 50 * emptyRows }}>
                <TableCell colSpan={3} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        labelRowsPerPage=""
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} z ${count}`}
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={fines.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default FinesTab;
