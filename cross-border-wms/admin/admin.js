/* ============================================
   Admin Panel - Application Logic
   ============================================ */

// ---- State ----
let currentPage = 'dashboard';
let orders = JSON.parse(JSON.stringify(MOCK_DATA.orders));

// ---- Auth ----
function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');
  const errorText = document.getElementById('login-error-text');

  if (!username || !password) {
    errorText.textContent = '请输入账号和密码';
    errorEl.classList.add('show');
    return false;
  }

  if (username === 'admin' && password === '123456789') {
    errorEl.classList.remove('show');
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    Utils.showToast('登录成功，欢迎回来！', 'success');
    initApp();
  } else {
    errorText.textContent = '账号或密码错误，请重试';
    errorEl.classList.add('show');
    document.getElementById('login-password').value = '';
    document.getElementById('login-password').focus();
  }
  return false;
}

function handleLogout() {
  Utils.showModal('确认退出', '<p style="text-align:center;color:var(--gray-600)">确定要退出管理后台吗？</p>', () => {
    document.getElementById('app').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    Utils.showToast('已安全退出', 'info');
  });
}

// ---- Navigation ----
function navigateTo(page, param) {
  currentPage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));

  const target = document.getElementById(`page-${page}`);
  if (target) {
    target.classList.remove('hidden');
    // Re-trigger animation
    target.style.animation = 'none';
    target.offsetHeight;
    target.style.animation = '';
  }

  const link = document.querySelector(`[data-page="${page}"]`);
  if (link) link.classList.add('active');

  const titles = {
    dashboard: '数据看板', orders: '订单管理', customs: '报关管理',
    operators: '操作员管理', logistics: '物流渠道', reports: '数据报表',
    'order-detail': '订单详情'
  };
  document.getElementById('page-title').textContent = titles[page] || page;
  document.getElementById('breadcrumb').innerHTML = `<span>🏠</span> / <span>${titles[page] || page}</span>`;

  // Render page content
  switch(page) {
    case 'dashboard': renderDashboard(); break;
    case 'orders': renderOrders(); break;
    case 'customs': renderCustoms('pending'); break;
    case 'operators': renderOperators(); break;
    case 'logistics': renderLogistics(); break;
    case 'reports': renderReports(); break;
    case 'order-detail': renderOrderDetail(param); break;
  }
}

function refreshData() {
  Utils.showToast('数据已刷新', 'info');
  navigateTo(currentPage);
}

// ---- Dashboard ----
function initApp() {
  renderDashboard();
  updatePendingCount();
}

