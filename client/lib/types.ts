export interface UserProps {
  id?: number;
  username: string;
  email: string;
  profile?: string;
  bio?: string;
  social_links?: { platform: string; url: string }[]; // Array of objects with string keys and values
  followers?: number[];
  following?: number[];
  location?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  password?: string;
}

export interface GetQueryProps {
  CreatedAt: string;
  DeletedAt: string | null;
  Email: string;
  Followers: number[] | null;
  Following: number[] | null;
  ID: number;
  Ideas: StartupProps[]; // Replace `any` with a more specific type if needed
  Location: string;
  Password: string;
  Profile: string;
  SocialLinks: { platform: string; url: string }[]; // Array of SocialLink objects
  UpdatedAt: string;
  bio: string;
  username: string;
}

export interface AuthContextProps {
  user: UserProps | null;
  setUser: React.Dispatch<React.SetStateAction<UserProps | null>>;
  loading: boolean;
}

export interface StartupProps {
  ID?: number;
  user_id?: number;
  name: string;
  pitch: string;
  category_id: number;
  image_url?: string;
  is_active?: boolean;
  social_links?: { platform: string; url: string }[];
  funding_stage?: string;
  target_audience?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  user?: UserProps;
  category?: CategoryProps;
  likes?: number[];
  dislikes?: number[];
  views?: number;
}

export interface CommentProps {
  CreatedAt?: Date;
  UpdatedAt?: Date;
  DeletedAt?: Date | null;
  ID?: number;
  StartupId?: number;
  UserId?: number;
  Content: string;
}

export interface LoginProps {
  email: string;
  password: string;
}

export interface CategoryProps {
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  ID?: number;
  Name: string;
  Description: string;
}


export type RefreshStartupDataParams = {
  id: number;
  setStartupData: (startupData: StartupProps | null) => void;
  setStartupUser: (startupUser: GetQueryProps | null) => void;
};