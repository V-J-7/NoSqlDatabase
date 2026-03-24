import { useState, useEffect } from "react";

const API_BASE = "http://localhost:8080/api";

const theme = {
  bg:          "#07070f",
  surface:     "#0f0f1c",
  surfaceAlt:  "#161628",
  border:      "#2a2a45",
  cyan:        "#00f0ff",
  magenta:     "#ff2d78",
  purple:      "#7c3aff",
  green:       "#00ffaa",
  yellow:      "#ffe94d",
  textPrimary: "#eeeeff",
  textMuted:   "#7070a0",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@500;700;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 16px; }

  body {
    background: ${theme.bg};
    color: ${theme.textPrimary};
    font-family: 'Share Tech Mono', monospace;
    min-height: 100vh;
  }

  .grid-bg {
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(124,58,255,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124,58,255,0.06) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none; z-index: 0;
  }

  .scan-line {
    position: fixed; inset: 0;
    background: repeating-linear-gradient(
      0deg, transparent, transparent 3px,
      rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px
    );
    pointer-events: none; z-index: 9999;
  }

  .app { position: relative; z-index: 1; }

  .header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 22px 48px;
    border-bottom: 1px solid ${theme.border};
    background: rgba(7,7,15,0.92);
    backdrop-filter: blur(12px);
    position: sticky; top: 0; z-index: 100;
  }

  .logo {
    font-family: 'Orbitron', monospace;
    font-weight: 900;
    font-size: 26px;
    letter-spacing: 4px;
    background: linear-gradient(90deg, ${theme.cyan}, ${theme.purple}, ${theme.magenta});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .header-right { display: flex; align-items: center; gap: 12px; }

  .status-label {
    font-size: 13px; letter-spacing: 3px;
    color: ${theme.textMuted}; text-transform: uppercase;
  }

  .status-dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: ${theme.green};
    box-shadow: 0 0 10px ${theme.green};
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }

  .metrics-wrap { padding: 32px 48px 0; }

  .section-heading {
    font-family: 'Orbitron', monospace;
    font-size: 13px; font-weight: 700;
    letter-spacing: 5px; color: ${theme.textMuted};
    text-transform: uppercase;
    margin-bottom: 18px;
    display: flex; align-items: center; gap: 10px;
  }

  .section-heading::before { content: '//'; color: ${theme.purple}; font-size: 15px; }

  .metrics-card {
    background: ${theme.surface};
    border: 1px solid ${theme.border};
    padding: 28px 32px;
    position: relative; overflow: hidden;
  }

  .metrics-card::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, ${theme.purple}, ${theme.cyan});
  }

  .empty-metrics {
    text-align: center; padding: 32px;
    font-size: 15px; letter-spacing: 3px; color: ${theme.textMuted};
    border: 1px dashed ${theme.border};
  }

  .metric-group { margin-bottom: 24px; }
  .metric-group:last-child { margin-bottom: 0; }

  .metric-group-label {
    font-size: 13px; letter-spacing: 3px;
    color: ${theme.textMuted}; text-transform: uppercase; margin-bottom: 10px;
  }

  .bar-row { display: flex; align-items: center; gap: 14px; margin-bottom: 8px; }

  .bar-name {
    font-size: 13px; letter-spacing: 2px;
    color: ${theme.textMuted}; width: 130px; flex-shrink: 0;
  }

  .bar-track { flex: 1; height: 14px; background: rgba(255,255,255,0.05); overflow: hidden; }

  .bar-fill { height: 100%; transition: width 0.7s cubic-bezier(0.16,1,0.3,1); }

  .bar-ms {
    font-size: 15px; font-family: 'Orbitron', monospace; font-weight: 700;
    width: 80px; text-align: right; flex-shrink: 0;
  }

  .size-display {
    display: flex; align-items: center; gap: 18px; margin-top: 22px;
    padding: 18px 24px;
    background: rgba(124,58,255,0.08);
    border: 1px solid ${theme.border};
  }

  .size-item {
    display: flex; align-items: center; gap: 10px;
  }

  .size-label {
    font-size: 12px; letter-spacing: 2px;
    color: ${theme.textMuted}; text-transform: uppercase;
  }

  .size-value {
    font-family: 'Orbitron', monospace;
    font-size: 20px; font-weight: 700;
  }

  .tabs {
    display: flex; padding: 0 48px;
    border-bottom: 1px solid ${theme.border};
    background: ${theme.surface}; margin-top: 28px;
  }

  .tab {
    display: flex; align-items: center; gap: 8px;
    padding: 18px 32px;
    background: none; border: none;
    font-family: 'Orbitron', monospace;
    font-size: 14px; font-weight: 700; letter-spacing: 3px;
    text-transform: uppercase; cursor: pointer;
    color: ${theme.textMuted};
    border-bottom: 3px solid transparent;
    transition: color 0.2s, border-color 0.2s;
  }

  .tab:hover { color: ${theme.textPrimary}; }
  .tab.active-no  { color: ${theme.magenta}; border-bottom-color: ${theme.magenta}; }
  .tab.active-idx { color: ${theme.cyan};    border-bottom-color: ${theme.cyan}; }

  .tab-dot { width: 8px; height: 8px; border-radius: 50%; }

  .main { padding: 36px 48px; }

  .card {
    background: ${theme.surface};
    border: 1px solid ${theme.border};
    padding: 28px;
    position: relative; overflow: hidden;
    transition: border-color 0.25s;
  }

  .card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent, ${theme.purple}), transparent);
    opacity: 0; transition: opacity 0.25s;
  }

  .card:hover { border-color: var(--accent, ${theme.purple}); }
  .card:hover::before { opacity: 1; }

  .card-title {
    font-family: 'Orbitron', monospace;
    font-size: 15px; font-weight: 700; letter-spacing: 4px;
    color: var(--accent, ${theme.purple});
    text-transform: uppercase; margin-bottom: 22px;
    display: flex; align-items: center; gap: 8px;
  }

  .card-title::before { content: '//'; opacity: 0.5; font-size: 13px; }

  .field { margin-bottom: 18px; }

  .field-label {
    display: block; font-size: 13px; letter-spacing: 3px;
    color: ${theme.textMuted}; text-transform: uppercase; margin-bottom: 8px;
  }

  .field-input {
    width: 100%;
    background: ${theme.bg};
    border: 1px solid ${theme.border};
    color: ${theme.textPrimary};
    font-family: 'Share Tech Mono', monospace;
    font-size: 16px; padding: 13px 16px; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .field-input::placeholder { color: ${theme.textMuted}; opacity: 0.6; }

  .field-input:focus {
    border-color: ${theme.cyan};
    box-shadow: 0 0 0 1px ${theme.cyan}33, 0 0 16px ${theme.cyan}18;
  }

  .field-input.err {
    border-color: ${theme.magenta};
    box-shadow: 0 0 0 1px ${theme.magenta}33;
  }

  .field-err { font-size: 13px; color: ${theme.magenta}; margin-top: 6px; letter-spacing: 1px; }

  .kv-row {
    display: grid; grid-template-columns: 1fr 1fr 44px;
    gap: 8px; margin-bottom: 10px; align-items: start;
  }

  .kv-remove {
    height: 48px; background: none;
    border: 1px solid ${theme.border};
    color: ${theme.magenta}; font-size: 20px; cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    display: flex; align-items: center; justify-content: center;
  }

  .kv-remove:hover { background: ${theme.magenta}22; border-color: ${theme.magenta}; }

  .kv-add {
    width: 100%; background: none;
    border: 1px dashed ${theme.border};
    color: ${theme.textMuted};
    font-family: 'Share Tech Mono', monospace;
    font-size: 14px; letter-spacing: 2px;
    padding: 12px; cursor: pointer;
    transition: border-color 0.2s, color 0.2s; margin-top: 4px;
  }

  .kv-add:hover { border-color: ${theme.purple}; color: ${theme.purple}; }

  .btn {
    background: none;
    border: 2px solid var(--btn-color, ${theme.purple});
    color: var(--btn-color, ${theme.cyan});
    font-family: 'Orbitron', monospace;
    font-size: 13px; font-weight: 700; letter-spacing: 3px;
    padding: 14px 32px; cursor: pointer; text-transform: uppercase;
    position: relative; overflow: hidden;
    transition: color 0.2s;
    clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
  }

  .btn::before {
    content: ''; position: absolute; inset: 0;
    background: var(--btn-color, ${theme.purple});
    transform: translateX(-100%); transition: transform 0.2s; z-index: -1;
  }

  .btn:hover { color: #000; }
  .btn:hover::before { transform: translateX(0); }
  .btn:disabled { opacity: 0.38; cursor: not-allowed; pointer-events: none; }

  .divider { border: none; border-top: 1px solid ${theme.border}; margin: 22px 0; }

  .response-block {
    background: ${theme.bg}; border: 1px solid ${theme.border};
    padding: 18px 20px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 15px; line-height: 1.9;
    max-height: 340px; overflow-y: auto;
    color: ${theme.cyan}; white-space: pre-wrap; word-break: break-all;
  }

  .response-block::-webkit-scrollbar { width: 4px; }
  .response-block::-webkit-scrollbar-track { background: ${theme.surface}; }
  .response-block::-webkit-scrollbar-thumb { background: ${theme.purple}; }

  .badge {
    display: inline-block; padding: 3px 10px;
    font-size: 12px; letter-spacing: 2px;
    border: 1px solid; text-transform: uppercase;
  }

  .badge-cyan { color: ${theme.cyan}; border-color: ${theme.cyan}44; background: ${theme.cyan}11; }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }

  .toast {
    position: fixed; bottom: 36px; right: 36px;
    background: ${theme.surfaceAlt};
    border-left: 4px solid var(--tc, ${theme.green});
    padding: 16px 22px; font-size: 15px; letter-spacing: 1px;
    min-width: 280px; max-width: 400px;
    animation: slide-in 0.3s ease, fade-out 0.3s ease 2.7s forwards;
    z-index: 2000; display: flex; align-items: center; gap: 10px;
  }

  .toast-icon { font-size: 18px; color: var(--tc, ${theme.green}); }

  @keyframes slide-in {
    from { transform: translateX(110%); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  }
  @keyframes fade-out { from{opacity:1} to{opacity:0;pointer-events:none} }

  .s-key { color: ${theme.purple}; }
  .s-str { color: ${theme.green};  }
  .s-num { color: ${theme.yellow}; }
`;

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = (msg, type = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(x => x.id !== id)), 3000);
  };
  return { toasts, add };
}

function prettyJson(obj) {
  if (!obj || !obj.data) return "";

  const dataEntries = Object.values(obj.data);
  let result = dataEntries.map(item => ({
    username: item.entry?.username
  }));

  if (result.length === 1) {
    result = result[0];
  }

  const finalOutput = { 
    data: result, 
    status: "success" 
  };

  return JSON.stringify(finalOutput, null, 2)
    .replace(/"([^"]+)":/g, '<span class="s-key">"$1"</span>:')
    .replace(/: "([^"]*)"/g, ': <span class="s-str">"$1"</span>')
    .replace(/: (\d+)/g,    ': <span class="s-num">$1</span>');
}

async function apiFetch(url, opts = {}) {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...opts });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

function KVBuilder({ pairs, onChange }) {
  const update = (i, field, val) =>
    onChange(pairs.map((p, idx) => (idx === i ? { ...p, [field]: val } : p)));
  const remove = (i) => onChange(pairs.filter((_, idx) => idx !== i));
  const add    = ()  => onChange([...pairs, { key: "", value: "" }]);

  return (
    <div>
      {pairs.map((p, i) => (
        <div className="kv-row" key={i}>
          <input className="field-input" placeholder="key"
            value={p.key} onChange={e => update(i, "key", e.target.value)} />
          <input className="field-input" placeholder="value"
            value={p.value} onChange={e => update(i, "value", e.target.value)} />
          <button className="kv-remove" onClick={() => remove(i)}>×</button>
        </div>
      ))}
      <button className="kv-add" onClick={add}>+ ADD FIELD</button>
    </div>
  );
}

function BulkBuilder({ docs, onChange }) {
  const addDoc = () => onChange([...docs, [{ key: "", value: "" }]]);

  const removeDoc = (di) => onChange(docs.filter((_, i) => i !== di));

  const updatePair = (di, pi, field, val) =>
    onChange(docs.map((pairs, i) =>
      i === di ? pairs.map((p, j) => j === pi ? { ...p, [field]: val } : p) : pairs
    ));

  const addPair = (di) =>
    onChange(docs.map((pairs, i) => i === di ? [...pairs, { key: "", value: "" }] : pairs));

  const removePair = (di, pi) =>
    onChange(docs.map((pairs, i) =>
      i === di ? pairs.filter((_, j) => j !== pi) : pairs
    ));

  return (
    <div>
      {docs.map((pairs, di) => (
        <div key={di} style={{
          background: `rgba(124,58,255,0.05)`,
          border: `1px solid ${theme.border}`,
          padding: "16px",
          marginBottom: "12px",
          position: "relative",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: "12px",
          }}>
            <span style={{
              fontFamily: "'Orbitron', monospace", fontSize: "12px",
              letterSpacing: "3px", color: theme.purple,
            }}>
              DOC {di + 1}
            </span>
            {docs.length > 1 && (
              <button
                onClick={() => removeDoc(di)}
                style={{
                  background: "none", border: `1px solid ${theme.border}`,
                  color: theme.magenta, fontSize: "13px", padding: "4px 10px",
                  cursor: "pointer", fontFamily: "'Share Tech Mono', monospace",
                  letterSpacing: "1px",
                }}
              >
                REMOVE DOC
              </button>
            )}
          </div>

          {pairs.map((p, pi) => (
            <div className="kv-row" key={pi}>
              <input className="field-input" placeholder="key"
                value={p.key} onChange={e => updatePair(di, pi, "key", e.target.value)} />
              <input className="field-input" placeholder="value"
                value={p.value} onChange={e => updatePair(di, pi, "value", e.target.value)} />
              <button className="kv-remove"
                onClick={() => pairs.length > 1 && removePair(di, pi)}
                style={{ opacity: pairs.length === 1 ? 0.3 : 1 }}>×</button>
            </div>
          ))}
          <button className="kv-add" onClick={() => addPair(di)}>+ ADD FIELD</button>
        </div>
      ))}

      <button
        onClick={addDoc}
        style={{
          width: "100%", background: "none",
          border: `1px dashed ${theme.purple}`,
          color: theme.purple,
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "14px", letterSpacing: "2px",
          padding: "13px", cursor: "pointer",
          transition: "background 0.2s",
        }}
        onMouseEnter={e => e.target.style.background = `${theme.purple}15`}
        onMouseLeave={e => e.target.style.background = "none"}
      >
        + ADD DOCUMENT
      </button>
    </div>
  );
}

function MetricsPanel({ metrics, dbSizes }) {
  const { insertNoIndex, insertWithIndex, readNoIndex, readWithIndex } = metrics;
  const hasAny = [insertNoIndex, insertWithIndex, readNoIndex, readWithIndex].some(v => v != null);

  const Row = ({ label, val, color }) => {
    const pct = val != null ? Math.min((val / 1000) * 100, 100) : 0;
    return (
      <div className="bar-row">
        <span className="bar-name">{label}</span>
        <div className="bar-track">
          <div className="bar-fill"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
        </div>
        <span className="bar-ms" style={{ color }}>{val != null ? `${val}ms` : "—"}</span>
      </div>
    );
  };

  return (
    <div className="metrics-wrap">
      <div className="section-heading">Performance Metrics</div>
      <div className="metrics-card">
        {!hasAny ? (
          <div className="empty-metrics">NO METRICS YET — PERFORM AN OPERATION</div>
        ) : (
          <>
            <div className="metric-group">
              <div className="metric-group-label">Insert Response Time</div>
              <Row label="NO INDEX"   val={insertNoIndex}   color={theme.magenta} />
              <Row label="WITH INDEX" val={insertWithIndex} color={theme.cyan}    />
            </div>
            <div className="metric-group">
              <div className="metric-group-label">Read Response Time</div>
              <Row label="NO INDEX"   val={readNoIndex}   color={theme.magenta} />
              <Row label="WITH INDEX" val={readWithIndex} color={theme.cyan}    />
            </div>
          </>
        )}
        
        <div className="size-display">
          <div className="size-item">
            <span className="size-label">No Index Entries:</span>
            <span className="size-value" style={{ color: theme.magenta }}>
              {dbSizes.noIndex ?? "—"}
            </span>
          </div>
          <div style={{ width: "1px", height: "24px", background: theme.border }} />
          <div className="size-item">
            <span className="size-label">With Index Entries:</span>
            <span className="size-value" style={{ color: theme.cyan }}>
              {dbSizes.withIndex ?? "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NoIndexTab({ toast, onMetric, refreshSizes }) {
  const [searchKey,  setSearchKey]  = useState("");
  const [searchValue,  setSearchValue]  = useState("");
  const [searchErrors, setSearchErrors] = useState({});
  const [searchResult,  setSearchResult]  = useState(null);
  const [searchBusy, setSearchBusy] = useState(false);
  const [numberOfSearches, setNumberOfSearches] = useState(1);
  const [averageSearchTime, setAverageSearchTime] = useState(0.0);

  const [allSize,    setAllSize]    = useState("10");
  const [allSizeErr, setAllSizeErr] = useState("");
  const [allRes,     setAllRes]     = useState(null);
  const [allBusy,    setAllBusy]    = useState(false);

  const [bulkDocs,  setBulkDocs]  = useState([[{ key: "", value: "" }]]);
  const [bulkErr,   setBulkErr]   = useState("");
  const [bulkRes,   setBulkRes]   = useState(null);
  const [bulkBusy,  setBulkBusy]  = useState(false);

  const handleSearch = async () => {
    const errs = {};
    if (!searchKey.trim()) errs.key = "Key is required";
    if (!searchValue.trim()) errs.val = "Value is required";
    if (Object.keys(errs).length) { setSearchErrors(errs); return; }
    setSearchErrors({}); 
    setSearchBusy(true);
    try {
      const data = await apiFetch(`${API_BASE}/get?key=${encodeURIComponent(searchKey)}&value=${encodeURIComponent(searchValue)}`);
      setSearchResult(data); 
      const newAverage = ((numberOfSearches - 1)*averageSearchTime+data.response_time)/(numberOfSearches);
      setNumberOfSearches(numberOfSearches+1);
      onMetric("readNoIndex", newAverage.toFixed(2));
      setAverageSearchTime(newAverage);
      toast.add(`Searched in ${data.response_time}ms`, "info");
    } catch (e) {
       toast.add(e.message, "error"); 
    } finally { 
      setSearchBusy(false); 
    }
  };

  const handleGetAll = async () => {
    if (!allSize || isNaN(allSize) || Number(allSize) < 1) {
      setAllSizeErr("Must be a positive number"); return;
    }
    setAllSizeErr(""); setAllBusy(true);
    try {
      const data = await apiFetch(`${API_BASE}/get-all?size=${allSize}`);
      setAllRes(data); toast.add("Entries fetched", "info");
    } catch (e) { toast.add(e.message, "error"); }
    finally { setAllBusy(false); }
  };

  const handleBulk = async () => {
    const invalid = bulkDocs.some(doc =>
      doc.length === 0 || doc.some(p => !p.key.trim() || !p.value.trim())
    );
    if (invalid) { setBulkErr("All fields in every document must be filled."); return; }
    setBulkErr(""); setBulkBusy(true);
    try {
      const body = bulkDocs.map(doc =>
        Object.fromEntries(doc.map(p => [p.key.trim(), p.value.trim()]))
      );
      const data = await apiFetch(`${API_BASE}/insert-all`, { method: "POST", body: JSON.stringify(body) });
      setBulkRes(data.data); 
      onMetric("insertNoIndex", data.response_time);
      toast.add(`${bulkDocs.length} docs inserted in ${data.response_time}ms`);
      refreshSizes();
    } catch (e) { toast.add(e.message, "error"); }
    finally { setBulkBusy(false); }
  };

  return (
    <div>
      <div className="grid-2" style={{ marginBottom: 22 }}>

        <div className="card" style={{ "--accent": theme.purple }}>
          <div className="card-title">Search by Key-Value</div>
          <div className="field">
            <label className="field-label">Key</label>
            <input className={`field-input ${searchErrors.key ? "err" : ""}`}
              value={searchKey} onChange={e => setSearchKey(e.target.value)} placeholder="e.g. username" />
            {searchErrors.key && <div className="field-err">{searchErrors.key}</div>}
          </div>
          <div className="field">
            <label className="field-label">Value</label>
            <input className={`field-input ${searchErrors.val ? "err" : ""}`}
              value={searchValue} onChange={e => setSearchValue(e.target.value)} placeholder="e.g. john_doe" />
            {searchErrors.val && <div className="field-err">{searchErrors.val}</div>}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn" onClick={handleSearch} disabled={searchBusy}
              style={{ "--btn-color": theme.green }}>
              {searchBusy ? "SCANNING..." : "SEARCH"}
            </button>
          </div>
          {searchResult && (<><hr className="divider" />
            <div className="card-title" style={{ fontSize: 13 }}>Results</div>
            <div className="response-block" dangerouslySetInnerHTML={{ __html: prettyJson(searchResult) }}/>
          </>)}
        </div>

        <div className="card" style={{ "--accent": theme.cyan }}>
          <div className="card-title">Fetch N Entries</div>
          <div className="field">
            <label className="field-label">Page Size</label>
            <input className={`field-input ${allSizeErr ? "err" : ""}`}
              type="number" min="1" value={allSize} onChange={e => setAllSize(e.target.value)} />
            {allSizeErr && <div className="field-err">{allSizeErr}</div>}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn" onClick={handleGetAll} disabled={allBusy}
              style={{ "--btn-color": theme.cyan }}>
              {allBusy ? "LOADING..." : "FETCH ALL"}
            </button>
          </div>
          {allRes && (<><hr className="divider" />
            <div className="response-block" dangerouslySetInnerHTML={{ __html: prettyJson(allRes) }} />
          </>)}
        </div>

      </div>

      <div className="card" style={{ "--accent": theme.magenta }}>
        <div className="card-title">Bulk Insert</div>
        <BulkBuilder docs={bulkDocs} onChange={setBulkDocs} />
        {bulkErr && <div className="field-err" style={{ marginTop: 10 }}>{bulkErr}</div>}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
          <button className="btn" onClick={handleBulk} disabled={bulkBusy}
            style={{ "--btn-color": theme.magenta }}>
            {bulkBusy ? "WRITING..." : `INSERT ${bulkDocs.length} DOC${bulkDocs.length !== 1 ? "S" : ""}`}
          </button>
        </div>
        {bulkRes && (<><hr className="divider" />
          <div className="response-block" dangerouslySetInnerHTML={{ __html: prettyJson(bulkRes) }} />
        </>)}
      </div>
    </div>
  );
}

function WithIndexTab({ toast, onMetric, refreshSizes }) {
  const [username,   setUsername]   = useState("");
  const [userErr,    setUserErr]    = useState("");
  const [searchRes,  setSearchRes]  = useState(null);
  const [searchBusy, setSearchBusy] = useState(false);
  const [numberOfSearches, setNumberOfSearches] = useState(1);
  const [averageSearchTime, setAverageSearchTime] = useState(0.0);

  const [allSize,    setAllSize]    = useState("10");
  const [allSizeErr, setAllSizeErr] = useState("");
  const [allRes,     setAllRes]     = useState(null);
  const [allBusy,    setAllBusy]    = useState(false);

  const [bulkDocs,  setBulkDocs]  = useState([[{ key: "", value: "" }]]);
  const [bulkErr,   setBulkErr]   = useState("");
  const [bulkRes,   setBulkRes]   = useState(null);
  const [bulkBusy,  setBulkBusy]  = useState(false);

  const handleSearch = async () => {
    if (!username.trim()) { setUserErr("Username is required"); return; }
    setUserErr(""); setSearchBusy(true);
    try {
      const data = await apiFetch(`${API_BASE}/index/get?username=${encodeURIComponent(username)}`);
      setSearchRes(data); 
      const newAverage = ((numberOfSearches - 1)*averageSearchTime+data.response_time)/(numberOfSearches);
      setNumberOfSearches(numberOfSearches+1);
      onMetric("readWithIndex", newAverage.toFixed(2));
      setAverageSearchTime(newAverage);
      toast.add(`Searched in ${data.response_time}ms`);
    } catch (e) { 
      toast.add(e.message, "error");
    } finally { 
      setSearchBusy(false); 
    }
  };

  const handleGetAll = async () => {
    if (!allSize || isNaN(allSize) || Number(allSize) < 1) {
      setAllSizeErr("Must be a positive number"); return;
    }
    setAllSizeErr(""); 
    setAllBusy(true);
    try {
      const data = await apiFetch(`${API_BASE}/index/get-all?size=${allSize}`);
      setAllRes(data); toast.add("Indexed entries fetched", "info");
    } catch (e) { toast.add(e.message, "error"); }
    finally { setAllBusy(false); }
  };

  const handleBulk = async () => {
    const invalid = bulkDocs.some(doc =>
      doc.length === 0 || doc.some(p => !p.key.trim() || !p.value.trim())
    );
    if (invalid) { setBulkErr("All fields in every document must be filled."); return; }
    setBulkErr(""); setBulkBusy(true);
    try {
      const body = bulkDocs.map(doc =>
        Object.fromEntries(doc.map(p => [p.key.trim(), p.value.trim()]))
      );
      const data = await apiFetch(`${API_BASE}/index/insert-all`, { method: "POST", body: JSON.stringify(body) });
      setBulkRes(data); 
      onMetric("insertWithIndex", data.response_time);
      toast.add(`${bulkDocs.length} indexed docs in ${data.response_time}ms`);
      refreshSizes();
    } catch (e) { 
      toast.add(e.message, "error"); 
    } finally { 
      setBulkBusy(false); 
    }
  };

  return (
    <div>
      <div className="grid-2" style={{ marginBottom: 22 }}>

        <div className="card" style={{ "--accent": theme.green }}>
          <div className="card-title">Lookup by Username</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <span className="badge badge-cyan">INDEX</span>
            <span style={{ fontSize: 13, color: theme.textMuted, letterSpacing: 1 }}>O(logn) B Tree lookup</span>
          </div>
          <div className="field">
            <label className="field-label">Username</label>
            <input className={`field-input ${userErr ? "err" : ""}`}
              value={username} onChange={e => setUsername(e.target.value)}
              placeholder="e.g. john_doe"
              onKeyDown={e => e.key === "Enter" && handleSearch()} />
            {userErr && <div className="field-err">{userErr}</div>}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn" onClick={handleSearch} disabled={searchBusy}
              style={{ "--btn-color": theme.green }}>
              {searchBusy ? "LOOKING UP..." : "LOOKUP"}
            </button>
          </div>
          {searchRes && (<><hr className="divider" />
            <div className="card-title" style={{ fontSize: 13 }}>Result</div>
            <div className="response-block" dangerouslySetInnerHTML={{ __html: prettyJson(searchRes) }} />
          </>)}
        </div>

        <div className="card" style={{ "--accent": theme.purple }}>
          <div className="card-title">Fetch N Entries</div>
          <div className="field">
            <label className="field-label">Page Size</label>
            <input className={`field-input ${allSizeErr ? "err" : ""}`}
              type="number" min="1" value={allSize} onChange={e => setAllSize(e.target.value)} />
            {allSizeErr && <div className="field-err">{allSizeErr}</div>}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn" onClick={handleGetAll} disabled={allBusy}
              style={{ "--btn-color": theme.purple }}>
              {allBusy ? "LOADING..." : "FETCH ALL"}
            </button>
          </div>
          {allRes && (<><hr className="divider" />
            <div className="response-block" dangerouslySetInnerHTML={{ __html: prettyJson(allRes) }} />
          </>)}
        </div>

      </div>

      <div className="card" style={{ "--accent": theme.cyan }}>
        <div className="card-title">Bulk Insert</div>
        <BulkBuilder docs={bulkDocs} onChange={setBulkDocs} />
        {bulkErr && <div className="field-err" style={{ marginTop: 10 }}>{bulkErr}</div>}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
          <button className="btn" onClick={handleBulk} disabled={bulkBusy}
            style={{ "--btn-color": theme.cyan }}>
            {bulkBusy ? "INDEXING..." : `INSERT ${bulkDocs.length} DOC${bulkDocs.length !== 1 ? "S" : ""}`}
          </button>
        </div>
        {bulkRes && (<><hr className="divider" />
          <div className="response-block" dangerouslySetInnerHTML={{ __html: prettyJson(bulkRes) }} />
        </>)}
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("no-index");
  const toast = useToast();
  const [metrics, setMetrics] = useState({
    insertNoIndex: null, insertWithIndex: null,
    readNoIndex: null,   readWithIndex: null,
  });
  const [dbSizes, setDbSizes] = useState({
    noIndex: null,
    withIndex: null,
  });

  const setMetric = (key, val) => setMetrics(p => ({ ...p, [key]: val }));

  const fetchSizes = async () => {
    try {
      const [noIndexRes, withIndexRes] = await Promise.all([
        apiFetch(`${API_BASE}/get-size`),
        apiFetch(`${API_BASE}/index/get-size`)
      ]);
      setDbSizes({
        noIndex: noIndexRes.data,
        withIndex: withIndexRes.data,
      });
    } catch (e) {
      console.error("Failed to fetch database sizes:", e);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  const toastColors = { success: theme.green, error: theme.magenta, info: theme.cyan };
  const toastIcons  = { success: "✓", error: "✗", info: "ℹ" };

  return (
    <>
      <style>{css}</style>
      <div className="grid-bg" />
      <div className="scan-line" />

      <div className="app">

        <header className="header">
          <div className="logo">NOSQL Database</div>
          <div className="header-right">
            <span className="status-label">System Online</span>
            <div className="status-dot" />
          </div>
        </header>

        <MetricsPanel metrics={metrics} dbSizes={dbSizes} />

        <div className="tabs">
          <button
            className={`tab ${activeTab === "no-index" ? "active-no" : ""}`}
            onClick={() => setActiveTab("no-index")}
          >
            <div className="tab-dot" style={{
              background: theme.magenta,
              boxShadow: activeTab === "no-index" ? `0 0 8px ${theme.magenta}` : "none"
            }} />
            No Index 
          </button>
          <button
            className={`tab ${activeTab === "with-index" ? "active-idx" : ""}`}
            onClick={() => setActiveTab("with-index")}
          >
            <div className="tab-dot" style={{
              background: theme.cyan,
              boxShadow: activeTab === "with-index" ? `0 0 8px ${theme.cyan}` : "none"
            }} />
            With Index
          </button>
        </div>

        <div className="main">
          {activeTab === "no-index"   && <NoIndexTab   toast={toast} onMetric={setMetric} refreshSizes={fetchSizes} />}
          {activeTab === "with-index" && <WithIndexTab toast={toast} onMetric={setMetric} refreshSizes={fetchSizes} />}
        </div>

      </div>

      {toast.toasts.map(x => (
        <div key={x.id} className="toast" style={{ "--tc": toastColors[x.type] }}>
          <span className="toast-icon">{toastIcons[x.type]}</span>
          {x.msg}
        </div>
      ))}
    </>
  );
}