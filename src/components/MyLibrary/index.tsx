import React, { useEffect, useState } from "react";

import CollectionApiUtils from "../../actions/CollectionApiUtils";
import { Collection, CollectionMedia } from "../../types/Collection";
import { View } from "@instructure/ui-view";
import { Flex } from "@instructure/ui-flex";
import { Spinner } from "@instructure/ui-spinner";

import CollectionBrowser from "./components/CollectionBrowser";
import MediaBrowser from "./components/MediaBrowser";
import NavBar from "./components/Navbar";

type MyLibraryProps = {
  userDisplayName: string;
  userAvatarUrl: string;
};

const MyLibrary = ({ userDisplayName, userAvatarUrl }: MyLibraryProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [media, setMedia] = useState<CollectionMedia[]>([]);
  const [browseMode, setBrowseMode] = useState<"media" | "collection">(
    "collection"
  );
  const [selectedCollection, setSelectedCollection] = useState<number>();

  useEffect(() => {
    if (browseMode === "collection") {
      const fetchedCollection = async () => {
        const collections = await CollectionApiUtils.loadCollections();
        if (collections) {
          setCollections(collections);
          setIsLoading(false);
        }
      };
      fetchedCollection();
    } else {
      const fetchedMedia = async () => {
        const media = await CollectionApiUtils.loadCollectionMedia(
          selectedCollection
        );
        if (media) {
          setMedia(media);
          setIsLoading(false);
        }
      };
      fetchedMedia();
    }
  }, [browseMode, selectedCollection]);

  const handleSelectCollection = (collectionId: number) => {
    setSelectedCollection(collectionId);
    setMedia([]);
    setBrowseMode("media");
  };

  if (isLoading) {
    return (
      <Flex
        height="100%"
        width="100%"
        justifyItems="center"
        alignItems="center"
      >
        <Flex.Item>
          <Spinner />
        </Flex.Item>
      </Flex>
    );
  }

  return (
    <>
      <NavBar
        userAvatarUrl={userAvatarUrl}
        userDisplayName={userDisplayName}
        onHomeClick={setBrowseMode}
      />
      <View>
        {browseMode === "collection" ? (
          <CollectionBrowser
            onSelectCollection={handleSelectCollection}
            collections={collections}
          />
        ) : (
          <MediaBrowser media={media} />
        )}
      </View>
    </>
  );
};

export default MyLibrary;
