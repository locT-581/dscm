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
import formatDate from "@/utils/formatDate";

interface Data {
  shipmentStatus: string;
  shippedOrder: string;
  processes: string;
  location: string;
  dated: number;
  addBy: string;
  image: string;
  imageProcess: string;
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
    id: "shipmentStatus",
    numeric: false,
    disablePadding: false,
    label: "Trạng thái",
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
    id: "shippedOrder",
    numeric: false,
    disablePadding: false,
    label: "Đơn hàng",
    allowSort: false,
  },
  {
    id: "processes",
    numeric: false,
    disablePadding: false,
    label: "Quy trình",
    allowSort: true,
  },
  {
    id: "location",
    numeric: false,
    disablePadding: false,
    label: "Địa chỉ",
    allowSort: true,
  },
  {
    id: "dated",
    numeric: false,
    disablePadding: false,
    label: "Ngày thêm",
    allowSort: true,
  },
  {
    id: "addBy",
    numeric: false,
    disablePadding: false,
    label: "Nhà cung cấp",
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
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="center"></TableCell>
      </TableRow>
    </TableHead>
  );
}

export default function TableShipment({ rowList }: { rowList: Data[] }) {
  const [rows] = React.useState(rowList);
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("dated");
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
      .map((row) => ({ ...row }))
      .sort(getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [order, orderBy, page, rowsPerPage, rows]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2, background: "transparent" }}>
        <Toolbar
          sx={[
            {
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
            },
          ]}
        >
          <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
            Danh sách vận chuyển
          </Typography>
        </Toolbar>

        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={"medium"}>
            <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
            <TableBody>
              {visibleRows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow hover role="row" tabIndex={-1} key={index} sx={{ cursor: "pointer", padding: "12px" }}>
                    <TableCell component="th" id={labelId} scope="row" align="center">
                      {row.shipmentStatus}
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
                    <TableCell align="center">{row.shippedOrder}</TableCell>
                    <TableCell align="center" className="flex gap-2 items-center ">
                      <img
                        onClick={() => {
                          window.open(row.image, "_blank");
                        }}
                        src={row.imageProcess}
                        alt=""
                        className="w-[3vw] aspect-square object-cover"
                      />{" "}
                      {row.processes}
                    </TableCell>
                    <TableCell align="center">{row.location}</TableCell>
                    <TableCell align="center">{formatDate(new Date(row.dated).toLocaleDateString())}</TableCell>
                    <TableCell align="center">{row.addBy}</TableCell>
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
          labelRowsPerPage="Số phần tử mỗi trang"
        />
      </Paper>
    </Box>
  );
}
