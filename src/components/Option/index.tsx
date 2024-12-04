"use client";

import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import MenuItem from "@mui/material/MenuItem";

export interface IOptionProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function Option({ onEdit, onDelete }: IOptionProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    onDelete();
  };
  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              width: "10ch",
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            onEdit();
            handleClose();
          }}
        >
          Sửa
        </MenuItem>
        {/* <MenuItem
          className="text-red-500"
          onClick={() => {
            onDelete();
            handleClose();
          }}
        >
          Xoá
        </MenuItem> */}
      </Menu>
    </div>
  );
}
