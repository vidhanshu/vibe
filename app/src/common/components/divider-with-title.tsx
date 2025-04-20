import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";

const DividerWithTitle = ({ title }: { title: string }) => {
  return (
    <HStack className="items-center" space="md">
      <Heading size="sm">{title}</Heading>
      <Divider />
    </HStack>
  );
};

export default DividerWithTitle;
