import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GetCategory,GetSearchAllProduct,AddBilling  } from '../../api/billing';
import { handlerDrawerOpen } from '../../api/menu';


export default function CompletePOSPage() {
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [qtyDialogOpen, setQtyDialogOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discountType, setDiscountType] = useState('percent');
  const [discountValue, setDiscountValue] = useState(0);
  const [overrideAmount, setOverrideAmount] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [billingSuccess, setBillingSuccess] = useState(null);
  const searchRef = useRef(null);

  // Fallback data
  const FALLBACK_PRODUCTS = [
    { id: '1001', name: 'Espresso', price: 2.5, categoryId: 'drinks', categoryName: 'Drinks' },
    { id: '1002', name: 'Cappuccino', price: 3.5, categoryId: 'drinks', categoryName: 'Drinks' },
    { id: '1003', name: 'Latte', price: 3.8, categoryId: 'drinks', categoryName: 'Drinks' },
    { id: '2001', name: 'Blueberry Muffin', price: 2.2, categoryId: 'bakery', categoryName: 'Bakery' },
    { id: '2002', name: 'Croissant', price: 2.0, categoryId: 'bakery', categoryName: 'Bakery' },
    { id: '3001', name: 'Bottled Water', price: 1.0, categoryId: 'snacks', categoryName: 'Snacks' },
    { id: '4001', name: 'Chocolate Bar', price: 1.5, categoryId: 'snacks', categoryName: 'Snacks' },
    { id: '5001', name: 'Sandwich', price: 4.5, categoryId: 'meals', categoryName: 'Meals' },
  ];

  const FALLBACK_CATEGORIES = [
    { id: 'drinks', name: 'Drinks' },
    { id: 'bakery', name: 'Bakery' },
    { id: 'snacks', name: 'Snacks' },
    { id: 'meals', name: 'Meals' },
    { id: 'all', name: 'All' },
  ];

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await GetCategory(1, 1000);
        const categoryList = response.items.map(cat => ({
          id: cat.categoryId,
          name: cat.name,
        }));
        setCategories([{ id: 'all', name: 'All' }, ...categoryList]);
        console.log('Fetched categories:', categoryList);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories(FALLBACK_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products when query or category changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const categoryId = selectedCategory === 'all' ? null : selectedCategory;
        const response = await GetSearchAllProduct(1, 100, categoryId, query);
        const productList = response.items.map(product => ({
          id: product.productId,
          name: product.productName,
          price: product.salePrice || 0,
          categoryId: product.categoryId || 'all',
          categoryName: product.categoryName || 'Unknown',
        }));
        setProducts(productList);
        console.log('Fetched products:', productList);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0) {
      fetchProducts();
    }
  }, [query, selectedCategory, categories]);

  // Computed categories with items
  const CATEGORIES = useMemo(() => {
    return categories.map(category => ({
      ...category,
      items: category.id === 'all' ? products : products.filter(p => p.categoryId === category.id),
    }));
  }, [categories, products]);

  // Filtered products for search
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    console.log('products', products);
    return products
      .filter(p => p.name.toLowerCase().includes(q) || p.id.includes(q))
      .slice(0, 8);
  }, [query, products]);

  // Cart calculations
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = +(subtotal * 0.07).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  const discountedTotal = useMemo(() => {
    if (discountType === 'percent') {
      return +(total * (1 - discountValue / 100)).toFixed(2);
    } else {
      return +Math.max(0, +(total - discountValue).toFixed(2));
    }
  }, [total, discountType, discountValue]);

  const finalAmount = overrideAmount === '' ? discountedTotal : +overrideAmount;

  // Reset payment fields when modal opens
  useEffect(() => {
    if (paymentOpen) {
      setDiscountType('percent');
      setDiscountValue(0);
      setOverrideAmount('');
      setPaidAmount('');
      setBillingSuccess(null);
    }
  }, [paymentOpen]);

  // Key bindings
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'F3') {
        e.preventDefault();
        handlerDrawerOpen(false);
        setSearchModalOpen(true);
      } else if (e.key === 'F4') {
        e.preventDefault();
        if (selectedId) setQtyDialogOpen(true);
      } else if (e.key === 'F8') {
        e.preventDefault();
        handleNewSale();
      } else if (e.key === 'F9') {
        e.preventDefault();
        handleSaveSale();
      } else if (e.key === 'F10') {
        e.preventDefault();
        if (cart.length) setPaymentOpen(true);
      } else if (e.key === 'Delete') {
        if (selectedId) handleRemoveItem(selectedId);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cart.length, selectedId]);

  // Cart functions
  function addToCart(p, qty = 1) {
    setCart((prev) => {
      const found = prev.find((c) => c.id === p.id);
      if (found) return prev.map((c) => (c.id === p.id ? { ...c, qty: c.qty + qty } : c));
      return [...prev, { id: p.id, name: p.name, price: p.price, originalPrice: p.price, qty, categoryId: p.categoryId || 'all' }];
    });
    setQuery('');
  }

  function changeQty(id, delta) {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
        .filter((i) => i.qty > 0)
    );
  }

  function setItemPrice(id, price) {
    setCart((prev) => prev.map((i) => {
      if (i.id === id) {
        const newPrice = Math.max(0, +price);
        // Get the original product price to compare
        const prod = products.find((p) => p.id === id);
        const originalProductPrice = prod ? prod.price : i.price;
        
        // If originalPrice is not set yet, set it to current price (before change)
        // If new price equals original product price, clear the discount
        if (!i.originalPrice) {
          // First time changing price - save current price as original
          return { ...i, price: newPrice, originalPrice: i.price !== newPrice ? i.price : undefined };
        } else {
          // Price was already changed - check if resetting to original product price
          return { ...i, price: newPrice, originalPrice: newPrice === originalProductPrice ? undefined : i.originalPrice };
        }
      }
      return i;
    }));
  }

  function handleRemoveItem(id) {
    setCart((prev) => prev.filter((i) => i.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function handleNewSale() {
    setCart([]);
    setSelectedId(null);
    setQuery('');
    console.info('New sale started');
  }

  function handleSaveSale() {
    console.info('Sale saved (mock)');
  }

  function handlePayNow() {
    const paid = paidAmount === '' ? finalAmount : paidAmount;
    if (paid < finalAmount) {
      alert('Paid amount is less than amount due');
      return;
    }

    // Prepare billing data
    const billingData = {
      InvoiceNo: Math.floor(Math.random() * 1000000).toString(),

      BillingDate: new Date().toISOString(),
      BillerName: 'System User',
      ReceiptHtml: generateReceiptHtml(cart, finalAmount),
      TotalAmount: finalAmount,
      PaymentAmount: paid,
      Status: 'Completed',
      CompanyId: 1, // Replace with context
      StoreId: 1, // Replace with context
      Items: cart.map(item => ({
        ProductId: item.id,
        CategoryId: item.categoryId || 'all',
        Quantity: item.qty,
        UnitPrice: item.price,
        CompanyId: 1,
        StoreId: 1,
      })),
    };

    // Submit billing
    setLoading(true);
    AddBilling(billingData)
      .then((response) => {
        setBillingSuccess(response);
        console.log('Billing created:', response);
        alert(`Paid ${finalAmount.toFixed(2)} via ${paymentMethod}`);
        handleNewSale();
        setPaymentOpen(false);
      })
      .catch((error) => {
        alert('Failed to process payment. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // Generate receipt HTML
  function generateReceiptHtml(cartItems, total) {
    const itemsHtml = cartItems
      .map(
        (item) => `
        <div class="receipt-item">
          <span>${item.name} x${item.qty}</span>
          <span>$${(item.price * item.qty).toFixed(2)}</span>
        </div>`
      )
      .join('');
    return `
      <div class="receipt">
        <h2>Receipt</h2>
        <p>Invoice #: ${Math.floor(Math.random() * 1000000)}</p>
        <p>Date: ${new Date().toLocaleString()}</p>
        <div class="receipt-items">${itemsHtml}</div>
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <p>Tax (7%): $${tax.toFixed(2)}</p>
        <p>Discount: ${discountType === 'percent' ? `${discountValue}%` : `$${discountValue}`}</p>
        <p><strong>Total: $${total.toFixed(2)}</strong></p>
      </div>`;
  }

  return (
    <div className="container-fluid bg-light min-vh-100 p-4">
      {/* Header - Hidden when payment modal is open */}
      {!paymentOpen && (
        <header className="mb-4 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            {/* <div className="rounded bg-gradient" style={{ width: '40px', height: '40px', background: 'linear-gradient(to bottom right, #7c3aed, #38bdf8)' }} />
            <div>
              <div className="fw-bold fs-5">SwiftPOS</div>
              <div className="text-muted small">Fast modern checkout</div>
            </div> */}
          </div>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-outline-secondary" onClick={handleNewSale}>
              New sale
            </button>
            <button className="btn btn-outline-secondary" onClick={() => {
              handlerDrawerOpen(false);
              setSearchModalOpen(true);
            }}>
              Categories / Search (F3)
            </button>
          </div>
        </header>
      )}

      <div className="row g-4 h-100">
        {/* Left area (search + cart) */}
        <div className="col-lg-8 h-100 d-flex flex-column">
          <div className="card flex-grow-1 d-flex flex-column">
            <div className="card-header d-flex align-items-center gap-3">
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && filtered[0]) addToCart(filtered[0]);
                }}
                placeholder="Search product by name or code"
                className="form-control"
                disabled={loading}
              />
              <button
                className="btn btn-primary"
                onClick={() => {
                  handlerDrawerOpen(false);
                  setSearchModalOpen(true);
                }}
                disabled={loading}
              >
                Search
              </button>
            </div>

            {filtered.length > 0 && (
              <div className="card-body bg-light">
                <div className="row row-cols-2 row-cols-md-4 g-2">
                  {filtered.map((p) => (
                    <div key={p.id} className="col">
                      <button
                        onClick={() => addToCart(p)}
                        className="btn btn-outline-secondary w-100 text-start"
                        disabled={loading}
                      >
                        <div className="fw-medium">{p.name}</div>
                        <div className="text-muted small">#{p.id}</div>
                        <div className="mt-1 small">${p.price.toFixed(2)}</div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-grow-1 overflow-auto">
              <div className="table-responsive" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                <table className="table table-hover">
                  <thead className="table-light sticky-top" style={{ top: 0, backgroundColor: '#fff', zIndex: 1 }}>
                    <tr>
                      <th className="w-50">Product name</th>
                      <th className="w-1/6">Qty</th>
                      <th className="w-1/6">Price</th>
                      <th className="w-1/6">Discounted</th>
                      <th className="w-1/6 text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="text-center text-muted p-5">
                          Loading...
                        </td>
                      </tr>
                    ) : cart.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-muted p-5">
                          No items — add products from categories or search (F3)
                        </td>
                      </tr>
                    ) : (
                      cart.map((i) => {
                        const hasDiscount = i.originalPrice !== undefined && i.price !== i.originalPrice;
                        const discountAmount = hasDiscount ? ((i.originalPrice - i.price) * i.qty).toFixed(2) : 0;
                        const discountPercent = hasDiscount ? (((i.originalPrice - i.price) / i.originalPrice) * 100).toFixed(1) : 0;
                        return (
                          <tr
                            key={i.id}
                            onClick={() => setSelectedId(i.id)}
                            className={selectedId === i.id ? 'table-active' : ''}
                          >
                            <td className="p-3">{i.name}</td>
                            <td className="p-3">
                              <div className="d-flex align-items-center gap-2">
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    changeQty(i.id, -1);
                                  }}
                                  disabled={loading}
                                >
                                  -
                                </button>
                                <div className="text-center" style={{ width: '24px' }}>
                                  {i.qty}
                                </div>
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    changeQty(i.id, 1);
                                  }}
                                  disabled={loading}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="p-3">
                              <div>
                                {hasDiscount && (
                                  <div className="text-muted small text-decoration-line-through">
                                    ${i.originalPrice.toFixed(2)}
                                  </div>
                                )}
                                <div className={hasDiscount ? 'text-success fw-bold' : ''}>
                                  ${i.price.toFixed(2)}
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              {hasDiscount ? (
                                <div>
                                  <div className="text-danger fw-semibold">-${discountAmount}</div>
                                  <div className="text-muted small">({discountPercent}%)</div>
                                </div>
                              ) : (
                                <div className="text-muted small">-</div>
                              )}
                            </td>
                            <td className="p-3 text-end">
                              <div>${(i.price * i.qty).toFixed(2)}</div>
                              <button
                                className="btn btn-link text-danger ms-2 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveItem(i.id);
                                }}
                                disabled={loading}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card-footer text-end">
              <div className="text-muted small">Subtotal ${subtotal.toFixed(2)}</div>
              <div className="text-muted small">Tax ${tax.toFixed(2)}</div>
              <div className="fs-3 fw-bold">Total ${total.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Right area (action pad + selected item edit) */}
        <div className="col-lg-4">
          <div className="d-grid gap-3">
            {selectedId && (
              <div className="card">
                <div className="card-body">
                  <div className="text-muted small">Selected</div>
                  <div className="mt-2 d-flex justify-content-between align-items-center">
                    <div className="fw-medium">{cart.find((c) => c.id === selectedId)?.name}</div>
                    <div className="text-muted small">#{selectedId}</div>
                  </div>
                  <div className="mt-3">
                    <label className="form-label">Unit price</label>
                    <div className="d-flex gap-2">
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={cart.find((c) => c.id === selectedId)?.price || 0}
                        onChange={(e) => setItemPrice(selectedId, Number(e.target.value || 0))}
                        className="form-control"
                        style={{ width: '100px' }}
                        disabled={loading}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          const prod = products.find((p) => p.id === selectedId);
                          const cartItem = cart.find((c) => c.id === selectedId);
                          if (prod && cartItem) {
                            // Reset to original product price
                            setCart((prev) => prev.map((i) => 
                              i.id === selectedId ? { ...i, price: prod.price, originalPrice: undefined } : i
                            ));
                          }
                        }}
                        disabled={loading}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="row g-2">
              <div className="col-4">
                <button
                  className="btn btn-outline-secondary w-100 h-100"
                  onClick={() => {
                    handlerDrawerOpen(false);
                    setSearchModalOpen(true);
                  }}
                  disabled={loading}
                >
                  <div className="small fw-medium">Search</div>
                  <div className="x-small text-muted">F3</div>
                </button>
              </div>
              <div className="col-4">
                <button
                  className="btn btn-outline-secondary w-100 h-100"
                  onClick={() => selectedId && setQtyDialogOpen(true)}
                  disabled={loading}
                >
                  <div className="small fw-medium">Quantity</div>
                  <div className="x-small text-muted">F4</div>
                </button>
              </div>
              <div className="col-4">
                <button
                  className="btn btn-outline-secondary w-100 h-100"
                  onClick={handleNewSale}
                  disabled={loading}
                >
                  <div className="small fw-medium">New sale</div>
                  <div className="x-small text-muted">F8</div>
                </button>
              </div>
            </div>

            <div className="row g-2">
              <div className="col-4">
                <button
                  className={`btn w-100 h-100 ${paymentMethod === 'cash' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setPaymentMethod('cash')}
                  disabled={loading}
                >
                  Cash
                </button>
              </div>
              <div className="col-4">
                <button
                  className={`btn w-100 h-100 ${paymentMethod === 'bank' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setPaymentMethod('bank')}
                  disabled={loading}
                >
                  Bank
                </button>
              </div>
              <div className="col-4">
                <button
                  className={`btn w-100 h-100 ${paymentMethod === 'check' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setPaymentMethod('check')}
                  disabled={loading}
                >
                  Check
                </button>
              </div>
            </div>

            <div className="row g-2">
              <div className="col-4">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => {
                    setDiscountType('percent');
                    setDiscountValue(10);
                  }}
                  disabled={loading}
                >
                  Discount
                </button>
              </div>
              <div className="col-4">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => alert('Add comment (mock)')}
                  disabled={loading}
                >
                  Comment
                </button>
              </div>
              <div className="col-4">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => alert('Customer selection (mock)')}
                  disabled={loading}
                >
                  Customer
                </button>
              </div>
            </div>

            <div className="row g-2">
              <div className="col-4">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={handleSaveSale}
                  disabled={loading}
                >
                  Save sale (F9)
                </button>
              </div>
              <div className="col-4">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => alert('Refund (mock)')}
                  disabled={loading}
                >
                  Refund
                </button>
              </div>
              <div className="col-4">
                <button
                  className="btn btn-primary w-100 h-100"
                  onClick={() => cart.length && setPaymentOpen(true)}
                  disabled={loading}
                >
                  Payment (F10)
                </button>
              </div>
            </div>

            <div>
              <button
                className="btn btn-danger w-100"
                onClick={() => {
                  setCart([]);
                  setSelectedId(null);
                  alert('Order voided');
                }}
                disabled={loading}
              >
                Void order
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quantity Dialog */}
      {qtyDialogOpen && selectedId && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Change quantity</h5>
              </div>
              <div className="modal-body text-center">
                <div className="d-flex align-items-center justify-content-center gap-3">
                  <button
                    className="btn btn-outline-secondary px-3 py-2"
                    onClick={() => changeQty(selectedId, -1)}
                    disabled={loading}
                  >
                    -
                  </button>
                  <div className="fs-3 fw-bold">{cart.find((c) => c.id === selectedId)?.qty ?? 0}</div>
                  <button
                    className="btn btn-outline-secondary px-3 py-2"
                    onClick={() => changeQty(selectedId, 1)}
                    disabled={loading}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setQtyDialogOpen(false)}
                  disabled={loading}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search / Category Modal */}
      {searchModalOpen && (
        <div 
          className="modal show d-block" 
          tabIndex="-1" 
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(2px)',
            zIndex: 1300
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSearchModalOpen(false);
            }
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" style={{ maxWidth: '800px' }}>
            <div className="modal-content" style={{ borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
              <div className="modal-header" style={{ backgroundColor: '#fff', borderRadius: '8px 8px 0 0', borderBottom: '1px solid #e9ecef' }}>
                <div className="d-flex justify-content-between align-items-center w-100">
                  <h5 className="modal-title fw-bold mb-0">Search Products</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSearchModalOpen(false)}
                    disabled={loading}
                  ></button>
                </div>
              </div>
              <div className="modal-body p-3">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name or ID..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                  />
                </div>
                {loading ? (
                  <div className="text-center text-muted p-4">
                    <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                    <div className="mt-2 small">Loading...</div>
                  </div>
                ) : (
                  <div className="row g-2">
                    <div className="col-3">
                      <div className="list-group" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {CATEGORIES.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => setSelectedCategory(c.id)}
                            className={`list-group-item list-group-item-action ${selectedCategory === c.id ? 'active' : ''}`}
                            disabled={loading}
                          >
                            {c.name}
                            {c.id !== 'all' && (
                              <span className="badge bg-secondary rounded-pill float-end">
                                {(c.items || []).length}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="col-9">
                      <div className="row g-2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {(CATEGORIES.find((x) => x.id === selectedCategory)?.items || CATEGORIES[0]?.items || []).length === 0 ? (
                          <div className="col-12 text-center text-muted p-4">
                            <div>No products found</div>
                          </div>
                        ) : (
                          (CATEGORIES.find((x) => x.id === selectedCategory)?.items || CATEGORIES[0]?.items || []).map((p) => (
                            <div key={p.id} className="col-6 col-md-4">
                              <button
                                onClick={() => {
                                  addToCart(p);
                                  setSearchModalOpen(false);
                                }}
                                className="btn btn-outline-primary w-100 text-start p-2"
                                disabled={loading}
                              >
                                <div className="fw-semibold small">{p.name}</div>
                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>#{p.id}</div>
                                <div className="text-primary fw-bold mt-1">${p.price.toFixed(2)}</div>
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)', zIndex: 1300 }}>
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            style={{
              maxHeight: '90vh',
              margin: '2rem auto',
              zIndex: 1301
            }}
          >
            <div className="modal-content" style={{ borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', zIndex: 1301 }}>
              <div className="modal-header" style={{ backgroundColor: '#fff', zIndex: 1302, borderRadius: '12px 12px 0 0', borderBottom: '2px solid #e9ecef', position: 'sticky', top: 0 }}>
                <div className="d-flex flex-column w-100">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="modal-title fw-bold mb-0" style={{ fontSize: '1.5rem' }}>Payment</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setPaymentOpen(false)}
                      disabled={loading}
                    ></button>
                  </div>
                  <p className="text-muted small mb-2">Confirm payment and print receipt</p>
                  <div className="btn-group w-100" role="group">
                    <button
                      className={`btn btn-sm ${paymentMethod === 'cash' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setPaymentMethod('cash')}
                      disabled={loading}
                    >
                      Cash
                    </button>
                    <button
                      className={`btn btn-sm ${paymentMethod === 'bank' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setPaymentMethod('bank')}
                      disabled={loading}
                    >
                      Bank
                    </button>
                    <button
                      className={`btn btn-sm ${paymentMethod === 'check' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setPaymentMethod('check')}
                      disabled={loading}
                    >
                      Check
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-body" style={{ maxHeight: 'calc(90vh - 200px)', overflowY: 'auto', padding: '1.5rem' }}>
                {billingSuccess ? (
                  <>
                    <div className="text-center mb-3">
                      <div className="text-success fs-4">✓ Payment Successful</div>
                      <p className="text-muted">Invoice #{billingSuccess.invoiceNo || 'N/A'}</p>
                    </div>
                    <h6 className="fw-bold mb-2">Items:</h6>
                    {cart.map((item) => (
                      <div key={item.id} className="row mb-1">
                        <div className="col-6">{item.name} x {item.qty}</div>
                        <div className="col-6 text-end">${(item.price * item.qty).toFixed(2)}</div>
                      </div>
                    ))}
                    <div className="border-top pt-2 mt-2">
                      <div className="row mb-1">
                        <div className="col-6 text-muted">Subtotal</div>
                        <div className="col-6 text-end">${subtotal.toFixed(2)}</div>
                      </div>
                      <div className="row mb-1">
                        <div className="col-6 text-muted">Tax (7%)</div>
                        <div className="col-6 text-end">${tax.toFixed(2)}</div>
                      </div>
                      <div className="row mb-1">
                        <div className="col-6 text-muted">Discount</div>
                        <div className="col-6 text-end">
                          {discountType === 'percent' ? `${discountValue}%` : `$${discountValue}`}
                        </div>
                      </div>
                      <div className="row fw-bold">
                        <div className="col-6">Total</div>
                        <div className="col-6 text-end">${finalAmount.toFixed(2)}</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="row mb-3">
                      <div className="col-6 text-muted">Subtotal</div>
                      <div className="col-6 text-end">${subtotal.toFixed(2)}</div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-6 text-muted">Tax</div>
                      <div className="col-6 text-end">${tax.toFixed(2)}</div>
                    </div>
                    <div className="row mb-3 align-items-center">
                      <div className="col-3">
                        <label className="form-label mb-0">Discount</label>
                      </div>
                      <div className="col-9">
                        <div className="d-flex align-items-center gap-2">
                          <select
                            value={discountType}
                            onChange={(e) => setDiscountType(e.target.value)}
                            className="form-select"
                            disabled={loading}
                          >
                            <option value="percent">Percent %</option>
                            <option value="fixed">Fixed $</option>
                          </select>
                          <input
                            type="number"
                            min={0}
                            value={discountValue}
                            onChange={(e) => setDiscountValue(Math.max(0, Number(e.target.value || 0)))}
                            className="form-control text-end"
                            style={{ width: '100px' }}
                            disabled={loading}
                          />
                          <div className="d-flex gap-1">
                            {discountType === 'percent'
                              ? [5, 10, 15, 20].map((p) => (
                                  <button
                                    key={p}
                                    onClick={() => setDiscountValue(p)}
                                    className="btn btn-outline-secondary btn-sm"
                                    disabled={loading}
                                  >
                                    {p}%
                                  </button>
                                ))
                              : [1, 2, 5, 10].map((a) => (
                                  <button
                                    key={a}
                                    onClick={() => setDiscountValue(a)}
                                    className="btn btn-outline-secondary btn-sm"
                                    disabled={loading}
                                  >
                                    ${a}
                                  </button>
                                ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-6 fs-5 fw-bold">Amount due</div>
                      <div className="col-6 text-end fs-5 fw-bold">${finalAmount.toFixed(2)}</div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Amount to charge (override)</label>
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={overrideAmount}
                        onChange={(e) => setOverrideAmount(e.target.value === '' ? '' : Number(e.target.value))}
                        className="form-control"
                        placeholder="Leave empty to use discounted total"
                        disabled={loading}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Customer paid</label>
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Enter amount given by customer"
                        className="form-control"
                        disabled={loading}
                      />
                    </div>
                    <div className="row mb-3">
                      <div className="col-6 text-muted">Change</div>
                      <div className="col-6 text-end fw-medium">
                        ${(paidAmount === '' ? 0 : Math.max(0, paidAmount - finalAmount)).toFixed(2)}
                      </div>
                    </div>
                    <div className="text-muted small">
                      Tip: You can apply percent/fixed discount or override the final amount before accepting payment.
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setPaymentOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handlePayNow}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="spinner-border spinner-border-sm text-white" role="status" />
                  ) : (
                    'Pay now'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}