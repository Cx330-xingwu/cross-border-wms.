/* ============================================
   Cross-Border WMS - Mock Data & Utilities
   ============================================ */

// ---- Mock Data ----
const MOCK_DATA = {
  orders: [
    {
      id: 'CBW-2026-0001',
      domesticTracking: 'SF1234567890123',
      domesticCarrier: '顺丰速运',
      crossBorderTracking: '',
      crossBorderCarrier: '',
      customerName: '张三',
      customerPhone: '138****1234',
      destination: '美国洛杉矶',
      destinationCode: 'US-LAX',
      items: [
        { sku: 'SKU-A001', name: '蓝牙耳机 Pro Max', qty: 2, price: 299, weight: 0.3, verified: false },
        { sku: 'SKU-A002', name: '手机壳 透明防摔', qty: 5, price: 29.9, weight: 0.1, verified: false }
      ],
      status: 'pending',
      customsStatus: 'not_submitted',
      declaredValue: 747.5,
      currency: 'USD',
      weight: 1.1,
      createdAt: '2026-04-30 09:15:00',
      updatedAt: '2026-04-30 09:15:00',
      operator: '',
      notes: '易碎品，轻拿轻放',
      hsCode: '8518.30',
      customsCategory: '电子产品'
    },
    {
      id: 'CBW-2026-0002',
      domesticTracking: 'YT9876543210987',
      domesticCarrier: '圆通速递',
      crossBorderTracking: '',
      crossBorderCarrier: '',
      customerName: '李四',
      customerPhone: '139****5678',
      destination: '日本东京',
      destinationCode: 'JP-TYO',
      items: [
        { sku: 'SKU-B001', name: '防晒霜 SPF50+', qty: 10, price: 89, weight: 0.5, verified: false },
        { sku: 'SKU-B002', name: '面膜 玻尿酸补水', qty: 20, price: 15, weight: 0.8, verified: false }
      ],
      status: 'pending',
      customsStatus: 'not_submitted',
      declaredValue: 1190,
      currency: 'USD',
      weight: 2.3,
      createdAt: '2026-04-30 10:30:00',
      updatedAt: '2026-04-30 10:30:00',
      operator: '',
      notes: '',
      hsCode: '3304.99',
      customsCategory: '化妆品'
    },
    {
      id: 'CBW-2026-0003',
      domesticTracking: 'ZTO2026043000003',
      domesticCarrier: '中通快递',
      crossBorderTracking: 'CB-EXP-20260430-003',
      crossBorderCarrier: 'DHL Express',
      customerName: '王五',
      customerPhone: '136****9012',
      destination: '德国柏林',
      destinationCode: 'DE-BER',
      items: [
        { sku: 'SKU-C001', name: '机械键盘 87键', qty: 1, price: 399, weight: 0.9, verified: true },
        { sku: 'SKU-C002', name: '鼠标垫 超大号', qty: 2, price: 49, weight: 0.3, verified: true }
      ],
      status: 'processing',
      customsStatus: 'submitted',
      declaredValue: 497,
      currency: 'USD',
      weight: 1.5,
      createdAt: '2026-04-29 14:20:00',
      updatedAt: '2026-04-30 11:45:00',
      operator: '仓管员小王',
      notes: '',
      hsCode: '8471.60',
      customsCategory: '电脑配件'
    },
    {
      id: 'CBW-2026-0004',
      domesticTracking: 'YD1112223334444',
      domesticCarrier: '韵达快递',
      crossBorderTracking: 'CB-EXP-20260430-004',
      crossBorderCarrier: 'FedEx International',
      customerName: '赵六',
      customerPhone: '137****3456',
      destination: '英国伦敦',
      destinationCode: 'GB-LHR',
      items: [
        { sku: 'SKU-D001', name: '充电宝 20000mAh', qty: 3, price: 159, weight: 0.6, verified: true }
      ],
      status: 'completed',
      customsStatus: 'approved',
      declaredValue: 477,
      currency: 'USD',
      weight: 2.1,
      createdAt: '2026-04-28 16:00:00',
      updatedAt: '2026-04-30 08:30:00',
      operator: '仓管员小李',
      notes: '已出库',
      hsCode: '8507.60',
      customsCategory: '电子产品'
    },
    {
      id: 'CBW-2026-0005',
      domesticTracking: 'STO5556667778888',
      domesticCarrier: '申通快递',
      crossBorderTracking: '',
      crossBorderCarrier: '',
      customerName: '孙七',
      customerPhone: '135****7890',
      destination: '韩国首尔',
      destinationCode: 'KR-ICN',
      items: [
        { sku: 'SKU-E001', name: '智能手环 运动版', qty: 8, price: 199, weight: 0.4, verified: false },
        { sku: 'SKU-E002', name: '表带 硅胶替换装', qty: 16, price: 19.9, weight: 0.15, verified: false }
      ],
      status: 'pending',
      customsStatus: 'not_submitted',
      declaredValue: 1910.4,
      currency: 'USD',
      weight: 5.6,
      createdAt: '2026-04-30 11:00:00',
      updatedAt: '2026-04-30 11:00:00',
      operator: '',
      notes: '大批量，请安排多人处理',
      hsCode: '9102.12',
      customsCategory: '智能穿戴'
    },
    {
      id: 'CBW-2026-0006',
      domesticTracking: 'EMS1122334455667',
      domesticCarrier: 'EMS',
      crossBorderTracking: 'CB-EXP-20260429-006',
      crossBorderCarrier: 'UPS Worldwide',
      customerName: '周八',
      customerPhone: '133****2345',
      destination: '澳大利亚悉尼',
      destinationCode: 'AU-SYD',
      items: [
        { sku: 'SKU-F001', name: '瑜伽垫 加厚防滑', qty: 2, price: 129, weight: 1.2, verified: true },
        { sku: 'SKU-F002', name: '弹力带 套装', qty: 4, price: 39, weight: 0.3, verified: true }
      ],
      status: 'processing',
      customsStatus: 'submitted',
      declaredValue: 414,
      currency: 'USD',
      weight: 3.6,
      createdAt: '2026-04-29 09:00:00',
      updatedAt: '2026-04-30 10:00:00',
      operator: '仓管员小王',
      notes: '运动器材',
      hsCode: '9506.91',
      customsCategory: '体育用品'
    },
    {
      id: 'CBW-2026-0007',
      domesticTracking: 'JD0011223344556',
      domesticCarrier: '京东物流',
      crossBorderTracking: '',
      crossBorderCarrier: '',
      customerName: '吴九',
      customerPhone: '131****6789',
      destination: '加拿大温哥华',
      destinationCode: 'CA-YVR',
      items: [
        { sku: 'SKU-G001', name: '儿童积木 200片', qty: 3, price: 89, weight: 1.5, verified: false }
      ],
      status: 'pending',
      customsStatus: 'not_submitted',
      declaredValue: 267,
      currency: 'USD',
      weight: 4.8,
      createdAt: '2026-04-30 13:20:00',
      updatedAt: '2026-04-30 13:20:00',
      operator: '',
      notes: '玩具类，注意报关分类',
      hsCode: '9503.00',
      customsCategory: '玩具'
    },
    {
      id: 'CBW-2026-0008',
      domesticTracking: 'DBL99887766554',
      domesticCarrier: '德邦快递',
      crossBorderTracking: 'CB-EXP-20260428-008',
      crossBorderCarrier: 'TNT Express',
      customerName: '郑十',
      customerPhone: '130****0123',
      destination: '法国巴黎',
      destinationCode: 'FR-CDG',
      items: [
        { sku: 'SKU-H001', name: '茶具套装 紫砂', qty: 1, price: 599, weight: 2.0, verified: true },
        { sku: 'SKU-H002', name: '龙井茶叶 250g', qty: 4, price: 168, weight: 1.2, verified: true }
      ],
      status: 'completed',
      customsStatus: 'approved',
      declaredValue: 1271,
      currency: 'USD',
      weight: 6.8,
      createdAt: '2026-04-27 10:30:00',
      updatedAt: '2026-04-29 16:00:00',
      operator: '仓管员小李',
      notes: '易碎品，已特殊包装',
      hsCode: '6911.10',
      customsCategory: '陶瓷/茶叶'
    }
  ],

  operators: [
    { id: 'OP-001', name: '仓管员小王', role: 'warehouse', avatar: '王', status: 'active', todayProcessed: 12 },
    { id: 'OP-002', name: '仓管员小李', role: 'warehouse', avatar: '李', status: 'active', todayProcessed: 8 },
    { id: 'OP-003', name: '仓管员小张', role: 'warehouse', avatar: '张', status: 'offline', todayProcessed: 0 },
    { id: 'OP-004', name: '报关员小陈', role: 'customs', avatar: '陈', status: 'active', todayProcessed: 5 }
  ],

  logisticsPartners: [
    { code: 'DHL', name: 'DHL Express', transitDays: '5-7', trackingPrefix: 'DHL' },
    { code: 'FEDEX', name: 'FedEx International', transitDays: '4-6', trackingPrefix: 'FDX' },
    { code: 'UPS', name: 'UPS Worldwide', transitDays: '5-8', trackingPrefix: 'UPS' },
    { code: 'TNT', name: 'TNT Express', transitDays: '6-9', trackingPrefix: 'TNT' },
    { code: 'ARAMEX', name: 'Aramex', transitDays: '7-12', trackingPrefix: 'ARX' }
  ],

  customsRecords: [
    { orderId: 'CBW-2026-0004', status: 'approved', submittedAt: '2026-04-29 09:00', approvedAt: '2026-04-29 14:30', remarks: '审核通过' },
    { orderId: 'CBW-2026-0003', status: 'submitted', submittedAt: '2026-04-30 11:45', approvedAt: '', remarks: '等待审核' },
    { orderId: 'CBW-2026-0006', status: 'submitted', submittedAt: '2026-04-30 10:00', approvedAt: '', remarks: '等待审核' },
    { orderId: 'CBW-2026-0008', status: 'approved', submittedAt: '2026-04-28 15:00', approvedAt: '2026-04-28 18:00', remarks: '审核通过' }
  ]
};

