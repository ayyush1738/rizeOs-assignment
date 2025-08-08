import Image from 'next/image';

// Define a clear type for a user object
export interface User {
  id: number;
  username: string;
  full_name: string;
  profile_picture?: string;
}

interface UserCardProps {
  user: User;
  children: React.ReactNode; // This will hold our action buttons
}

export default function UserCard({ user, children }: UserCardProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm transition-all hover:shadow-md hover:bg-gray-100">
      <div className="flex items-center gap-3">
        <Image
          src={user.profile_picture || '/default-avatar.png'} // Use a local default avatar in your /public folder
          alt={user.full_name || 'User avatar'}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-gray-800">{user.full_name}</p>
          <p className="text-sm text-gray-500">@{user.username}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {children}
      </div>
    </div>
  );
}