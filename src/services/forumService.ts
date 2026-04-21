// src/services/forumService.ts

export type UserRole = "admin" | "user";

export function canModifyPost(
  userId: string,
  userRole: UserRole,
  ownerId: string
): boolean {
  if (userRole === "admin") return true;
  return userId === ownerId;
}

export function canModifyComment(
  userId: string,
  userRole: UserRole,
  ownerId: string
): boolean {
  if (userRole === "admin") return true;
  return userId === ownerId;
}

export function toggleLike(
  alreadyLiked: boolean
): "like" | "unlike" {
  return alreadyLiked ? "unlike" : "like";
}