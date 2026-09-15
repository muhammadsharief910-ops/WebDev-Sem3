import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ApiTester = () => {
  const [method, setMethod] = useState("GET");
  const [endpoint, setEndpoint] = useState("/me");
  const [useToken, setUseToken] = useState(true);
  const [customToken, setCustomToken] = useState(
    localStorage.getItem("token") || "",
  );
  const [requestBody, setRequestBody] = useState("{\n  \n}");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [duration, setDuration] = useState(null);

  const presets = [
    { label: "GET /me", method: "GET", endpoint: "/me", withToken: true },
    {
      label: "GET /dashboard",
      method: "GET",
      endpoint: "/dashboard",
      withToken: true,
    },
    {
      label: "POST /login",
      method: "POST",
      endpoint: "/login",
      withToken: false,
      body: '{\n  "email": "test@example.com",\n  "password": "password123"\n}',
    },
    {
      label: "POST /signup",
      method: "POST",
      endpoint: "/signup",
      withToken: false,
      body: '{\n  "name": "Alex",\n  "email": "alex@example.com",\n  "password": "secret",\n  "role": "user"\n}',
    },
    {
      label: "PUT /me",
      method: "PUT",
      endpoint: "/me",
      withToken: true,
      body: '{\n  "name": "Updated Name"\n}',
    },
    {
      label: "PATCH /users/:id/role",
      method: "PATCH",
      endpoint: "/users/6aa08ba457d690a2650113eb/role",
      withToken: true,
      body: '{\n  "role": "admin"\n}',
    },
    {
      label: "POST /order",
      method: "POST",
      endpoint: "/order",
      withToken: true,
      body: '{\n  "productName": "Laptop",\n  "amount": 999\n}',
    },
    {
      label: "GET /my-orders",
      method: "GET",
      endpoint: "/my-orders",
      withToken: true,
    },
  ];

  const handleApplyPreset = (preset) => {
    setMethod(preset.method);
    setEndpoint(preset.endpoint);
    setUseToken(preset.withToken);
    if (preset.body) {
      setRequestBody(preset.body);
    }
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setResponse(null);
    setStatus(null);

    const startTime = performance.now();
    const url = endpoint.startsWith("http")
      ? endpoint
      : `http://localhost:3000${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

    const headers = {};
    if (useToken && customToken) {
      headers["authorization"] = customToken;
    }

    try {
      let parsedBody = null;
      if (["POST", "PUT", "PATCH"].includes(method)) {
        try {
          parsedBody = requestBody.trim() ? JSON.parse(requestBody) : {};
        } catch (parseErr) {
          setResponse({ error: "Invalid JSON in Request Body" });
          setStatus("Client Error");
          setLoading(false);
          return;
        }
      }

      const res = await axios({
        method,
        url,
        data: parsedBody,
        headers,
        validateStatus: () => true, // Don't throw on 4xx/5xx so we see exact status & response
      });

      const elapsed = Math.round(performance.now() - startTime);
      setDuration(elapsed);
      setStatus({
        code: res.status,
        text: res.statusText || (res.status === 200 ? "OK" : "Error"),
      });
      setResponse(res.data);
    } catch (err) {
      const elapsed = Math.round(performance.now() - startTime);
      setDuration(elapsed);
      setStatus({ code: "ERR", text: "Network / Connection Failed" });
      setResponse(err.message);
    }

    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCustomToken("");
    setResponse({ message: "Logged out! Token cleared from localStorage." });
    setStatus({ code: "AUTH", text: "Logged Out" });
  };

  return (
    <div className="tester-wrapper">
      <div className="tester-header">
        <div className="tester-title-group">
          <span className="tester-badge">API Playground</span>
          <h1>Backend Endpoint Tester</h1>
          <p>
            Quickly send requests to your Express server, inspect tokens, and
            view responses.
          </p>
        </div>
        <div className="tester-nav">
          <Link to="/" className="nav-link">
            Signup
          </Link>
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="nav-link logout-nav-btn"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="presets-bar">
        <span className="presets-label">Quick Presets:</span>
        <div className="presets-buttons">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              className="preset-btn"
              onClick={() => handleApplyPreset(p)}
            >
              <span className={`method-tag method-${p.method.toLowerCase()}`}>
                {p.method}
              </span>
              {p.endpoint}
            </button>
          ))}
        </div>
      </div>

      {/* Main Request Form */}
      <div className="tester-card">
        <form onSubmit={handleSend} className="tester-form">
          <div className="request-bar">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="method-select"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>

            <div className="url-input-box">
              <span className="base-url">http://localhost:3000</span>
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="/me"
                className="endpoint-input"
              />
            </div>

            <button type="submit" disabled={loading} className="send-btn">
              {loading ? "Sending..." : "Send Request"}
            </button>
          </div>

          {/* Token Header Section */}
          <div className="token-section">
            <div className="token-toggle-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={useToken}
                  onChange={(e) => setUseToken(e.target.checked)}
                />
                <span>Include Authorization Header (token)</span>
              </label>
              <div className="token-actions">
                <button
                  type="button"
                  className="sync-token-btn"
                  onClick={() =>
                    setCustomToken(localStorage.getItem("token") || "")
                  }
                >
                  ↻ Reload token
                </button>
                <button
                  type="button"
                  className="clear-token-btn"
                  onClick={handleLogout}
                >
                  ✕ Clear Token
                </button>
              </div>
            </div>

            {useToken && (
              <textarea
                className="token-textarea"
                rows="2"
                placeholder="JWT token..."
                value={customToken}
                onChange={(e) => setCustomToken(e.target.value)}
              />
            )}
          </div>

          {/* Request Body (for POST/PUT) */}
          {["POST", "PUT", "PATCH"].includes(method) && (
            <div className="body-section">
              <label className="section-label">Request Body (JSON):</label>
              <textarea
                className="body-textarea"
                rows="5"
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
              />
            </div>
          )}
        </form>

        {/* Response Panel */}
        <div className="response-panel">
          <div className="response-header">
            <h3>Response</h3>
            {status && (
              <div className="status-group">
                <span
                  className={`status-pill ${status.code >= 200 && status.code < 300 ? "status-success" : "status-error"}`}
                >
                  Status: {status.code} {status.text}
                </span>
                {duration !== null && (
                  <span className="duration-pill">{duration} ms</span>
                )}
              </div>
            )}
          </div>

          <div className="response-content">
            {loading ? (
              <div className="placeholder-msg loading-msg">
                Sending request to backend...
              </div>
            ) : response !== null ? (
              <pre className="json-output">
                {typeof response === "object"
                  ? JSON.stringify(response, null, 2)
                  : String(response)}
              </pre>
            ) : (
              <div className="placeholder-msg">
                Click "Send Request" or select a preset to see the output from
                your server.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTester;
