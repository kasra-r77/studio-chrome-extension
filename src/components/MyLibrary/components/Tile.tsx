import React, { useEffect, useState } from "react";

import { Flex } from "@instructure/ui-flex";
import { View } from "@instructure/ui-view";
import { Img } from "@instructure/ui-img";
import { Text } from "@instructure/ui-text";
import { TruncateText } from "@instructure/ui-truncate-text";
import { IconButton } from "@instructure/ui-buttons";
import {
  IconDownloadSolid,
  IconArrowOpenEndSolid,
} from "@instructure/ui-icons";

import CollectionThumbnail from "./CollectionThumbnail";
import CollectionApiUtils from "../../../actions/CollectionApiUtils";
import { CollectionMedia } from "../../../types/Collection";

type TileProps = {
  id: number;
  thumbnail?: string;
  title: string;
  ownerName: string;
  onSelectCollection?: (collectionId: number) => void;
  isCollection: boolean;
  handleDownloadMedia?: (mediaId: number) => void;
  isDownloadable?: boolean;
  isYoutube?: boolean;
};

const Tile = ({
  id,
  thumbnail,
  title,
  ownerName,
  onSelectCollection,
  isCollection,
  handleDownloadMedia,
  isDownloadable,
  isYoutube = false,
}: TileProps): React.ReactElement => {
  const [collectionThumbnails, setCollectionThumbnails] =
    useState<string[]>(undefined);

  useEffect(() => {
    if (isCollection) {
      const fetchedMedia = async () => {
        const media = await CollectionApiUtils.loadCollectionMedia(id, {
          page: 1,
          per_page: 4,
        });
        let thumbnails = [];
        if (media) {
          thumbnails = media.map(
            (medium: CollectionMedia) => medium.thumbnail_url
          );
        }

        setCollectionThumbnails(thumbnails);
      };
      fetchedMedia();
    }
  }, [id, isCollection]);

  const renderButton = (): React.ReactElement | null => {
    if (!isCollection && isDownloadable) {
      return (
        <IconButton
          withBackground={false}
          withBorder={false}
          shape="rectangle"
          screenReaderLabel="Download media"
          onClick={() => handleDownloadMedia(id)}
        >
          <IconDownloadSolid size="x-small" />
        </IconButton>
      );
    }

    if (!isCollection && isYoutube) {
      return <Img src="yt.svg" />;
    }

    if (isCollection) {
      return (
        <IconButton
          withBackground={false}
          withBorder={false}
          shape="rectangle"
          screenReaderLabel="Download media"
        >
          <IconArrowOpenEndSolid />
        </IconButton>
      );
    }
  };

  return (
    <View
      as="span"
      shadow="resting"
      display="block"
      borderColor="primary"
      width="95%"
      borderRadius="medium"
      onClick={() => onSelectCollection(id)}
      margin="x-small auto"
      cursor={isCollection ? "pointer" : "default"}
      background="primary"
    >
      <Flex width="100%">
        <Flex.Item margin="0 medium 0 0">
          {!isCollection ? (
            <Img src={thumbnail} width="100px" height="60px" />
          ) : (
            <CollectionThumbnail thumbnails={collectionThumbnails} />
          )}
        </Flex.Item>
        <Flex direction="column">
          <Flex.Item width="150px" margin="0 0 x-small 0">
            <Text size="small">
              <TruncateText maxLines={1}>{title}</TruncateText>
            </Text>
          </Flex.Item>
          <Flex.Item>
            <Text weight="bold">{ownerName}</Text>
          </Flex.Item>
        </Flex>
        <Flex.Item margin="auto">{renderButton()}</Flex.Item>
      </Flex>
    </View>
  );
};

export default Tile;
