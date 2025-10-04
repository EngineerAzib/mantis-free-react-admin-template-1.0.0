// assets
import { ShoppingCartOutlined } from '@ant-design/icons';

// icons
const icons = {
  ShoppingCartOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const pos = {
  id: 'pos',
  title: 'Pos',
  type: 'group',
  children: [
    {
      id: 'pos',
      title: 'Pos',
      type: 'item',
      url: '/pos',
      icon: icons.ShoppingCartOutlined,
      breadcrumb: false
    },
   
  ]
};

export default pos;     
