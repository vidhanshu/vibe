import React from "react";
import { Box } from "@/components/ui/box";
import { Feather } from "@expo/vector-icons";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

const NoContent = ({
  title = "No Content",
  description,
  extras,
}: {
  title: string;
  description?: string;
  extras?: React.ReactNode;
}) => {
  return (
    <Box className="flex items-center justify-center p-4 max-w-xs mx-auto">
      <Feather name="inbox" size={40} color="gray" />
      <Heading className="text-center text-typography-600">{title}</Heading>
      {description && (
        <Text className="text-typography-500 text-center">{description}</Text>
      )}
      <Box className="mt-4">{extras}</Box>
    </Box>
  );
};

export default NoContent;
