"use client";

import * as React from "react";
import { Loader2, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type MultiSelectOption = { value: string; label: string };

interface MultiselectProps {
  size?: "xs" | "sm" | "md";
  options: MultiSelectOption[];
  placeholder?: string;
  onCreate?: (value: string) => MultiSelectOption;
  disabled?: boolean;
  setSelected: (selected: MultiSelectOption[]) => void;
  selected: MultiSelectOption[];
  inputValue: string;
  setInputValue: (val: string) => void;
  inputClassName?: string;
  isLoading?: boolean;
  labelPrefix?: string;
}

export function Multiselect({
  size = "sm",
  options,
  placeholder = "Select...",
  onCreate,
  disabled,
  selected,
  setSelected,
  inputValue,
  setInputValue,
  inputClassName,
  isLoading,
  labelPrefix = "",
}: MultiselectProps) {
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleUnselect = React.useCallback(
    (option: MultiSelectOption) => {
      if (!disabled) {
        setSelected(selected.filter((s) => s.value !== option.value));
      }
    },
    [disabled, selected]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      if (e.key === "Enter" && inputValue.trim() !== "") {
        e.preventDefault();
        const newOption = onCreate
          ? onCreate(inputValue)
          : { value: inputValue.toLowerCase(), label: inputValue };

        if (selected.find(({ value }) => value === newOption.value)) {
          return toast.error(`${inputValue} already exists`);
        }

        if (!selected.some((s) => s.value === newOption.value)) {
          setSelected([...selected, newOption]);
        }
        setInputValue(""); // Clear input after adding
      } else if (
        (e.key === "Backspace" || e.key === "Delete") &&
        inputValue === ""
      ) {
        setSelected(selected.slice(0, -1)); // Remove last selected item
      }
    },
    [inputValue, selected, onCreate, disabled]
  );

  const selectables = options.filter(
    (option) => !selected.some((s) => s.value === option.value)
  );

  const sm = size === "sm";
  const xs = size === "xs";
  const md = size === "md";

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent h-fit"
    >
      <div
        className={cn(
          "group rounded-md border border-input px-1.5 py-1 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-0",
          { "px-1 py-1": xs, "px-1.5 py-1": sm, "px-2 py-1.5": md },
          inputClassName
        )}
      >
        <div className="flex flex-wrap gap-1">
          {selected.map((option) => (
            <Badge
              key={option.value}
              variant="secondary"
              className={cn({
                "text-[.6rem] h-4 px-2 py-1": xs,
                "text-[.7rem] h-5 px-2 py-1": sm,
                "text-xs h-5 px-2 py-1": md,
              })}
            >
              {option.label}
              {!disabled && (
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={() => {
                    handleUnselect(option);
                  }}
                >
                  <X
                    className={cn(
                      "size-3 text-muted-foreground hover:text-foreground",
                      { "size-2.5": xs }
                    )}
                  />
                </button>
              )}
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:placeholder:text-muted-foreground/50",
              {
                "ml-0.5 placeholder:text-xs text-xs": xs,
                "placeholder:text-[.8rem] text-[.8rem]": sm,
              }
            )}
          />
        </div>
      </div>
      <div className="relative mt-2 z-20">
        <CommandList className="">
          {open &&
            ((inputValue.trim() !== "" &&
              (!isLoading || selectables.length === 0)) ||
              isLoading ||
              selectables.length > 0) && (
              <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                <CommandGroup className="h-full  overflow-auto">
                  <>
                    {selectables.length > 0 ? (
                      selectables.map((option) => (
                        <CommandItem
                          key={option.value}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onSelect={() => {
                            setInputValue("");
                            setSelected([...selected, option]);
                          }}
                          className={cn("cursor-pointer", {
                            "text-xs px-2 py-1": xs,
                            "text-[.8rem] px-2 py-1": sm,
                          })}
                        >
                          {option.label}
                        </CommandItem>
                      ))
                    ) : inputValue.trim() !== "" &&
                      (!isLoading || selectables.length === 0) ? (
                      <CommandItem
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onSelect={() => {
                          const newOption = onCreate
                            ? onCreate(inputValue)
                            : {
                                value: inputValue.toLowerCase(),
                                label: `#${labelPrefix}${inputValue}`,
                              };
                          if (
                            selected.find(
                              ({ value }) => value === newOption.value
                            )
                          ) {
                            return toast.error(`${inputValue} already exists`);
                          }

                          if (onCreate) {
                            setSelected([...selected, newOption]);
                          } else {
                            setSelected([...selected, newOption]);
                          }
                          setInputValue("");
                        }}
                        className={cn("cursor-pointer", {
                          "text-xs px-2 py-1": xs,
                          "text-[.8rem] px-2 py-1": sm,
                        })}
                      >
                        <p>
                          Create "#<strong>{inputValue}</strong>"
                        </p>
                      </CommandItem>
                    ) : isLoading ? (
                      <CommandItem>
                        <Loader2 className="size-6 mx-auto animate-spin" />
                      </CommandItem>
                    ) : null}
                  </>
                </CommandGroup>
              </div>
            )}
        </CommandList>
      </div>
    </Command>
  );
}
