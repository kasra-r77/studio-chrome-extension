import { Collection, CollectionMedia } from "../types/Collection";
import axios from "axios";

const CollectionApiUtils = {
  async loadCollections(): Promise<Collection[] | void> {
    return axios
      .get<{ collections: Collection[] }>("/api/public/v1/collections")
      .then((res) => {
        return res.data.collections;
      })
      .catch((e) => {
        if (e.response.status === 401) {
          chrome.storage.local.remove(["authToken", "userID"]);
        }
        console.log(e);
      });
  },

  async loadCollectionMedia(
    collectionId: number,
    queryParams?: { page: number; per_page: number }
  ): Promise<CollectionMedia[] | void> {
    return axios
      .get<{ media: CollectionMedia[] }>(
        `/api/public/v1/collections/${collectionId}/media`,
        {
          params: { ...queryParams },
        }
      )
      .then((res) => {
        console.log(res.data);
        return res.data.media;
      })
      .catch((e) => {
        if (e.response.status === 401) {
          chrome.storage.local.remove(["authToken", "userID"]);
        }
      });
  },

  async downloadMedia(mediaId: number) {
    return axios
      .get(`/api/public/v1/media/${mediaId}/download`)
      .then((res) => {
        return res.data;
      })
      .catch((e) => {
        if (e.response.status === 401) {
          chrome.storage.local.remove(["authToken", "userID"]);
        }

        // axios follows redirects with extra authorization which caused some
        // issues here, this is not a safe fallback and needs some refactoring :(
        if (e.response.status === 400) {
          chrome.downloads.download({
            url: e.response.request.responseURL,
          });
        }
      });
  },
};

export default CollectionApiUtils;
