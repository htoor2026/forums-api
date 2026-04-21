// src/services/forumService.test.ts

import {
  canModifyPost,
  canModifyComment,
  toggleLike,
} from "./forumService";

describe("forumService business logic", () => {
  test("admin (super user) can modify any post", () => {
    expect(canModifyPost("user1", "admin", "owner1")).toBe(true);
  });

  test("owner can modify own post", () => {
    expect(canModifyPost("owner1", "user", "owner1")).toBe(true);
  });

  test("normal user cannot modify another user's post", () => {
    expect(canModifyPost("user1", "user", "owner1")).toBe(false);
  });

  test("admin can modify any comment", () => {
    expect(canModifyComment("user1", "admin", "owner1")).toBe(true);
  });

  test("owner can modify own comment", () => {
    expect(canModifyComment("owner1", "user", "owner1")).toBe(true);
  });

  test("normal user cannot modify another user's comment", () => {
    expect(canModifyComment("user1", "user", "owner1")).toBe(false);
  });

  test("toggleLike returns like when not previously liked", () => {
    expect(toggleLike(false)).toBe("like");
  });

  test("toggleLike returns unlike when already liked", () => {
    expect(toggleLike(true)).toBe("unlike");
  });
});