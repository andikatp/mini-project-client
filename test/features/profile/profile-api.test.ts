import { describe, expect, it, beforeEach, afterEach } from "vite-plus/test";
import { profileApi } from "@/features/profile/api/profile-api";

describe("profileApi (Infrastructure / HTTP Layer)", () => {
  const originalFetch = globalThis.fetch;
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

  beforeEach(() => {
    lastFetchUrl = "";
    lastFetchOptions = undefined;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("should send GET request for getUserProfile", async () => {
    mockSuccessFetch({
      status: "success",
      message: "Profile fetched successfully",
      data: {
        user: {
          id: "u-profile-1",
          email: "user@example.com",
          name: "User Profile",
          role: "CUSTOMER",
          avatarUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
          referralCode: "REF-123",
          emailVerifiedAt: "2026-11-04T00:00:00Z",
          createdAt: "2026-11-04T00:00:00Z",
        },
      },
    });

    const res = await profileApi.getUserProfile();

    expect(lastFetchUrl).toContain("/users/me");
    expect(lastFetchOptions?.method).toBe("GET");
    expect(res.status).toBe("success");
    expect(res.data?.user.name).toBe("User Profile");
  });

  it("should send PATCH request for updateProfile with updated fields", async () => {
    mockSuccessFetch({
      status: "success",
      message: "Profile updated successfully",
      data: {
        user: {
          id: "u-profile-1",
          email: "user@example.com",
          name: "Updated Name",
          role: "CUSTOMER",
          avatarUrl: "https://res.cloudinary.com/demo/image/upload/new-avatar.jpg",
        },
      },
    });

    const res = await profileApi.updateProfile({
      name: "Updated Name",
      avatarUrl: "https://res.cloudinary.com/demo/image/upload/new-avatar.jpg",
    });

    expect(lastFetchUrl).toContain("/users/me");
    expect(lastFetchOptions?.method).toBe("PATCH");
    expect(JSON.parse(lastFetchOptions?.body as string)).toEqual({
      name: "Updated Name",
      avatarUrl: "https://res.cloudinary.com/demo/image/upload/new-avatar.jpg",
    });
    expect(res.status).toBe("success");
    expect(res.data?.user.name).toBe("Updated Name");
  });

  it("should send POST request with FormData for uploadImage", async () => {
    mockSuccessFetch({
      status: "success",
      message: "Image uploaded successfully",
      data: {
        url: "https://res.cloudinary.com/demo/image/upload/avatar.webp",
        publicId: "mini-project/avatars/avatar_123",
        format: "webp",
        width: 400,
        height: 400,
      },
    });

    const fakeFile = new File(["fake-image-bytes"], "avatar.webp", { type: "image/webp" });
    const res = await profileApi.uploadImage(fakeFile, "mini-project/avatars");

    expect(lastFetchUrl).toContain("/upload/image");
    expect(lastFetchOptions?.method).toBe("POST");
    expect(lastFetchOptions?.body).toBeInstanceOf(FormData);
    expect(res.status).toBe("success");
    expect(res.data?.url).toBe("https://res.cloudinary.com/demo/image/upload/avatar.webp");
  });

  it("should throw server error message when profile request fails", async () => {
    mockErrorFetch("Pengguna tidak ditemukan", 404);

    await expect(profileApi.getUserProfile()).rejects.toThrow("Pengguna tidak ditemukan");
  });
});
