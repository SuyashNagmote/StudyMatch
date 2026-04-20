const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const REQUEST_TIMEOUT_MS = 10000;

const buildHeaders = (token, isJson = true) => {
  const headers = {
    Accept: "application/json"
  };

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const request = async (path, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out");
    }

    throw new Error("Unable to reach the API");
  } finally {
    clearTimeout(timeoutId);
  }

  const contentType = response.headers.get("content-type") || "";
  const rawBody = await response.text();

  let data = null;

  if (rawBody) {
    if (contentType.includes("application/json")) {
      data = JSON.parse(rawBody);
    } else {
      try {
        data = JSON.parse(rawBody);
      } catch {
        data = { message: rawBody };
      }
    }
  }

  if (!response.ok) {
    const message =
      data?.message ||
      (response.status === 404
        ? "API route not found"
        : `Request failed with status ${response.status}`);

    throw new Error(message);
  }

  return data ?? {};
};

export const authApi = {
  signup: (payload) =>
    request("/auth/signup", {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(payload)
    }),
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(payload)
    }),
  me: (token) =>
    request("/auth/me", {
      headers: buildHeaders(token, false)
    }),
  saveProfile: (token, payload) =>
    request("/auth/profile", {
      method: "POST",
      headers: buildHeaders(token),
      body: JSON.stringify(payload)
    })
};

export const matchApi = {
  getMatches: (token) =>
    request("/match", {
      headers: buildHeaders(token, false)
    }),
  getGraph: (token) =>
    request("/match/graph", {
      headers: buildHeaders(token, false)
    })
};
