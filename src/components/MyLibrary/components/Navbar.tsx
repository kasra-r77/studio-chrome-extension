import React from "react";

import { TopNavBar } from "@instructure/ui-top-nav-bar";
import { IconHomeLine } from "@instructure/ui-icons";

type NavBarProps = {
  onHomeClick: (value: "collection") => void;
  userDisplayName: string;
  userAvatarUrl: string;
};

const NavBar = ({
  onHomeClick,
  userAvatarUrl = "",
  userDisplayName = "",
}: NavBarProps) => {
  return (
    <TopNavBar breakpoint="300" mediaQueryMatch="element">
      {() => (
        <TopNavBar.Layout
          navLabel="Example navigation bar"
          smallViewportConfig={{
            dropdownMenuToggleButtonLabel: "Toggle Menu",
            dropdownMenuLabel: "Main Menu",
          }}
          themeOverride={{
            desktopBackground: "#0374B5",
          }}
          renderBrand={
            <TopNavBar.Brand
              screenReaderLabel="Studio"
              renderIcon={
                <img src="studio-logo.png" alt="Studio logo" height="50px" />
              }
              iconBackground="#F5F5F5"
              href="/#TopNavBar"
            />
          }
          renderActionItems={
            <TopNavBar.ActionItems
              listLabel="Actions"
              renderHiddenItemsMenuTriggerLabel={(hiddenChildrenCount) =>
                `${hiddenChildrenCount} More`
              }
            >
              <TopNavBar.Item
                id="itemTooltip"
                variant="icon"
                tooltip={{
                  renderTip: "Home",
                  placement: "bottom end",
                }}
                renderIcon={<IconHomeLine />}
                onClick={() => onHomeClick("collection")}
              >
                Action Item with tooltip
              </TopNavBar.Item>
            </TopNavBar.ActionItems>
          }
          renderUser={
            <TopNavBar.User>
              <TopNavBar.Item
                id="UserMenu3"
                variant="avatar"
                renderAvatar={{
                  avatarName: userDisplayName,
                  avatarSrc: userAvatarUrl,
                }}
              >
                {userDisplayName}
              </TopNavBar.Item>
              <TopNavBar.Item id="UserMenu4" variant="default" status="default">
                {userDisplayName.split(" ")[0]}
              </TopNavBar.Item>
            </TopNavBar.User>
          }
        />
      )}
    </TopNavBar>
  );
};

export default NavBar;
