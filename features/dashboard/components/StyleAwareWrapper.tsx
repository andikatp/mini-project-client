"use client";

interface Props {
  readonly children: React.ReactNode;
  readonly lyraClassName?: string;
  readonly defaultClassName?: string;
}

const StyleAwareWrapper = ({ children, lyraClassName, defaultClassName }: Props) => {
  return <div className={lyraClassName ?? defaultClassName}>{children}</div>;
};

export default StyleAwareWrapper;
