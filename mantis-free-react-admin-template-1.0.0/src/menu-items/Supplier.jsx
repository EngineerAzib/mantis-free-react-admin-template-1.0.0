// assets
import { TeamOutlined } from '@ant-design/icons';

// icons
const icons = {
  TeamOutlined
};

// ==============================|| MENU ITEMS - SUPPLIER PAGE ||============================== //

const supplier = {
  id: 'supplier-group',
  title: 'Supplier',
  type: 'group',
  children: [
    {
      id: 'supplier',
      title: 'Supplier',
      type: 'item',
      url: '/supplier',
      icon: icons.TeamOutlined
    }
  ]
};

export default supplier;
