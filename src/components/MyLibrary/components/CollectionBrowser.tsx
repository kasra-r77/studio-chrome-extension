import React from "react";

import { View } from "@instructure/ui-view";

import { Collection } from "../../../types/Collection";
import Tile from "./Tile";

type CollectionBrowserProps = {
  collections?: Collection[];
  onSelectCollection: (collectionId: number) => void;
};

const CollectionBrowser = ({
  collections,
  onSelectCollection,
}: CollectionBrowserProps) => {
  const renderTiles = (): JSX.Element[] => {
    return collections.map((collection) => {
      const collectionName = collection.name ? collection.name : "My Library";
      return (
        <Tile
          isCollection
          key={`tile${collection.id}`}
          id={collection.id}
          title={collectionName}
          ownerName={collection.owner.display_name}
          onSelectCollection={onSelectCollection}
        />
      );
    });
  };

  return <View>{renderTiles()}</View>;
};

export default CollectionBrowser;
