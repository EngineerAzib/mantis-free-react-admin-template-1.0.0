// project import
import dashboard from './dashboard';
import pages from './page';
import utilities from './utilities';
import support from './support';
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
  items: [dashboard, company,category,product,supplier,purchaseOrder,staff, expense, pages, utilities, support,pos]
};

export default menuItems;
