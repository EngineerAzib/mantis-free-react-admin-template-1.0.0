// assets
import { OrderedListOutlined } from '@ant-design/icons';

// icons
const icons = {
  OrderedListOutlined
};

// ==============================|| MENU ITEMS - PRODUCT PAGE ||============================== //

const purchaseOrder = {
  id: 'purchase-order-group',
  title: 'Purchase Order',
  type: 'group',
  children: [
    {
      id: 'purchase-order',
      title: 'Purchase Order',
      type: 'item',
      url: '/purchase-order',
      icon: icons.OrderedListOutlined
    }
  ]
};

export default purchaseOrder;
