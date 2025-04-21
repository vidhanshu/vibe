import { Box } from "@/components/ui/box";
import { VStack, type IVStackProps } from "@/components/ui/vstack";
import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";

interface TabsProps extends IVStackProps {
  tabs: {
    label?: string;
    value: string;
    icon?: { Comp: any; name: string };
    content?: React.ReactNode;
  }[];
  // for external handling
  active?: string;
  setActive?: React.Dispatch<React.SetStateAction<string>>;
}

const Tabs = ({
  tabs,
  active: exActive,
  setActive: setExActive,
  ...props
}: TabsProps) => {
  const [active, setActive] = useState(tabs[0].value);
  const isExternalState = exActive !== undefined && setExActive !== undefined;

  return (
    <VStack space="lg" {...props} className={`h-full ${props.className}`}>
      <Box className="flex flex-row items-center justify-between border-b-[0.5px] border-secondary-500">
        {tabs.map(({ value, icon, label }, _idx) => {
          const { Comp, name } = icon ?? {};
          const isActive = isExternalState
            ? exActive === value
            : active === value;
          const setIsActive = isExternalState ? setExActive : setActive;
          return (
            <Pressable
              android_ripple={{
                color: "rgba(255, 255, 255, 0.2)",
              }}
              className={`flex-1 flex justify-center items-center py-2 ${
                isActive && "border-b-2 border-white"
              }`}
              key={_idx}
              onPress={() => setIsActive(value)}
            >
              {icon && (
                <>
                  <Comp
                    size={25}
                    name={name}
                    color={isActive ? "white" : "gray"}
                  />
                </>
              )}
            </Pressable>
          );
        })}
      </Box>
      {!isExternalState && tabs.find((tab) => tab.value === active)?.content}
    </VStack>
  );
};

export default Tabs;
