import React from "react";
import PostCardBase from "./PostCardBase";
import type { Post } from "./PostCard.types";

export default function PostCardWide({post}: {post : Post}) {
    return <PostCardBase post={post} variant="wide" />
}