export function createMockFetchContext() {
  let lastFetchUrl = "";
  let lastFetchOptions: RequestInit | undefined;

  const getUrlString = (url: string | URL | Request): string => {
    if (typeof url === "string") return url;
    if ("url" in url) return url.url;
    return url.href;
  };

  const mockSuccessFetch = (responseData: unknown, status = 200) => {
    globalThis.fetch = (async (url: string | URL | Request, options?: RequestInit) => {
      lastFetchUrl = getUrlString(url);
      lastFetchOptions = options;
      return {
        ok: status >= 200 && status < 300,
        status,
        statusText: "OK",
        json: async () => responseData,
      } as Response;
    }) as typeof fetch;
  };

  const mockErrorFetch = (errorMessage: string, status = 400) => {
    globalThis.fetch = (async (url: string | URL | Request, options?: RequestInit) => {
      lastFetchUrl = getUrlString(url);
      lastFetchOptions = options;
      return {
        ok: false,
        status,
        statusText: "Bad Request",
        json: async () => ({
          status: "error",
          message: errorMessage,
        }),
      } as Response;
    }) as typeof fetch;
  };

  return {
    getLastUrl: () => lastFetchUrl,
    getLastOptions: () => lastFetchOptions,
    reset: () => {
      lastFetchUrl = "";
      lastFetchOptions = undefined;
    },
    mockSuccessFetch,
    mockErrorFetch,
  };
}

