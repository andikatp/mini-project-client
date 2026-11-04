import { describe, expect, it, beforeEach, afterEach } from "vite-plus/test";
import { profileApi } from "@/features/profile/api/profile-api";
import { createMockFetchContext } from "../../helpers/mock-fetch";

describe("profileApi (Infrastructure / HTTP Layer)", () => {
  const originalFetch = globalThis.fetch;
  const mockContext = createMockFetchContext();

  beforeEach(() => {
    mockContext.reset();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("should send GET request for getUserProfile", async () => {
    mockContext.mockSuccessFetch({
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

    expect(mockContext.getLastUrl()).toContain("/users/me");
    expect(mockContext.getLastOptions()?.method).toBe("GET");
    expect(res.status).toBe("success");
    expect(res.data?.user.name).toBe("User Profile");
  });

  it("should send PATCH request for updateProfile with updated fields", async () => {
    mockContext.mockSuccessFetch({
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

    expect(mockContext.getLastUrl()).toContain("/users/me");
    expect(mockContext.getLastOptions()?.method).toBe("PATCH");
    expect(mockContext.getLastOptions()?.body).toBe(
      JSON.stringify({
        name: "Updated Name",
        avatarUrl: "https://res.cloudinary.com/demo/image/upload/new-avatar.jpg",
      }),
    );
    expect(res.data?.user.name).toBe("Updated Name");
  });

  it("should send POST request with FormData for uploadImage", async () => {
    mockContext.mockSuccessFetch({
      status: "success",
      message: "Image uploaded successfully",
      data: {
        url: "https://res.cloudinary.com/demo/image/upload/new-avatar.jpg",
        publicId: "sample",
        format: "webp",
        width: 500,
        height: 500,
      },
    });

    const dummyBlob = new Blob(["dummy-image-content"], { type: "image/jpeg" });
    const dummyFile = new File([dummyBlob], "avatar.jpg", { type: "image/jpeg" });

    const res = await profileApi.uploadImage(dummyFile);

    expect(mockContext.getLastUrl()).toContain("/upload/image");
    expect(mockContext.getLastOptions()?.method).toBe("POST");
    expect(mockContext.getLastOptions()?.body).toBeInstanceOf(FormData);
    expect(res.data?.url).toBe("https://res.cloudinary.com/demo/image/upload/new-avatar.jpg");
  });

  it("should throw server error message when profile request fails", async () => {
    mockContext.mockErrorFetch("Profile not found", 404);

    await expect(profileApi.getUserProfile()).rejects.toThrow("Profile not found");
  });
});
