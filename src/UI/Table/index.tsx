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
import { useWeb3Store } from "@/stores/storeProvider";
import Process from "@/types/process";
import { Backdrop } from "@mui/material";
import OrderType from "@/types/order";
import AddOrder from "@/components/views/Dashboard/AddOrder";
// import { visuallyHidden } from "@mui/utils";
import CloseIcon from "@mui/icons-material/Close";
import formatDate from "@/utils/formatDate";

interface Data {
  id: number;
  name: string;
  image: string;
  quantity: number;
  unit: Unit;
  date: number;
  dateCreate: number;
  status: "Done" | "Processing" | Process;
  rawId: string;
}

function createData(
  id: number,
  image: string,
  name: string,
  quantity: number,
  unit: Unit,
  date: number,
  status: "Done" | "Processing" | Process,
  dateCreate: number,
  rawId: string
): Data {
  return {
    id,
    name,
    quantity,
    unit,
    date,
    status,
    image,
    dateCreate,
    rawId,
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
    numeric: false,
    disablePadding: false,
    label: "Mã đơn hàng",
  },
  {
    id: "image",
    numeric: false,
    disablePadding: false,
    label: "Hình ảnh",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Sản phẩm",
  },
  {
    id: "quantity",
    numeric: false,
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
  // {
  //   id: "status",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "Trạng thái",
  // },
];

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  order: Order;
  orderBy: string;
  isAdmin: boolean;
  dateTitle: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort, isAdmin, dateTitle } = props;
  console.log("🚀 ~ EnhancedTableHead ~ isAdmin:", isAdmin);
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"center"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.id == "date" ? dateTitle : headCell.label}
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
  rowList,
  dateTitle,
  option,
}: {
  rowList: {
    image: string;
    id: number;
    name: string;
    quantity: number;
    unit: Unit;
    date: number;
    dateCreate: number;
    status: "Done" | "Processing" | Process;
    rawId: string;
  }[];
  dateTitle: string;
  option?: React.ReactNode;
}) {
  const { user, orders, setTempInitOrder } = useWeb3Store((state) => state);
  const [rows] = React.useState(
    rowList.map((row) =>
      createData(row.id, row.image, row.name, row.quantity, row.unit, row.date, row.status, row.dateCreate, row.rawId)
    )
  );

  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("date");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [showDetail, setShowDetail] = React.useState<OrderType | null>(null);

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

  // const [showDetail, setShowDetail] = React.useState(false);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(() => {
    return [...rows]
      .map((row) => ({
        ...row,
        unit: row.unit.name,
        status: typeof row.status === "string" ? row.status : row.status?.name ?? "",
        rawId: row.rawId,
        date: row.dateCreate,
      }))
      .sort(getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [order, orderBy, page, rowsPerPage, rows]);

  return (
    <>
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
              Danh sách đơn hàng
            </Typography>

            {user?.role == "Focal company" && (
              <Link className="w-fit flex flex-shrink-0" href="/tong-quan/tao-don-hang">
                <Button>Tạo đơn hàng</Button>
              </Link>
            )}
          </Toolbar>

          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={"medium"}>
              <EnhancedTableHead
                dateTitle={dateTitle}
                isAdmin={user?.role == "Focal company"}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      onClick={() => {
                        setShowDetail(orders?.find((o) => o.id == row.rawId) ?? null);
                      }}
                      hover
                      role="row"
                      tabIndex={-1}
                      key={row.id}
                      sx={{ cursor: "pointer", paddingBlock: "12px" }}
                    >
                      <TableCell component="th" align="center" id={labelId} scope="row" className="!w-[20%]">
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
                      <TableCell align="center">{row.quantity}</TableCell>
                      <TableCell align="center">{row.unit}</TableCell>
                      <TableCell align="center">
                        <>
                          {(() => {
                            try {
                              return formatDate(new Date(row.date).toISOString());
                            } catch (e) {
                              console.log("🚀 ~ {visibleRows.map ~ e:", e);
                              return row.date;
                            }
                          })()}
                        </>
                      </TableCell>
                      {user?.role == "Supplier" && (
                        <TableCell
                          onClick={(e) => {
                            e.stopPropagation();
                            setTempInitOrder(orders?.find((o) => o.id == row.rawId));
                          }}
                          align="center"
                        >
                          {option}
                        </TableCell>
                      )}
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
            labelRowsPerPage="Số đơn hàng trên trang"
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

      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={!!showDetail}
        onClick={() => setShowDetail(null)}
      >
        <div
          className="max-w-[75vw] max-h-[75vh] flex flex-col items-center justify-center bg-slate-200 rounded-md text-[#023047] overflow-y-auto p-4 gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full flex justify-between items-center">
            <h4 className="text-3xl font-semibold">{`Chi tiết đơn hàng`}</h4>
            <CloseIcon
              className="cursor-pointer"
              fontSize="small"
              onClick={() => {
                setShowDetail(null);
              }}
            />
          </div>
          <AddOrder initOrder={showDetail == null ? undefined : showDetail} allowEdit={false} />
        </div>
      </Backdrop>
    </>
  );
}
