import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

type PaginationProps = {
  links: PaginationLink[];
};

export default function pagination({ links }: PaginationProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {links.map((link, index) => {
        // Ignore disabled links
        if (!link.url && !link.active) return null;

        const isActive = link.active;
        const labelText = link.label.replace(/&laquo;|&raquo;/g, ''); // clean HTML

        return (
          <Link key={index} href={link.url || '#'} preserveScroll>
            <Button
              size="sm"
              variant={isActive ? 'default' : 'outline'}
              className={isActive ? 'cursor-pointer' : 'cursor-pointer'}
            >
              {labelText}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
