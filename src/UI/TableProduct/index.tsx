/* eslint-disable @next/next/no-img-element */
import * as React from "react";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Unit from "@/types/unit";
import Link from "next/link";
import Button from "../Button";

interface Data {
  id: string;
  image: string;
  name: string;
  processes: string[];
  unit: Unit;
  date: string;
}

function createData(id: string, image: string, name: string, processes: string[], unit: Unit, date: string): Data {
  return {
    id,
    name,
    image,
    unit,
    date,
    processes,
  };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
  allowSort?: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "ID",
    allowSort: true,
  },
  {
    id: "image",
    numeric: false,
    disablePadding: false,
    label: "Hình ảnh",
    allowSort: false,
  },
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Tên Sản phẩm",
    allowSort: true,
  },
  {
    id: "processes",
    numeric: false,
    disablePadding: false,
    label: "Quy trình sản xuất",
    allowSort: false,
  },
  {
    id: "unit",
    numeric: false,
    disablePadding: false,
    label: "Đơn vị",
    allowSort: true,
  },
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Ngày tạo",
    allowSort: true,
  },
];

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {/* {orderBy === headCell.id ? (
                // <Box component="span" sx={visuallyHidden}>
                <Box component="span">{order === "desc" ? "Giảm dần" : "sorted ascending"}</Box>
              ) : null} */}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function TableProduct({ rowList }: { rowList: Data[] }) {
  const [rows] = React.useState(
    rowList.map((row) => createData(row.id, row.image, row.name, row.processes, row.unit, row.date))
  );
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("date");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(() => {
    return [...rows]
      .map((row) => ({ ...row, id: +row.id, unit: row.unit.name, processes: row.processes.join(", ") }))
      .sort(getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [order, orderBy, page, rowsPerPage, rows]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Toolbar
          sx={[
            {
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
            },
          ]}
        >
          <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
            Danh sách sản phẩm
          </Typography>

          <Link className="w-fit flex flex-shrink-0" href="/san-pham/them-san-pham">
            <Button>Thêm sản phẩm</Button>
          </Link>
        </Toolbar>

        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={"medium"}>
            <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
            <TableBody>
              {visibleRows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow hover role="row" tabIndex={-1} key={row.id} sx={{ cursor: "pointer", padding: "12px" }}>
                    <TableCell component="th" id={labelId} scope="row" align="center" className="w-[10%]">
                      #{row.id}
                    </TableCell>
                    <TableCell align="center" className="overflow-hidden !flex !justify-center !items-center">
                      <img
                        onClick={() => {
                          window.open(row.image, "_blank");
                        }}
                        src={row.image}
                        alt=""
                        className="w-[5vw] aspect-square object-cover"
                      />
                    </TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.processes}</TableCell>
                    <TableCell align="center">{row.unit}</TableCell>
                    <TableCell align="center">{row.date}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
