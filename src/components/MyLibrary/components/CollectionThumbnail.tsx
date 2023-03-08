import React from "react";

import "./thumbnailStyles.css";

type CollectionThumbnailProps = {
  thumbnails: string[] | undefined;
};

const CollectionThumbnail = ({
  thumbnails,
}: CollectionThumbnailProps): React.ReactElement | null => {
  const modifiedChildren = [0, 1, 2, 3].map((i) => {
    const imgStyles = {
      width: "100%",
      backgroundImage: `url(${
        thumbnails && thumbnails[i] ? thumbnails[i] : ""
      })`,
      backgroundColor: "#F5F5F5",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
    return <div key={`Tile_${i}`} style={imgStyles}></div>;
  });

  return <div className="ThumbnailGroup">{modifiedChildren}</div>;
};

export default CollectionThumbnail;
