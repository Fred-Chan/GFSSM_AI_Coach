(function(){
const G = 9.80665;
const OMEGA2 = Math.pow(2 * Math.PI * 2 / 60, 2);
const X0 = 56, X1 = 660, Y0 = 30, Y1 = 270;
const R_AXIS_MIN = 40, R_AXIS_MAX = 520, N_MIN = 1.0, N_MAX = 3.2;

const nOf = (R, aG) => 9.5493 * Math.sqrt(aG * G / R);
const rMinOf = aG => aG * G / OMEGA2;
const xOf = R => X0 + (R - R_AXIS_MIN) / (R_AXIS_MAX - R_AXIS_MIN) * (X1 - X0);
const yOf = n => Y1 - (n - N_MIN) / (N_MAX - N_MIN) * (Y1 - Y0);

const METRIC = 'background:#fff;border:1px solid var(--line,#E6E9F2);border-radius:8px;padding:7px 10px;min-width:0';
const METRIC_K = 'display:block;font-size:11px;color:var(--muted,#6B7488);white-space:nowrap';
const METRIC_V = 'font-size:17px;font-weight:600;font-variant-numeric:tabular-nums';
const UNIT = 'font-size:11px;font-weight:400;color:var(--muted,#6B7488);margin-left:2px';
const BTN = 'font:inherit;font-size:12px;padding:4px 11px;border:0;border-radius:6px;background:transparent;color:var(--ink-2,#3C455C);cursor:pointer;transition:background .15s,color .15s';

const html = `
<div style="border:1px solid var(--line,#E6E9F2);border-radius:12px;background:var(--surface-2,#FAFBFF);padding:15px 16px 12px;margin:16px 0 0">
  <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px">
    <span style="font-size:13px;color:var(--ink-2,#3C455C)">拖动滑杆：半径一定，转速就被公式算死了</span>
    <span style="display:inline-flex;gap:3px;background:#fff;border:1px solid var(--line,#E6E9F2);border-radius:8px;padding:3px">
      <button type="button" data-gds="gbtn" data-a="0.8" aria-pressed="true" style="${BTN}">0.80 g</button>
      <button type="button" data-gds="gbtn" data-a="0.4" aria-pressed="false" style="${BTN}">0.40 g</button>
    </span>
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-bottom:11px">
    <div style="${METRIC}"><span style="${METRIC_K}">半径 R</span><span style="${METRIC_V}"><span data-gds="R">179</span><span style="${UNIT}">m</span></span></div>
    <div style="${METRIC}"><span style="${METRIC_K}">转速 n</span><span style="${METRIC_V}"><span data-gds="N">2.00</span><span style="${UNIT}">rpm</span></span></div>
    <div style="${METRIC}"><span style="${METRIC_K}">2 rpm 下最小半径</span><span style="${METRIC_V}"><span data-gds="MIN">179</span><span style="${UNIT}">m</span></span></div>
    <div style="${METRIC}" data-gds="badgeCard"><span style="${METRIC_K}">判定</span><span style="${METRIC_V};font-size:14px;display:block;padding-top:2px" data-gds="badge">临界</span></div>
  </div>
  <input type="range" data-gds="range" min="60" max="500" step="1" value="179" aria-label="居住地板到轴心的半径（米），可拖动" style="width:100%;accent-color:var(--blue,#2F5BEA);height:20px;cursor:pointer;margin:0 0 6px">
  <svg viewBox="0 0 680 320" width="100%" role="img" aria-label="半径与转速的对应曲线，虚线为 2 rpm 舒适上限">
    <defs><clipPath id="gdsClip"><rect x="56" y="30" width="604" height="240"></rect></clipPath></defs>
    <rect x="56" y="30" width="604" height="131" fill="#FCEDEC" opacity=".6"></rect>
    <rect x="56" y="161" width="604" height="109" fill="#E9F7F0" opacity=".7"></rect>
    <g data-gds="grid"></g>
    <line x1="56" y1="270" x2="660" y2="270" stroke="#C9CFDD" stroke-width="1"></line>
    <line x1="56" y1="30" x2="56" y2="270" stroke="#C9CFDD" stroke-width="1"></line>
    <g data-gds="ticks"></g>
    <line x1="56" y1="161" x2="660" y2="161" stroke="#D0453F" stroke-width="1.3" stroke-dasharray="6 4"></line>
    <text x="654" y="153" text-anchor="end" font-size="10.5" fill="#D0453F">2 rpm 舒适上限</text>
    <text x="170" y="46" font-size="10.5" fill="#B4433D">转速过高：头晕、恶心</text>
    <text x="654" y="262" text-anchor="end" font-size="10.5" fill="#1E7C5A">舒适区</text>
    <path data-gds="curve" fill="none" stroke="#2F5BEA" stroke-width="2.4" clip-path="url(#gdsClip)"></path>
    <g data-gds="dyn"></g>
    <text x="358" y="304" text-anchor="middle" font-size="11" fill="#3C455C">居住地板到轴心的半径 R（m）</text>
    <text x="18" y="150" text-anchor="middle" font-size="11" fill="#3C455C" transform="rotate(-90 18 150)">转速 n（rpm）</text>
  </svg>
  <p data-gds="hint" style="font-size:12.5px;line-height:1.7;color:var(--ink-2,#3C455C);background:#fff;border:1px solid var(--line,#E6E9F2);border-radius:8px;padding:8px 10px;margin:8px 0 0"></p>
</div>`;

function init(el){
  const q = k => el.querySelector('[data-gds="' + k + '"]');
  const qa = k => Array.prototype.slice.call(el.querySelectorAll('[data-gds="' + k + '"]'));
  const state = { aG: 0.8, R: 179 };

  const grid = [], ticks = [];
  [1.5, 2.0, 2.5, 3.0].forEach(n => {
    grid.push('<line x1="56" y1="' + yOf(n).toFixed(1) + '" x2="660" y2="' + yOf(n).toFixed(1) + '" stroke="#EFF2F8" stroke-width="1"></line>');
  });
  [100, 150, 200, 250, 300, 350, 400, 450, 500].forEach(R => {
    grid.push('<line x1="' + xOf(R).toFixed(1) + '" y1="30" x2="' + xOf(R).toFixed(1) + '" y2="270" stroke="#F4F6FB" stroke-width="1"></line>');
    ticks.push('<text x="' + xOf(R).toFixed(1) + '" y="286" text-anchor="middle" font-size="10.5" fill="#6B7488">' + R + '</text>');
  });
  [1.0, 1.5, 2.0, 2.5, 3.0].forEach(n => {
    ticks.push('<text x="50" y="' + (yOf(n) + 3.5).toFixed(1) + '" text-anchor="end" font-size="10.5" fill="#6B7488">' + n.toFixed(1) + '</text>');
  });
  q('grid').innerHTML = grid.join('');
  q('ticks').innerHTML = ticks.join('');

  function render(){
    const aG = state.aG, R = state.R;
    const n = nOf(R, aG);
    const rMin = rMinOf(aG);

    let d = '';
    for (let r = R_AXIS_MIN; r <= R_AXIS_MAX; r += 2){
      d += (d ? ' L' : 'M') + xOf(r).toFixed(1) + ' ' + yOf(nOf(r, aG)).toFixed(1);
    }
    q('curve').setAttribute('d', d);

    let svg = '';
    [100, 150, 200, 300, 400].forEach(r => {
      const v = nOf(r, aG);
      if (v > N_MAX || v < N_MIN) return;
      if (Math.abs(r - rMin) < 26) return;
      const x = xOf(r), y = yOf(v);
      const col = v > 2 ? '#D0453F' : '#1E9E6A';
      svg += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4" fill="#fff" stroke="' + col + '" stroke-width="1.6"></circle>';
      svg += '<text x="' + x.toFixed(1) + '" y="' + (y - 9).toFixed(1) + '" text-anchor="middle" font-size="9.5" fill="' + col + '">' + r + '</text>';
      svg += '<text x="' + x.toFixed(1) + '" y="' + (y + 16).toFixed(1) + '" text-anchor="middle" font-size="9.5" fill="' + col + '">' + v.toFixed(2) + '</text>';
    });

    const mx = xOf(rMin), my = yOf(2);
    svg += '<circle cx="' + mx.toFixed(1) + '" cy="' + my.toFixed(1) + '" r="9" fill="none" stroke="#C78318" stroke-width="1.5"></circle>';
    svg += '<text x="' + mx.toFixed(1) + '" y="' + (my - 12).toFixed(1) + '" text-anchor="middle" font-size="9.5" font-weight="600" fill="#C78318">R_min</text>';

    const cx = xOf(R), cy = yOf(n);
    svg += '<line x1="' + cx.toFixed(1) + '" y1="' + cy.toFixed(1) + '" x2="' + cx.toFixed(1) + '" y2="270" stroke="#A8B6D8" stroke-width="1" stroke-dasharray="4 3"></line>';
    svg += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="7" fill="#fff" stroke="#2F5BEA" stroke-width="2.4"></circle>';
    q('dyn').innerHTML = svg;

    q('R').textContent = R;
    q('N').textContent = n.toFixed(2);
    q('MIN').textContent = Math.round(rMin);

    const card = q('badgeCard'), badge = q('badge'), hint = q('hint');
    const gLabel = aG.toFixed(2) + ' g';
    if (n > 2.02){
      card.style.background = '#FCEDEC'; card.style.borderColor = '#F3CFCD';
      badge.style.color = '#D0453F'; badge.textContent = '超出上限';
      hint.innerHTML = '<b>超出 2 rpm 舒适上限。</b>在 ' + gLabel + ' 要求下，这个半径不可取：多数人会头晕、转身时恶心、物体“拐弯”下落。想保持这个半径，只能降低目标重力。';
    } else if (n > 1.96){
      card.style.background = '#FDF4E4'; card.style.borderColor = '#F0DDB8';
      badge.style.color = '#C78318'; badge.textContent = '临界';
      hint.innerHTML = '<b>正卡在 2 rpm 上。</b>这是 ' + gLabel + ' 允许的最小半径（约 ' + Math.round(rMin) + ' m）：结构最省，但舒适度没有余量——方案里必须解释为什么敢取这个值。';
    } else {
      card.style.background = '#E9F7F0'; card.style.borderColor = '#C6E8D8';
      badge.style.color = '#1E9E6A'; badge.textContent = '舒适区';
      hint.innerHTML = '<b>在舒适区内，代价转到结构侧。</b>半径越大越舒服，但环体周长、壳体面积、屏蔽质量都按 R 增长，结构质量与造价随之上升——这就是要写进 trade-off 的那一头。';
    }
  }

  qa('gbtn').forEach(btn => {
    btn.addEventListener('click', () => {
      qa('gbtn').forEach(b => {
        b.setAttribute('aria-pressed', 'false');
        b.style.background = 'transparent';
        b.style.color = 'var(--ink-2,#3C455C)';
      });
      btn.setAttribute('aria-pressed', 'true');
      btn.style.background = 'var(--blue,#2F5BEA)';
      btn.style.color = '#fff';
      state.aG = parseFloat(btn.dataset.a);
      const rMin = rMinOf(state.aG);
      state.R = Math.round(Math.min(500, Math.max(60, rMin)));
      q('range').value = state.R;
      render();
    });
  });

  const first = q('gbtn');
  if (first){
    first.style.background = 'var(--blue,#2F5BEA)';
    first.style.color = '#fff';
  }
  q('range').addEventListener('input', e => {
    state.R = parseInt(e.target.value, 10);
    render();
  });
  render();
}

window.ANATOMY_FIGURES = window.ANATOMY_FIGURES || {};
window.ANATOMY_FIGURES['gravity-design-space'] = { html: html, init: init };
})();
