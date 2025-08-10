export interface Comment {
  comment: string;
  created_at: string;
  full_name: string;
  username: string;
  profile_picture: string;
}

export interface CommentSectionProps {
  postId: number;
  token: string | null;
}