

import React, { useContext } from "react";

import { useState } from "react";

import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
// mui imports
import {
  ListItemIcon,
  ListItemButton,
  Collapse,
  styled,
  ListItemText,
  useTheme,
  useMediaQuery,
  Theme,
} from "@mui/material";
import { CustomizerContext } from "@/app/context/customizerContext";

// custom imports
import NavItem from "../NavItem";

// plugins
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { isNull } from "lodash";
import { NavCollapseProps } from "@/app/(DashboardLayout)/types/layout/sidebar";


// FC Component For Dropdown Menu
export default function NavCollapse({
  menu,
  level,
  pathWithoutLastPart,
  pathDirect,
  hideMenu,
  onClick,
}: NavCollapseProps) {
  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));

  const { isBorderRadius } = useContext(CustomizerContext);

  //const Icon = menu?.icon;
  const theme = useTheme();
  const pathname = usePathname();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);


  const menuIcon = Icon ? (
    level > 1 ? <Icon icon={menu.icon || ''} height={14} /> : <Icon icon={menu.icon || ''} height={20} />
  ) : null;


  const handleClick = () => {
    setOpen(!open);
  };

  // menu collapse for sub-levels
  React.useEffect(() => {
    setOpen(false);
    menu?.children?.forEach((item) => {
      if (item?.href === pathname) {
        setOpen(true);
      }
    });
  }, [pathname, menu.children]);


  const ListItemStyled = styled(ListItemButton)(() => ({
    marginBottom: "2px",
    padding: "8px 10px",
    paddingLeft: hideMenu ? "12px" : level > 2 ? `${level * 15}px` : "12px",
    backgroundColor: open && level < 2 ? theme.palette.secondary.main : "",
    whiteSpace: "nowrap",
    "&:hover": {
      backgroundColor:
        pathname.includes(menu.href || '') || open
          ? theme.palette.secondary.main
          : theme.palette.secondary.light,
      color:
        pathname.includes(menu.href || '') || open
          ? "white"
          : theme.palette.secondary.main,
    },
    color:
      open && level < 2
        ? "white"
        : level > 1 && open
          ? theme.palette.secondary.main
          : theme.palette.text.primary,
    borderRadius: `${isBorderRadius * 3}px`,
  }));

  // If Menu has Children
  const submenus = menu.children?.map((item) => {
    if (item.children) {
      return (
        <NavCollapse
          key={item?.id}
          menu={item}
          level={level + 1}
          pathWithoutLastPart={pathWithoutLastPart}
          pathDirect={pathDirect}
          hideMenu={hideMenu}
          onClick={onClick}
        />
      );
    } else {
      return (
        <NavItem
          key={item.id}
          item={item}
          level={level + 1}
          pathDirect={pathDirect}
          hideMenu={hideMenu}
          onClick={lgDown ? onClick : isNull}
        />
      );
    }
  });

  return (
    <>
      <ListItemStyled
        onClick={handleClick}
        selected={pathWithoutLastPart === menu.href}
        key={menu?.id}
      >
        <ListItemIcon
          sx={{
            minWidth: "36px",
            p: "3px 0",
            color: "inherit",
          }}
        >
          {menuIcon}
        </ListItemIcon>
        <ListItemText color="inherit">
          {hideMenu ? "" : <>{t(`${menu.title}`)}</>}
        </ListItemText>
        {!open ? (
          <IconChevronDown size="1rem" />
        ) : (
          <IconChevronUp size="1rem" />
        )}
      </ListItemStyled>
      <Collapse in={open} timeout="auto">
        {submenus}
      </Collapse>
    </>
  );
}