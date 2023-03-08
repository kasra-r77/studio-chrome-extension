import React from "react";

import { View } from "@instructure/ui-view";

import Tile from "./Tile";
import { CollectionMedia } from "../../../types/Collection";
import CollectionApiUtils from "../../../actions/CollectionApiUtils";

type MediaBrowserProps = {
  media?: CollectionMedia[];
};

const MediaBrowser = ({ media }: MediaBrowserProps) => {
  const handleDownloadMedia = (mediaId: number) => {
    CollectionApiUtils.downloadMedia(mediaId);
  };

  const isDownloadable = (medium: CollectionMedia): boolean => {
    return medium.source === "upload";
  };

  const isYoutube = (medium: CollectionMedia): boolean => {
    return medium.source === "youtube";
  };

  const renderTiles = (): JSX.Element[] => {
    return media.map((medium) => {
      return (
        <Tile
          handleDownloadMedia={handleDownloadMedia}
          isCollection={false}
          id={medium.id}
          thumbnail={medium.thumbnail_url}
          title={medium.title}
          ownerName={medium.owner.display_name}
          isDownloadable={isDownloadable(medium)}
          isYoutube={isYoutube(medium)}
        />
      );
    });
  };

  return <View>{renderTiles()}</View>;
};

export default MediaBrowser;
