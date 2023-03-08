export type Collection = {
  id: number;
  name: string;
  type: "user" | "course_collection";
  owner: {
    id: number;
    display_name: string;
  };
};

export type CollectionMedia = {
  id: number;
  title: string;
  thumbnail_url: string;
  owner: {
    id: number;
    display_name: string;
  };

  source: "upload" | "youtube";
};
