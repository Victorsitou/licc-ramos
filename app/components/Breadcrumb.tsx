interface BreadcrumbItem {
  label: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-xs uppercase tracking-widest">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={item.label} className="flex items-center gap-1.5">
            <span
              className={
                isLast
                  ? "font-semibold text-foreground"
                  : "font-medium text-muted-foreground"
              }
            >
              {item.label}
            </span>

            {!isLast && <span className="text-muted-foreground/50">›</span>}
          </div>
        );
      })}
    </nav>
  );
}
