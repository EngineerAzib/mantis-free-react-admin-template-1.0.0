// assets
import { ShoppingCartOutlined } from '@ant-design/icons';

// icons
const icons = {
  ShoppingCartOutlined
};

// ==============================|| MENU ITEMS - PRODUCT PAGE ||============================== //

const product = {
  id: 'product-group',
  title: 'Product',
  type: 'group',
  children: [
    {
      id: 'product',
      title: 'Product',
      type: 'item',
      url: '/product',
      icon: icons.ShoppingCartOutlined
    }
  ]
};

export default product;
