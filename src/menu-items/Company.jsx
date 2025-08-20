// assets
import { AppstoreAddOutlined } from '@ant-design/icons';

// icons
const icons = {
  AppstoreAddOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const company = {
  id: 'company',
  title: 'Company',
  type: 'group',
  children: [
    {
      id: 'company',
      title: 'Company',
      type: 'item',
      url: '/company',
      icon: icons.AppstoreAddOutlined
    },
   
  ]
};

export default company;     
