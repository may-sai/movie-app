import { Movie } from './movie';

export interface Video {
  key: string;
  site: string;
  type: string;
  official: boolean;
}

export interface CastMember {
  credit_id: string;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface MovieExtras {
  videos: { results: Video[] };
  credits: { cast: CastMember[] };
  similar: { results: Movie[] };
}
