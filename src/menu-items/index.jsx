// project import
import dashboard from './dashboard';
import company from './Company'; 
import category from './Category'; 
import product from './Product';
import supplier from './Supplier';
import purchaseOrder from './PurchaseOrder';
import expense from './Expense';
import staff from './Staff';
import pos from './Pos';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, company,category,product,supplier,purchaseOrder,staff, expense, pos]
};

export default menuItems;
