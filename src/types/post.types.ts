/**
 * Post State Types
 * Interface untuk state management post data
 */

import { Post } from './index';

export interface PostState {
  posts: Post[];
  selectedPost: Post | null;
  loading: boolean;
  error: string | null;
}
