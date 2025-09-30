import type { JSX } from "react"
import styles from "./Posts.module.css"
import type { Post } from "./postsApiSlice.ts"
import { PostForm } from "./PostForm.tsx"

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
        <PostForm key={post.id} post={post} isLoading={isLoading} />
      ))}
    </div>
  )
}
