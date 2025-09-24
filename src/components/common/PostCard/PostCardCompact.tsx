import React from "react";
import PostCardBase from "./PostCardBase";
import type { Post } from "./PostCard.types";

export default function PostCardCompact({ post }: { post: Post }) {
  return <PostCardBase post={post} variant="compact" />;
}
