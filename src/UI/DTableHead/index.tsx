import TableCell, { TableCellProps } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow, { TableRowProps } from "@mui/material/TableRow";

export interface IDTableHeadProps {
  children: React.ReactNode;
}

export default function DTableHead({ children }: IDTableHeadProps) {
  return <TableHead sx={{ background: "#f5f5f5" }}>{children}</TableHead>;
}

export interface IDTableCellProps extends TableCellProps {
  children?: React.ReactNode;
}
export const DTableCell = ({ children, ...props }: IDTableCellProps) => {
  return (
    <TableCell sx={{ background: "#f5f5f5" }} {...props}>
      {children}
    </TableCell>
  );
};

export interface IDTableRowProps extends TableRowProps {
  children?: React.ReactNode;
}

export const DTableRow = ({ children, ...props }: IDTableRowProps) => {
  return (
    <TableRow sx={{ background: "#f5f5f5" }} {...props}>
      {children}
    </TableRow>
  );
};
