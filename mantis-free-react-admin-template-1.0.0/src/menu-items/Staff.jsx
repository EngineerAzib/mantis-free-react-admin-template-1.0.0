// assets
import { UserOutlined } from '@ant-design/icons';

// icons
const icons = {
  UserOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const staff = {
  id: 'staff-group',
  title: 'Staff',
  type: 'group',
  children: [
    {
      id: 'staff',
      title: 'Staff',
      type: 'item',
      url: '/staff',
      icon: icons.UserOutlined
    },
   
  ]
};

export default staff;     
