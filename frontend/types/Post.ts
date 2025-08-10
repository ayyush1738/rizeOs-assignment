export interface Post {
  id: number;
  content: string;
  created_at: string;
  full_name: string;
  username: string;
  profile_picture: string;
  likes: number;
  comments: number;
  shares: number;
  liked_by_user?: boolean;
}

