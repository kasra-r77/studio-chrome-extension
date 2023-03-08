export type Session = {
  token: string;
  user: { id: number; display_name: string; avatar_url: string };
};
