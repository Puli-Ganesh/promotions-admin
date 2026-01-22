import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [err, setErr] = useState("");

  const fetchEntries = async () => {
    try {
      setErr("");
      const res = await axios.get("https://jockey-scratch-card-backend.vercel.app/api/entries");
      const data = res.data;
      setEntries(Array.isArray(data) ? data : []);
    } catch (e) {
      setEntries([]);
      setErr("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => {
      const name = (e.name || "").toLowerCase();
      const mobile = (e.mobile || "").toLowerCase();
      return name.includes(q) || mobile.includes(q);
    });
  }, [entries, query]);

  return (
    <div className="ad-wrap">
      <div className="ad-shell">
        <div className="ad-header">
          <div className="ad-left">
            <div className="ad-badge">SLG JOCKEY</div>
            <h1 className="ad-title">Customers</h1>
            <div className="ad-meta">
              <div className="ad-pill">
                Total <span>{entries.length}</span>
              </div>
              <div className="ad-pill">
                Showing <span>{filtered.length}</span>
              </div>
            </div>
          </div>

          <div className="ad-right">
            <div className="ad-search-wrap">
              <span className="ad-search-icon">⌕</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or mobile"
                className="ad-search-input"
              />
            </div>

            <button
              className="ad-refresh"
              onClick={() => {
                setLoading(true);
                fetchEntries();
              }}
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="ad-card">
          {loading ? (
            <div className="ad-state">
              <div className="ad-loader" />
              <p className="ad-state-text">Loading customers...</p>
            </div>
          ) : err ? (
            <div className="ad-state">
              <p className="ad-empty-title">{err}</p>
              <p className="ad-state-text">Check your network and try again.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="ad-state">
              <p className="ad-empty-title">No customers found</p>
              <p className="ad-state-text">Try searching something else.</p>
            </div>
          ) : (
            <div className="ad-list">
              {filtered.map((entry) => (
                <div key={entry.id} className="ad-row">
                  <div className="ad-row-left">
                    <div className="ad-avatar">
                      {(entry.name || "C").trim().charAt(0).toUpperCase()}
                    </div>
                    <div className="ad-user">
                      <div className="ad-name">{entry.name}</div>
                      <div className="ad-label">Customer</div>
                    </div>
                  </div>

                  <div className="ad-row-right">
                    <div className="ad-mobile">{entry.mobile}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="ad-footer">
          <p className="ad-footer-text">Powered by Jockey Rewards</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
