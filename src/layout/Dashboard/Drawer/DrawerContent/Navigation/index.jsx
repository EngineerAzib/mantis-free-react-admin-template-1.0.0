// material-ui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useContext } from 'react';

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import { AuthContext } from 'contexts/AuthContext';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

export default function Navigation() {
  const { userRole } = useContext(AuthContext);

  // Filter menu items based on user role
  const getFilteredMenuItems = () => {
    if (!userRole) {
      return []; // Return empty array if role is not loaded yet
    }

    const allMenuItems = menuItem.items;
    
    // StoreOwner and CompanyOwner: display all menus
    if (userRole === 'StoreOwner' || userRole === 'CompanyOwner') {
      return allMenuItems;
    }
    
    // Admin: only company menu
    if (userRole === 'Admin') {
      return allMenuItems.filter(item => item.id === 'company');
    }
    
    // Casher: only POS menu
    if (userRole === 'Casher') {
      return allMenuItems.filter(item => item.id === 'pos');
    }
    
    // Default: return all menus if role doesn't match
    return allMenuItems;
  };

  const filteredMenuItems = getFilteredMenuItems();

  const navGroups = filteredMenuItems.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
           
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
}
