// Colibri Goals Dashboard — app.js

document.addEventListener('DOMContentLoaded', () => {
  const data = window.COLIBRI_DATA;
  if (!data) {
    document.getElementById('app').innerHTML = '<div class="no-data">データなし</div>';
    return;
  }

  // Default to latest quarter
  let currentQIdx = data.quarters.length - 1;

  renderQuarterTabs(data.quarters, currentQIdx);
  renderQuarter(data.quarters[currentQIdx]);

  document.getElementById('quarter-tabs').addEventListener('click', (e) => {
    const tab = e.target.closest('.quarter-tab');
    if (!tab) return;
    const idx = parseInt(tab.dataset.index);
    currentQIdx = idx;
    document.querySelectorAll('.quarter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderQuarter(data.quarters[idx]);
  });
});

// ===== Quarter Tabs =====
function renderQuarterTabs(quarters, activeIdx) {
  const nav = document.getElementById('quarter-tabs');
  nav.innerHTML = quarters.map((q, i) =>
    `<button class="quarter-tab ${i === activeIdx ? 'active' : ''}" data-index="${i}">${q.label}</button>`
  ).join('');
}

// ===== Main Render =====
function renderQuarter(q) {
  renderQGoals(q);
  renderMonthGoals(q);
  renderReview(q);
}

// ===== Q Goals =====
function renderQGoals(q) {
  const el = document.getElementById('q-goals-content');
  document.querySelector('#q-goals .card-title').textContent = `クォーター目標 — ${q.period}`;

  let html = '';

  // Team goals if available
  if (q.teamGoals && q.teamGoals.length) {
    html += '<div class="q-category-label" style="font-size:0.85rem;color:#888;margin-bottom:4px;">チーム目標</div>';
    html += '<div class="q-category" style="margin-bottom:16px;padding:12px;background:#f8f8f8;border-radius:8px;">';
    for (const g of q.teamGoals) {
      html += `<div class="q-goal">
        <span class="q-goal-icon">👥</span>
        <span class="q-goal-text" style="color:#666;">${g.text}</span>
      </div>`;
    }
    html += '</div>';
    html += '<div class="q-category-label" style="font-size:0.85rem;color:#888;margin-bottom:4px;">個人目標</div>';
  }

  html += '<div class="q-category">';

  for (const g of q.goals) {
    const icon = getResultIcon(g.result);
    const resultCls = g.result || 'pending';
    const resultLabel = getResultLabel(g.result);
    const noteHtml = g.note ? `<span class="q-goal-result ${resultCls}">${g.note}</span>` : '';
    const resultBadge = g.result ? `<span class="q-goal-result ${resultCls}">${resultLabel}</span>` : '';

    html += `<div class="q-goal">
      <span class="q-goal-icon">${icon}</span>
      <span>
        <span class="q-goal-text">${g.text}</span>
        ${resultBadge}
        ${noteHtml ? '<br>' + noteHtml : ''}
      </span>
    </div>`;
  }

  html += '</div>';

  // Monthly rates if available
  if (q.monthlyRates && q.monthlyRates.length) {
    html += '<div style="display:flex;gap:12px;margin-top:16px;">';
    for (const mr of q.monthlyRates) {
      const cls = mr.rate >= 80 ? 'high' : mr.rate >= 60 ? 'mid' : 'low';
      html += `<div class="review-achievement ${cls}">${mr.month}: ${mr.rate}%</div>`;
    }
    html += '</div>';
  }

  el.innerHTML = html;
}

// ===== Month Goals =====
function renderMonthGoals(q) {
  const titleEl = document.getElementById('month-goals-title');
  const el = document.getElementById('month-goals-content');

  if (!q.months || !q.months.length) {
    titleEl.textContent = '月間目標';
    el.innerHTML = '<div class="no-data">月間目標なし</div>';
    document.getElementById('month-goals').style.display = 'none';
    return;
  }

  document.getElementById('month-goals').style.display = '';
  const month = q.months[q.months.length - 1];
  titleEl.textContent = `月間目標 — ${month.month}`;

  let html = '<div class="month-cat">';
  for (const g of month.goals) {
    html += `<div class="month-goal-item">${g}</div>`;
  }
  html += '</div>';

  // Month tabs if multiple
  if (q.months.length > 1) {
    html += '<div class="month-tabs">';
    for (const m of q.months) {
      html += `<button class="quarter-tab">${m.month}</button>`;
    }
    html += '</div>';
  }

  el.innerHTML = html;
}

// ===== Review =====
function renderReview(q) {
  const el = document.getElementById('review-content');

  if (!q.review) {
    el.innerHTML = '<div class="no-data" style="font-style:italic;">進行中</div>';
    return;
  }

  let html = `<div class="review-section">
    <div class="review-text">${q.review}</div>
  </div>`;

  el.innerHTML = html;
}

// ===== Helpers =====
function getResultIcon(result) {
  switch (result) {
    case 'achieved': return '✅';
    case 'partial': return '🔶';
    case 'missed': return '❌';
    default: return '🎯';
  }
}

function getResultLabel(result) {
  switch (result) {
    case 'achieved': return '達成';
    case 'partial': return '一部達成';
    case 'missed': return '未達';
    default: return '';
  }
}
