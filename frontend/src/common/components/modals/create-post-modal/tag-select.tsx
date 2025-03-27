"use client";

import { Multiselect, MultiSelectOption } from "@/components/ui/multiselect";
import { getHashTags } from "@/src/posts/actions/posts-actions";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";

export const TagsSelect = ({
  selected,
  setSelected,
}: {
  setSelected: (selected: MultiSelectOption[]) => void;
  selected: MultiSelectOption[];
}) => {
  const [input, setInput] = useState("");
  const [debouncedValue, setDebouncedValue] = useDebounceValue("", 1000);
  const { data, isFetching } = useQuery({
    queryKey: ["tags", debouncedValue],
    queryFn: async () => {
      const res = await getHashTags({ name: debouncedValue });
      return res.data;
    },
  });

  return (
    <Multiselect
      options={
        data?.map(({ name }) => ({ label: `#${name}`, value: name })) ?? []
      }
      inputValue={input}
      isLoading={isFetching}
      setInputValue={(val) => {
        setInput(val);
        setDebouncedValue(val);
      }}
      labelPrefix="#"
      onCreate={(option) => ({
        value: option.toLowerCase().replace(/\s+/g, "-"),
        label: option.toLowerCase().replace(/\s+/g, "-"),
      })}
      selected={selected}
      setSelected={setSelected}
      size="xs"
      inputClassName="bg-white/5"
    />
  );
};
