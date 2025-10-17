
export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType;
  color: string;
}

export interface SocialMedia {
  github?: {
    followers: number;
    stars: number;
    repositories: number;
  };
  linkedin?: {
    url: string;
  };
  twitter?: {
    followers: number;
  };
}

export interface Developer {
  id: string;
  name: string;
  email: string;
  skills: string[];
  experience: number;
  location: string;
  githubUrl?: string;
  socialMedia?: SocialMedia;
}
