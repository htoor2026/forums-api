"use strict";
// src/services/forumService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleLike = exports.canModifyComment = exports.canModifyPost = void 0;
function canModifyPost(userId, userRole, ownerId) {
    if (userRole === "admin")
        return true;
    return userId === ownerId;
}
exports.canModifyPost = canModifyPost;
function canModifyComment(userId, userRole, ownerId) {
    if (userRole === "admin")
        return true;
    return userId === ownerId;
}
exports.canModifyComment = canModifyComment;
function toggleLike(alreadyLiked) {
    return alreadyLiked ? "unlike" : "like";
}
exports.toggleLike = toggleLike;
//# sourceMappingURL=forumService.js.map