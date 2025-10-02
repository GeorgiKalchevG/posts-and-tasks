import type { JSX } from "react"
import styles from "./Posts.module.css"
import type { Post } from "./postsApiSlice.ts"
import { PostContent } from "./PostContent.tsx"

export const Posts = ({
  posts,
  isLoading,
}: {
  posts: Post[]
  isLoading: boolean
}): JSX.Element | null => {
  return (
    <div className={styles.container}>
      {posts.map(post => (
        <PostContent key={post.id} post={post} isLoading={isLoading} />
      ))}
    </div>
  )
}
