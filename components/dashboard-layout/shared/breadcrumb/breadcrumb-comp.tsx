import { Card } from "@/components/ui/card";
import Link from "@/lib/router-compat";

interface BreadCrumbProps {
  readonly title: string;
}

const BreadcrumbComp = ({ title }: BreadCrumbProps) => {
  return (
    <Card className="py-5 px-6 bg-background overflow-hidden rounded-none border-0 shadow-none">
      <div className="flex items-center justify-between gap-6 relative">
        <h4 className="font-semibold text-xl text-foreground">{title}</h4>
        <ol className="flex items-center whitespace-nowrap" aria-label="Breadcrumb">
          <li className="flex items-center">
            <Link className="text-foreground text-sm leading-none" href="/">
              Home
            </Link>
          </li>
          <li className="mx-2">
            <div className="p-0.5 text-foreground">/</div>
          </li>
          <li
            className="flex items-center text-sm text-foreground leading-none opacity-80"
            aria-current="page"
          >
            {title}
          </li>
        </ol>
      </div>
    </Card>
  );
};

export default BreadcrumbComp;