// ---- Utility Functions ----
const Utils = {
  formatDateTime(str) {
    if (!str) return '-';
    const d = new Date(str.replace(/-/g, '/'));
    return d.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  },

  formatDate(str) {
    if (!str) return '-';
    const d = new Date(str.replace(/-/g, '/'));
    return d.toLocaleDateString('zh-CN');
  },

  statusText(status) {
    const map = { pending: '待处理', processing: '处理中', completed: '已完成', cancelled: '已取消' };
    return map[status] || status;
  },

  customsStatusText(status) {
    const map = { not_submitted: '未提交', submitted: '已提交', approved: '已通过', rejected: '已拒绝' };
    return map[status] || status;
  },

  statusBadgeClass(status) {
    const map = { pending: 'badge-pending', processing: 'badge-processing', completed: 'badge-completed', cancelled: 'badge-cancelled' };
    return map[status] || 'badge-info';
  },

  customsBadgeClass(status) {
    const map = { not_submitted: 'badge-pending', submitted: 'badge-processing', approved: 'badge-completed', rejected: 'badge-cancelled' };
    return map[status] || 'badge-info';
  },

  generateTracking(carrier) {
    const prefixes = { 'DHL Express': 'DHL', 'FedEx International': 'FDX', 'UPS Worldwide': 'UPS', 'TNT Express': 'TNT', 'Aramex': 'ARX' };
    const prefix = prefixes[carrier] || 'CB';
    const num = Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${num}`;
  },

  showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  showModal(title, content, onConfirm) {
    let overlay = document.getElementById('modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'modal-overlay';
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <span class="modal-title">${title}</span>
          <button class="modal-close" onclick="Utils.closeModal()">✕</button>
        </div>
        <div class="modal-body">${content}</div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="Utils.closeModal()">取消</button>
          ${onConfirm ? '<button class="btn btn-primary" id="modal-confirm-btn">确认</button>' : ''}
        </div>
      </div>
    `;
    requestAnimationFrame(() => overlay.classList.add('active'));
    if (onConfirm) {
      document.getElementById('modal-confirm-btn').addEventListener('click', () => {
        onConfirm();
        Utils.closeModal();
      });
    }
  },

  closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
    }
  },

  debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },

  // Local storage helpers
  save(key, data) {
    try { localStorage.setItem(`cbwms_${key}`, JSON.stringify(data)); } catch(e) {}
  },
  load(key) {
    try { return JSON.parse(localStorage.getItem(`cbwms_${key}`)); } catch(e) { return null; }
  },

  getStats(orders) {
    const today = new Date().toISOString().split('T')[0];
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      completed: orders.filter(o => o.status === 'completed').length,
      todayOrders: orders.filter(o => o.createdAt.startsWith(today)).length,
      totalValue: orders.reduce((s, o) => s + o.declaredValue, 0).toFixed(2),
      totalWeight: orders.reduce((s, o) => s + o.weight, 0).toFixed(1)
    };
  }
};
