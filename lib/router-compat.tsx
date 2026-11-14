import * as React from "react";
import {
  Link as RouterLink,
  useNavigate as useRouterNavigate,
  useLocation as useRouterLocation,
  useSearchParams as useRouterSearchParams,
} from "react-router";

export const Link = React.forwardRef<HTMLAnchorElement, any>(function Link(
  { href, to, ...props },
  ref,
) {
  return <RouterLink ref={ref} to={to || href || ""} {...props} />;
});
export default Link;

export function Image({
  src,
  alt,
  width,
  height,
  className,
  priority,
  fill,
  _fill,
  ...props
}: any) {
  const isFill = fill ?? _fill;
  const mergedClass = isFill ? `absolute inset-0 size-full ${className || ""}`.trim() : className;

  return (
    <img
      src={src}
      alt={alt || ""}
      width={isFill ? undefined : width}
      height={isFill ? undefined : height}
      className={mergedClass}
      loading={priority ? "eager" : "lazy"}
      {...props}
    />
  );
}

export const NextImage = Image;

export function useRouter() {
  const navigate = useRouterNavigate();
  return {
    push: (url: string, _options?: any): void => {
      void navigate(url);
    },
    replace: (url: string, _options?: any): void => {
      void navigate(url, { replace: true });
    },
    back: (): void => {
      void navigate(-1);
    },
    forward: (): void => {
      void navigate(1);
    },
    refresh: (): void => {
      window.location.reload();
    },
    prefetch: (): void => {},
  };
}

export function usePathname() {
  const location = useRouterLocation();
  return location.pathname;
}

export function useSearchParams() {
  const [params] = useRouterSearchParams();
  return params;
}

export function redirect(url: string) {
  window.location.replace(url);
}
