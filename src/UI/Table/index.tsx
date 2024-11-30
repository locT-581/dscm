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
// import { visuallyHidden } from "@mui/utils";

interface Data {
  id: number;
  name: string;
  quantity: number;
  unit: Unit;
  date: string;
}

function createData(id: number, name: string, quantity: number, unit: Unit, date: string): Data {
  return {
    id,
    name,
    quantity,
    unit,
    date,
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
}

const headCells: readonly HeadCell[] = [
  {
    id: "id",
    numeric: true,
    disablePadding: true,
    label: "Mã đơn hàng",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Sản phẩm",
  },
  {
    id: "quantity",
    numeric: true,
    disablePadding: false,
    label: "Số lượng",
  },
  {
    id: "unit",
    numeric: false,
    disablePadding: false,
    label: "Đơn vị",
  },
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Ngày tạo",
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
            align={headCell.numeric ? "right" : "left"}
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

export default function EnhancedTable({
  rowList = [
    createData(1, "Cupcake", 305, { id: "1", name: "kg" }, "67"),
    createData(2, "Donut", 452, { id: "1", name: "kg" }, "554"),
    createData(3, "Eclair", 262, { id: "1", name: "kg" }, "554"),
    createData(4, "Frozen yoghurt", 159, { id: "1", name: "kg" }, "554"),
    createData(5, "Gingerbread", 356, { id: "1", name: "kg" }, "554"),
    createData(6, "Honeycomb", 408, { id: "1", name: "kg" }, "554"),
    createData(7, "Ice cream sandwich", 237, { id: "1", name: "kg" }, "554"),
    createData(8, "Jelly Bean", 375, { id: "1", name: "kg" }, "554"),
    createData(9, "KitKat", 518, { id: "1", name: "kg" }, "554"),
    createData(10, "Lollipop", 392, { id: "1", name: "kg" }, "554"),
    createData(11, "Marshmallow", 392, { id: "1", name: "kg" }, "554"),
    createData(12, "Nougat", 360, { id: "1", name: "kg" }, "554"),
    createData(13, "Oreo", 437, { id: "1", name: "kg" }, "554"),
  ],
}: {
  rowList: { id: number; name: string; quantity: number; unit: Unit; date: string }[];
}) {
  const [rows] = React.useState(rowList.map((row) => createData(row.id, row.name, row.quantity, row.unit, row.date)));
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("id");
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
      .map((row) => ({ ...row, unit: row.unit.name }))
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
            Nutrition
          </Typography>
        </Toolbar>

        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={"medium"}>
            <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
            <TableBody>
              {visibleRows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow hover role="row" tabIndex={-1} key={row.id} sx={{ cursor: "pointer" }}>
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                      {row.id}
                    </TableCell>
                    <TableCell align="right">{row.name}</TableCell>
                    <TableCell align="right">{row.quantity}</TableCell>
                    <TableCell align="right">{row.unit}</TableCell>
                    <TableCell align="right">{row.date}</TableCell>
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
