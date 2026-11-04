"use client";

import { Separator } from "@/components/ui/separator";

interface Props {
  wrapperClassName?: string;
}

const StyleDivider = ({ wrapperClassName }: Props) => {
  if (wrapperClassName) {
    return (
      <div className={wrapperClassName}>
        <Separator className="w-full my-1" />
      </div>
    );
  }
  return <Separator className="w-full my-1" />;
};

export default StyleDivider;