function renderDashboard() {
  const stats = Utils.getStats(orders);

  // Stats cards
  document.getElementById('stats-grid').innerHTML = `
    <div class="stat-card">
      <div class="stat-icon blue">📦</div>
      <div class="stat-content">
        <div class="stat-label">总订单</div>
        <div class="stat-value">${stats.total}</div>
        <div class="stat-change up">↑ 今日 +${stats.todayOrders}</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon amber">⏳</div>
      <div class="stat-content">
        <div class="stat-label">待处理</div>
        <div class="stat-value">${stats.pending}</div>
        <div class="stat-change">需要尽快处理</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon cyan">🔄</div>
      <div class="stat-content">
        <div class="stat-label">处理中</div>
        <div class="stat-value">${stats.processing}</div>
        <div class="stat-change">仓库作业中</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon green">✅</div>
      <div class="stat-content">
        <div class="stat-label">已完成</div>
        <div class="stat-value">${stats.completed}</div>
        <div class="stat-change up">完成率 ${stats.total ? ((stats.completed/stats.total)*100).toFixed(0) : 0}%</div>
      </div>
    </div>
  `;

  // Trend chart
  const chartData = [
    { label: '4/24', value: 5 }, { label: '4/25', value: 8 },
    { label: '4/26', value: 3 }, { label: '4/27', value: 12 },
    { label: '4/28', value: 7 }, { label: '4/29', value: 9 },
    { label: '4/30', value: stats.todayOrders || 4 }
  ];
  const maxVal = Math.max(...chartData.map(d => d.value), 1);
  document.getElementById('trend-chart').innerHTML = chartData.map(d =>
    `<div class="mini-chart-bar" style="height:${(d.value/maxVal)*100}%" data-label="${d.label}" title="${d.value}单"></div>`
  ).join('');

  // Donut chart
  const segments = [
    { label: '待处理', value: stats.pending, color: '#f59e0b' },
    { label: '处理中', value: stats.processing, color: '#06b6d4' },
    { label: '已完成', value: stats.completed, color: '#10b981' }
  ];
  let cumulative = 0;
  const gradientParts = segments.map(s => {
    const start = cumulative;
    cumulative += stats.total ? (s.value / stats.total) * 100 : 0;
    return `${s.color} ${start}% ${cumulative}%`;
  });
  document.getElementById('donut-chart').style.background =
    `conic-gradient(${gradientParts.join(', ')})`;
  document.getElementById('donut-total').textContent = stats.total;
  document.getElementById('donut-legend').innerHTML = segments.map(s =>
    `<div class="legend-item"><div class="legend-dot" style="background:${s.color}"></div>${s.label} (${s.value})</div>`
  ).join('');

  // Recent orders
  const recent = [...orders].sort((a,b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);
  document.getElementById('recent-orders-table').innerHTML = recent.map(o => `
    <tr style="cursor:pointer" onclick="navigateTo('order-detail','${o.id}')">
      <td><span style="font-family:var(--font-mono);font-size:0.8125rem">${o.id}</span></td>
      <td>${o.destination}</td>
      <td><span class="badge ${Utils.statusBadgeClass(o.status)}"><span class="badge-dot"></span>${Utils.statusText(o.status)}</span></td>
      <td class="text-xs text-gray">${Utils.formatDateTime(o.updatedAt)}</td>
    </tr>
  `).join('');

  // Operators
  document.getElementById('operator-status-list').innerHTML = MOCK_DATA.operators.map(op => `
    <div class="operator-card">
      <div class="operator-avatar" style="background:${op.status==='active'?'linear-gradient(135deg,var(--primary),var(--accent))':'var(--gray-300)'}">${op.avatar}</div>
      <div class="operator-info">
        <div class="operator-name">${op.name}</div>
        <div class="operator-meta">今日处理 ${op.todayProcessed} 单</div>
      </div>
      <div class="operator-status ${op.status}"></div>
    </div>
  `).join('');
}

// ---- Orders ----
function renderOrders() {
  const search = (document.getElementById('order-search')?.value || '').toLowerCase();
  const statusF = document.getElementById('status-filter')?.value || '';
  const customsF = document.getElementById('customs-filter')?.value || '';

  let filtered = orders.filter(o => {
    if (statusF && o.status !== statusF) return false;
    if (customsF && o.customsStatus !== customsF) return false;
    if (search) {
      const s = `${o.id} ${o.domesticTracking} ${o.customerName} ${o.destination}`.toLowerCase();
      if (!s.includes(search)) return false;
    }
    return true;
  });

  document.getElementById('orders-table-body').innerHTML = filtered.length ? filtered.map(o => `
    <tr>
      <td><a href="#" onclick="navigateTo('order-detail','${o.id}');return false" style="font-family:var(--font-mono);font-weight:600">${o.id}</a></td>
      <td>
        <div style="font-family:var(--font-mono);font-size:0.8125rem">${o.domesticTracking}</div>
        <div class="text-xs text-gray">${o.domesticCarrier}</div>
      </td>
      <td>${o.destination}</td>
      <td>${o.items.reduce((s,i)=>s+i.qty,0)} 件</td>
      <td class="font-semibold">$${o.declaredValue.toLocaleString()}</td>
      <td><span class="badge ${Utils.statusBadgeClass(o.status)}"><span class="badge-dot"></span>${Utils.statusText(o.status)}</span></td>
      <td><span class="badge ${Utils.customsBadgeClass(o.customsStatus)}">${Utils.customsStatusText(o.customsStatus)}</span></td>
      <td class="text-xs text-gray">${Utils.formatDateTime(o.createdAt)}</td>
      <td>
        <div class="flex gap-2">
          <button class="btn btn-ghost btn-sm" onclick="navigateTo('order-detail','${o.id}')" title="查看详情">👁</button>
          ${o.status === 'pending' ? `<button class="btn btn-success btn-sm" onclick="startProcessing('${o.id}')" title="开始处理">▶</button>` : ''}
        </div>
      </td>
    </tr>
  `).join('') : '<tr><td colspan="9"><div class="empty-state"><div class="empty-state-icon">📭</div><div class="empty-state-text">暂无匹配的订单</div></div></td></tr>';

  // Bind search
  const searchInput = document.getElementById('order-search');
  if (searchInput && !searchInput._bound) {
    searchInput._bound = true;
    searchInput.addEventListener('input', Utils.debounce(() => renderOrders()));
    document.getElementById('status-filter').addEventListener('change', () => renderOrders());
    document.getElementById('customs-filter').addEventListener('change', () => renderOrders());
  }
}

function startProcessing(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;
  order.status = 'processing';
  order.operator = 'Admin';
  order.updatedAt = new Date().toLocaleString('zh-CN').replace(/\//g, '-');
  Utils.showToast(`订单 ${orderId} 已开始处理`, 'success');
  updatePendingCount();
  renderOrders();
}

function showAddOrderModal() {
  Utils.showModal('新建订单', `
    <div class="form-group">
      <label class="form-label">国内快递单号</label>
      <input type="text" class="form-input" id="new-tracking" placeholder="输入国内快递单号">
    </div>
    <div class="form-group">
      <label class="form-label">快递公司</label>
      <select class="form-select" id="new-carrier">
        <option>顺丰速运</option><option>圆通速递</option><option>中通快递</option>
        <option>韵达快递</option><option>申通快递</option><option>京东物流</option><option>EMS</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">客户姓名</label>
      <input type="text" class="form-input" id="new-customer" placeholder="输入客户姓名">
    </div>
    <div class="form-group">
      <label class="form-label">目的地</label>
      <input type="text" class="form-input" id="new-dest" placeholder="如：美国洛杉矶">
    </div>
    <div class="form-group">
      <label class="form-label">备注</label>
      <textarea class="form-textarea" id="new-notes" placeholder="可选备注信息"></textarea>
    </div>
  `, () => {
    const tracking = document.getElementById('new-tracking').value.trim();
    const carrier = document.getElementById('new-carrier').value;
    const customer = document.getElementById('new-customer').value.trim();
    const dest = document.getElementById('new-dest').value.trim();
    const notes = document.getElementById('new-notes').value.trim();
    if (!tracking || !customer || !dest) {
      Utils.showToast('请填写必要信息', 'error');
      return;
    }
    const newId = `CBW-2026-${String(orders.length + 1).padStart(4, '0')}`;
    orders.unshift({
      id: newId, domesticTracking: tracking, domesticCarrier: carrier,
      crossBorderTracking: '', crossBorderCarrier: '',
      customerName: customer, customerPhone: '',
      destination: dest, destinationCode: '',
      items: [{ sku: 'SKU-NEW', name: '待录入', qty: 1, price: 0, weight: 0, verified: false }],
      status: 'pending', customsStatus: 'not_submitted',
      declaredValue: 0, currency: 'USD', weight: 0,
      createdAt: new Date().toLocaleString('zh-CN').replace(/\//g, '-'),
      updatedAt: new Date().toLocaleString('zh-CN').replace(/\//g, '-'),
      operator: '', notes, hsCode: '', customsCategory: ''
    });
    updatePendingCount();
    renderOrders();
    Utils.showToast(`订单 ${newId} 创建成功`, 'success');
  });
}

// ---- Order Detail ----
function renderOrderDetail(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) {
    document.getElementById('order-detail-content').innerHTML = '<div class="empty-state"><div class="empty-state-icon">❌</div><div class="empty-state-text">订单未找到</div></div>';
    return;
  }

  const steps = [
    { label: '包裹到达', status: 'done' },
    { label: '扫描入库', status: order.status !== 'pending' ? 'done' : 'active' },
    { label: '拆除旧标', status: order.status === 'processing' && order.items.some(i=>i.verified) ? 'done' : order.status === 'processing' ? 'active' : '' },
    { label: '商品核实', status: order.items.every(i=>i.verified) ? 'done' : order.items.some(i=>i.verified) ? 'active' : '' },
    { label: '贴跨境面单', status: order.crossBorderTracking ? 'done' : order.items.every(i=>i.verified) ? 'active' : '' },
    { label: '报关出库', status: order.customsStatus === 'approved' ? 'done' : order.customsStatus === 'submitted' ? 'active' : '' }
  ];

  document.getElementById('order-detail-content').innerHTML = `
    <div class="card" style="margin-bottom:var(--space-4)">
      <div class="card-header">
        <div>
          <span class="font-bold" style="font-size:1.125rem">${order.id}</span>
          <span class="badge ${Utils.statusBadgeClass(order.status)}" style="margin-left:var(--space-3)"><span class="badge-dot"></span>${Utils.statusText(order.status)}</span>
        </div>
        <div class="flex gap-2">
          ${order.status === 'pending' ? `<button class="btn btn-success btn-sm" onclick="startProcessing('${order.id}');navigateTo('order-detail','${order.id}')">▶ 开始处理</button>` : ''}
          ${order.status === 'processing' ? `<button class="btn btn-primary btn-sm" onclick="completeOrder('${order.id}')">✓ 标记完成</button>` : ''}
          <button class="btn btn-outline btn-sm" onclick="deleteOrder('${order.id}')">🗑 删除</button>
        </div>
      </div>
      <div class="card-body">
        <div class="workflow-steps">
          ${steps.map((s, i) => `
            ${i > 0 ? '<span class="workflow-step-arrow">→</span>' : ''}
            <div class="workflow-step ${s.status}">
              <span class="step-num">${s.status === 'done' ? '✓' : i + 1}</span>
              ${s.label}
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="charts-grid">
      <div class="card">
        <div class="card-header"><span class="font-semibold">📋 基本信息</span></div>
        <div class="card-body">
          <div class="order-detail-grid">
            <div class="detail-item"><div class="detail-label">国内快递单号</div><div class="detail-value" style="font-family:var(--font-mono)">${order.domesticTracking}</div></div>
            <div class="detail-item"><div class="detail-label">快递公司</div><div class="detail-value">${order.domesticCarrier}</div></div>
            <div class="detail-item"><div class="detail-label">跨境物流单号</div><div class="detail-value" style="font-family:var(--font-mono)">${order.crossBorderTracking || '<span style="color:var(--gray-400)">待生成</span>'}</div></div>
            <div class="detail-item"><div class="detail-label">跨境物流商</div><div class="detail-value">${order.crossBorderCarrier || '<span style="color:var(--gray-400)">待分配</span>'}</div></div>
            <div class="detail-item"><div class="detail-label">目的地</div><div class="detail-value">${order.destination}</div></div>
            <div class="detail-item"><div class="detail-label">目的国代码</div><div class="detail-value">${order.destinationCode || '-'}</div></div>
            <div class="detail-item"><div class="detail-label">客户姓名</div><div class="detail-value">${order.customerName}</div></div>
            <div class="detail-item"><div class="detail-label">客户电话</div><div class="detail-value">${order.customerPhone || '-'}</div></div>
            <div class="detail-item"><div class="detail-label">申报价值</div><div class="detail-value" style="color:var(--primary)">$${order.declaredValue.toLocaleString()}</div></div>
            <div class="detail-item"><div class="detail-label">总重量</div><div class="detail-value">${order.weight} kg</div></div>
            <div class="detail-item"><div class="detail-label">报关类别</div><div class="detail-value">${order.customsCategory || '-'}</div></div>
            <div class="detail-item"><div class="detail-label">HS编码</div><div class="detail-value" style="font-family:var(--font-mono)">${order.hsCode || '-'}</div></div>
          </div>
          ${order.notes ? `<div style="margin-top:var(--space-4);padding:var(--space-3);background:var(--warning-50);border-radius:var(--radius-md);font-size:0.875rem"><strong>备注：</strong>${order.notes}</div>` : ''}
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span class="font-semibold">🛃 报关信息</span></div>
        <div class="card-body">
          <div class="detail-item" style="margin-bottom:var(--space-4)">
            <div class="detail-label">报关状态</div>
            <div class="detail-value"><span class="badge ${Utils.customsBadgeClass(order.customsStatus)}">${Utils.customsStatusText(order.customsStatus)}</span></div>
          </div>
          <div class="customs-timeline">
            <div class="timeline-item">
              <div class="timeline-dot done"></div>
              <div class="timeline-content">
                <div class="timeline-title">包裹到达仓库</div>
                <div class="timeline-desc">国内快递包裹已签收入库</div>
                <div class="timeline-time">${Utils.formatDateTime(order.createdAt)}</div>
              </div>
            </div>
            ${order.customsStatus !== 'not_submitted' ? `
            <div class="timeline-item">
              <div class="timeline-dot ${order.customsStatus === 'approved' ? 'done' : ''}"></div>
              <div class="timeline-content">
                <div class="timeline-title">报关资料已提交</div>
                <div class="timeline-desc">等待海关审核</div>
                <div class="timeline-time">${Utils.formatDateTime(order.updatedAt)}</div>
              </div>
            </div>` : ''}
            ${order.customsStatus === 'approved' ? `
            <div class="timeline-item">
              <div class="timeline-dot done"></div>
              <div class="timeline-content">
                <div class="timeline-title">海关审核通过</div>
                <div class="timeline-desc">可以安排出库发货</div>
                <div class="timeline-time">${Utils.formatDateTime(order.updatedAt)}</div>
              </div>
            </div>` : ''}
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="font-semibold">📦 商品明细</span>
        <span class="text-sm text-gray">共 ${order.items.reduce((s,i)=>s+i.qty,0)} 件</span>
      </div>
      <div class="table-container" style="border:none">
        <table class="items-table">
          <thead>
            <tr><th>SKU</th><th>商品名称</th><th>数量</th><th>单价</th><th>重量</th><th>核实状态</th></tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.sku}</td>
                <td class="font-medium">${item.name}</td>
                <td>${item.qty}</td>
                <td>¥${item.price}</td>
                <td>${item.weight} kg</td>
                <td><span class="badge ${item.verified ? 'badge-completed' : 'badge-pending'}">${item.verified ? '✓ 已核实' : '待核实'}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function completeOrder(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;
  Utils.showModal('确认完成', `<p style="text-align:center">确定将订单 <strong>${orderId}</strong> 标记为已完成？</p>`, () => {
    order.status = 'completed';
    order.updatedAt = new Date().toLocaleString('zh-CN').replace(/\//g, '-');
    updatePendingCount();
    renderOrderDetail(orderId);
    Utils.showToast('订单已标记为完成', 'success');
  });
}

function deleteOrder(orderId) {
  Utils.showModal('确认删除', `<p style="text-align:center;color:var(--danger)">确定要删除订单 <strong>${orderId}</strong> 吗？此操作不可撤销。</p>`, () => {
    orders = orders.filter(o => o.id !== orderId);
    updatePendingCount();
    navigateTo('orders');
    Utils.showToast('订单已删除', 'warning');
  });
}

// ---- Customs ----
function renderCustoms(tab) {
  const tabBtns = document.querySelectorAll('#page-customs .tab-btn');
  tabBtns.forEach(b => b.classList.remove('active'));
  tabBtns.forEach(b => { if(b.textContent.includes(tab === 'pending' ? '待报关' : tab === 'submitted' ? '已提交' : '已通过')) b.classList.add('active'); });

  let filtered;
  if (tab === 'pending') filtered = orders.filter(o => o.customsStatus === 'not_submitted' && o.status !== 'pending');
  else if (tab === 'submitted') filtered = orders.filter(o => o.customsStatus === 'submitted');
  else filtered = orders.filter(o => o.customsStatus === 'approved');

  const content = document.getElementById('customs-content');
  if (!filtered.length) {
    content.innerHTML = '<div class="card"><div class="empty-state"><div class="empty-state-icon">🛃</div><div class="empty-state-text">暂无记录</div></div></div>';
    return;
  }

  content.innerHTML = `
    <div class="card">
      <div class="table-container" style="border:none">
        <table>
          <thead>
            <tr><th>订单号</th><th>目的地</th><th>申报价值</th><th>HS编码</th><th>类别</th><th>状态</th><th>操作</th></tr>
          </thead>
          <tbody>
            ${filtered.map(o => `
              <tr>
                <td><a href="#" onclick="navigateTo('order-detail','${o.id}');return false" style="font-family:var(--font-mono);font-weight:600">${o.id}</a></td>
                <td>${o.destination}</td>
                <td>$${o.declaredValue.toLocaleString()}</td>
                <td style="font-family:var(--font-mono)">${o.hsCode || '-'}</td>
                <td>${o.customsCategory || '-'}</td>
                <td><span class="badge ${Utils.customsBadgeClass(o.customsStatus)}">${Utils.customsStatusText(o.customsStatus)}</span></td>
                <td>
                  ${tab === 'pending' ? `<button class="btn btn-primary btn-sm" onclick="submitCustoms('${o.id}')">提交报关</button>` : ''}
                  ${tab === 'submitted' ? `<button class="btn btn-success btn-sm" onclick="approveCustoms('${o.id}')">审核通过</button>` : ''}
                  ${tab === 'approved' ? '<span class="text-xs text-gray">已完成</span>' : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function switchCustomsTab(tab) { renderCustoms(tab); }

function submitCustoms(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;
  Utils.showModal('提交报关', `
    <p style="margin-bottom:var(--space-4)">订单 <strong>${orderId}</strong></p>
    <div class="form-group">
      <label class="form-label">跨境物流商</label>
      <select class="form-select" id="customs-carrier">
        ${MOCK_DATA.logisticsPartners.map(p => `<option value="${p.name}">${p.name} (${p.transitDays}天)</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">报关备注</label>
      <textarea class="form-textarea" id="customs-remarks" placeholder="可选"></textarea>
    </div>
  `, () => {
    const carrier = document.getElementById('customs-carrier').value;
    order.customsStatus = 'submitted';
    order.crossBorderCarrier = carrier;
    order.crossBorderTracking = Utils.generateTracking(carrier);
    order.updatedAt = new Date().toLocaleString('zh-CN').replace(/\//g, '-');
    renderCustoms('pending');
    Utils.showToast(`订单 ${orderId} 报关已提交`, 'success');
  });
}

function approveCustoms(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;
  order.customsStatus = 'approved';
  order.updatedAt = new Date().toLocaleString('zh-CN').replace(/\//g, '-');
  renderCustoms('submitted');
  Utils.showToast(`订单 ${orderId} 报关审核通过`, 'success');
}

// ---- Operators ----
function renderOperators() {
  document.getElementById('operators-table-body').innerHTML = MOCK_DATA.operators.map(op => `
    <tr>
      <td>
        <div class="flex items-center gap-3">
          <div class="operator-avatar" style="background:${op.status==='active'?'linear-gradient(135deg,var(--primary),var(--accent))':'var(--gray-300)'};width:36px;height:36px;font-size:0.8125rem">${op.avatar}</div>
          <span class="font-medium">${op.name}</span>
        </div>
      </td>
      <td style="font-family:var(--font-mono)">${op.id}</td>
      <td><span class="badge badge-info">${op.role === 'warehouse' ? '仓管员' : '报关员'}</span></td>
      <td><strong>${op.todayProcessed}</strong> 单</td>
      <td>
        <div class="flex items-center gap-2">
          <div class="operator-status ${op.status}"></div>
          <span class="text-sm">${op.status === 'active' ? '在线' : '离线'}</span>
        </div>
      </td>
      <td>
        <button class="btn btn-ghost btn-sm">编辑</button>
      </td>
    </tr>
  `).join('');
}

// ---- Logistics ----
function renderLogistics() {
  document.getElementById('logistics-table-body').innerHTML = MOCK_DATA.logisticsPartners.map(p => `
    <tr>
      <td style="font-family:var(--font-mono);font-weight:600">${p.code}</td>
      <td class="font-medium">${p.name}</td>
      <td>${p.transitDays} 个工作日</td>
      <td style="font-family:var(--font-mono)">${p.trackingPrefix}-</td>
      <td><span class="badge badge-completed">● 启用</span></td>
      <td><button class="btn btn-ghost btn-sm">编辑</button></td>
    </tr>
  `).join('');
}

// ---- Reports ----
function renderReports() {
  const stats = Utils.getStats(orders);
  document.getElementById('rpt-total').textContent = stats.total;
  document.getElementById('rpt-value').textContent = `$${Number(stats.totalValue).toLocaleString()}`;
  document.getElementById('rpt-weight').textContent = `${stats.totalWeight} kg`;

  // Destination stats
  const destMap = {};
  orders.forEach(o => { destMap[o.destination] = (destMap[o.destination] || 0) + 1; });
  const destEntries = Object.entries(destMap).sort((a,b) => b[1] - a[1]);
  const maxDest = Math.max(...destEntries.map(e => e[1]));

  document.getElementById('destination-stats').innerHTML = destEntries.map(([dest, count]) => `
    <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3)">
      <span style="width:120px;font-size:0.875rem;font-weight:500">${dest}</span>
      <div style="flex:1;height:24px;background:var(--gray-100);border-radius:var(--radius-full);overflow:hidden">
        <div style="height:100%;width:${(count/maxDest)*100}%;background:linear-gradient(90deg,var(--primary),var(--accent));border-radius:var(--radius-full);transition:width 0.5s"></div>
      </div>
      <span style="width:40px;text-align:right;font-size:0.875rem;font-weight:600">${count}</span>
    </div>
  `).join('');

  // Category stats
  const catMap = {};
  orders.forEach(o => { catMap[o.customsCategory || '未分类'] = (catMap[o.customsCategory || '未分类'] || 0) + 1; });
  const catEntries = Object.entries(catMap).sort((a,b) => b[1] - a[1]);
  const maxCat = Math.max(...catEntries.map(e => e[1]));

  document.getElementById('category-stats').innerHTML = catEntries.map(([cat, count]) => `
    <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3)">
      <span style="width:120px;font-size:0.875rem;font-weight:500">${cat}</span>
      <div style="flex:1;height:24px;background:var(--gray-100);border-radius:var(--radius-full);overflow:hidden">
        <div style="height:100%;width:${(count/maxCat)*100}%;background:linear-gradient(90deg,var(--accent),var(--info));border-radius:var(--radius-full);transition:width 0.5s"></div>
      </div>
      <span style="width:40px;text-align:right;font-size:0.875rem;font-weight:600">${count}</span>
    </div>
  `).join('');
}

// ---- Helpers ----
function updatePendingCount() {
  const count = orders.filter(o => o.status === 'pending').length;
  const el = document.getElementById('pending-count');
  if (el) {
    el.textContent = count;
    el.style.display = count > 0 ? '' : 'none';
  }
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  // Auto-focus username
  document.getElementById('login-username').focus();
  // Enter key on login
  document.getElementById('login-password').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleLogin(e);
  });
});
