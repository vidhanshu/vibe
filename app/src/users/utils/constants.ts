import { Entypo, FontAwesome } from "@expo/vector-icons";

export const PROFILE_POST_TABS = ({
  curUsername,
  username,
}: {
  curUsername: string;
  username: string;
}) => [
  {
    value: "posts",
    icon: {
      Comp: Entypo,
      name: "images",
    },
  },
  {
    value: "reels",
    icon: {
      Comp: Entypo,
      name: "video-camera",
    },
  },
  ...(curUsername === username
    ? [
        {
          value: "saved",
          icon: {
            Comp: FontAwesome,
            name: "bookmark",
          },
        },
      ]
    : []),
];
