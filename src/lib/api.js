const BASE = "/api";

function getHeaders(options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("jwtToken");
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function request(path, { method = "GET", body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: getHeaders(),
    ...(body != null && { body: JSON.stringify(body) }),
  });
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text || res.statusText };
    }
  }
  if (!res.ok) {
    const err = new Error(res.statusText || "Request failed");
    err.status = res.status;
    err.responseData = data || { message: res.statusText };
    throw err;
  }
  return data;
}

export const api = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  delete: (path) => request(path, { method: "DELETE" }),
};

export default api;
