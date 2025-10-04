// assets
import { DollarOutlined } from '@ant-design/icons';

// icons
const icons = {
  DollarOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const expense = {
  id: 'expense-group',
  title: 'Expense',
  type: 'group',
  children: [
    {
      id: 'expense',
      title: 'Expense',
      type: 'item',
      url: '/expense',
      icon: icons.DollarOutlined
    },
   
  ]
};

export default expense;     
