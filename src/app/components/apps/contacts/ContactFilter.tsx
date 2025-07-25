
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { ContactContext } from '@/app/context/Conatactcontext';
import Scrollbar from "../../../components/custom-scroll/Scrollbar";
import {
  IconMail,
  IconSend,
  IconBucket,
  IconFolder,
} from "@tabler/icons-react";
import ContactAdd from "./ContactAdd";
import { ElementType, useContext, useEffect } from 'react';
import { CustomizerContext } from '@/app/context/customizerContext';
import { usePathname } from 'next/navigation';
import { mutate } from 'swr';

interface DataType {
  id: number;
  name?: string;
  sort?: string;
  icon?: ElementType;
  filterbyTitle?: string;
  devider?: boolean;
  color?: string;
}


const ContactFilter = () => {

  const { isBorderRadius } = useContext(CustomizerContext);
  const br = `${isBorderRadius}px`;

  const { setSelectedDepartment, updateSearchTerm, selectedDepartment } = useContext(ContactContext);

  const filterData: DataType[] = [
    {
      id: 2,
      name: 'All',
      sort: 'show_all',
      icon: IconMail,
    },
    {
      id: 3,
      name: 'Frequent',
      sort: 'frequent_contact',
      icon: IconSend,
    },
    {
      id: 4,
      name: 'Starred',
      sort: 'starred_contact',
      icon: IconBucket,
    },
    {
      id: 6,
      devider: true,
    },
    {
      id: 5,
      filterbyTitle: 'Categories',
    },

    {
      id: 7,
      name: 'Engineering',
      sort: 'engineering_department',
      icon: IconFolder,
      color: 'primary.main',
    },
    {
      id: 8,
      name: 'Support',
      sort: 'support_department',
      icon: IconFolder,
      color: 'error.main',
    },
    {
      id: 9,
      name: 'Sales',
      sort: 'sales_department',
      icon: IconFolder,
      color: 'success.main',
    },
  ];

  const handleDepartmentClick = (department: string) => {
    setSelectedDepartment(department);
    updateSearchTerm("");
  };

  const location = usePathname();

  // Reset Contacts on browser refresh
  const handleResetTickets = async () => {
    const response = await fetch("/api/contacts", {
      method: 'GET',
      headers: {
        "broserRefreshed": "true"
      }
    });
    const result = await response.json();
    await mutate("/api/contacts");
  }

  useEffect(() => {
    const isPageRefreshed = sessionStorage.getItem("isPageRefreshed");
    if (isPageRefreshed === "true") {
      console.log("page refreshed");
      sessionStorage.removeItem("isPageRefreshed");
      handleResetTickets();
    }
  }, [location]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem("isPageRefreshed", "true");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);



  return (
    <>
      <ContactAdd />
      <List>
        <Scrollbar sx={{ height: { lg: 'calc(100vh - 100px)', md: '100vh' }, maxHeight: '800px' }}>
          {filterData.map((filter) => {
            if (filter.filterbyTitle) {
              return (
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  pl={5.1}
                  mt={1}
                  pb={2}
                  key={filter.id}
                >
                  {filter.filterbyTitle}
                </Typography>
              );
            } else if (filter.devider) {
              return <Divider key={filter.id} sx={{ mb: 3 }} />;
            }

            return (
              <ListItemButton
                sx={{ mb: 1, mx: 3, borderRadius: br }}
                selected={selectedDepartment === `${filter.name}`}

                onClick={() => handleDepartmentClick(filter.name || '')}
                key={filter.id}
              >
                <ListItemIcon sx={{ minWidth: '30px', color: filter.color }}>

                  {filter.icon && <filter.icon stroke="1.5" size={19} />}

                </ListItemIcon>
                <ListItemText>{filter.name}</ListItemText>
              </ListItemButton>
            );
          })}
        </Scrollbar>
      </List>
    </>
  );
};

export default ContactFilter;