// assets
import { CaretRightFilled } from '@ant-design/icons';

// icons
const icons = {
  CaretRightFilled
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const category = {
  id: 'category',
  title: 'Category',
  type: 'group',
  children: [
    {
      id: 'category',
      title: 'Category',
      type: 'item',
      url: '/category',
      icon: icons.CaretRightFilled
    },
   
  ]
};

export default category;     
