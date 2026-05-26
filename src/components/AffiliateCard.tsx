import { cva, type VariantProps } from 'class-variance-authority';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface AffiliateLink {
  href?: string;
  asin?: string;
  price?: string;
}

interface ServiceLink {
  label: string;
  href: string;
  price: string | undefined;
  colorClass: string;
}

const affiliateCardVariants = cva('not-prose relative overflow-hidden', {
  variants: {
    variant: {
      default: [
        'bg-surface-elevated text-card-foreground border-border-elevated',
        'rounded-lg border shadow-sm',
        'transition-shadow duration-200 hover:shadow-md',
        'my-6',
      ],
      inline: [
        'bg-surface-elevated text-card-foreground border-border-elevated',
        'rounded-md border shadow-xs',
        'transition-shadow duration-200 hover:shadow-sm',
        'my-3 inline-block',
      ],
      compact: [
        'bg-surface-elevated text-card-foreground border-border-elevated',
        'rounded-md border',
        'my-3',
      ],
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface AffiliateCardProps extends VariantProps<
  typeof affiliateCardVariants
> {
  title: string;
  description?: string;
  image?: string;
  amazon?: AffiliateLink;
  rakuten?: AffiliateLink;
  yahoo?: AffiliateLink;
  other?: AffiliateLink & { label: string };
  hidePrBadge?: boolean;
  amazonAssociateId?: string;
  className?: string;
}

const generateAmazonUrl = (asin: string, associateId: string): string => {
  const baseUrl = `https://www.amazon.co.jp/dp/${asin}`;
  return associateId ? `${baseUrl}?tag=${associateId}` : baseUrl;
};

const buildServiceLinks = (
  amazon: AffiliateLink | undefined,
  rakuten: AffiliateLink | undefined,
  yahoo: AffiliateLink | undefined,
  other: (AffiliateLink & { label: string }) | undefined,
  amazonAssociateId: string,
): ServiceLink[] => {
  const services: ServiceLink[] = [];

  if (amazon) {
    const href = amazon.asin
      ? generateAmazonUrl(amazon.asin, amazonAssociateId)
      : amazon.href || '#';
    services.push({
      label: 'Amazon',
      href,
      price: amazon.price,
      colorClass: 'bg-[#FF9900] hover:bg-[#FF9900]/90 text-black',
    });
  }

  if (rakuten) {
    services.push({
      label: '楽天',
      href: rakuten.href || '#',
      price: rakuten.price,
      colorClass: 'bg-[#BF0000] hover:bg-[#BF0000]/90 text-white',
    });
  }

  if (yahoo) {
    services.push({
      label: 'Yahoo!',
      href: yahoo.href || '#',
      price: yahoo.price,
      colorClass: 'bg-[#FF0033] hover:bg-[#FF0033]/90 text-white',
    });
  }

  if (other) {
    services.push({
      label: other.label,
      href: other.href || '#',
      price: other.price,
      colorClass:
        'bg-secondary hover:bg-secondary/90 text-secondary-foreground',
    });
  }

  return services;
};

const ServiceButton = ({ service }: { service: ServiceLink }) => (
  <a
    href={service.href}
    target="_blank"
    rel="noopener noreferrer sponsored"
    className={cn(
      'inline-flex items-center gap-1.5 rounded-md px-3 py-2',
      'text-sm font-medium no-underline',
      'duration-fast transition-colors',
      service.colorClass,
    )}
  >
    <span>{service.label}</span>
    {service.price && (
      <span className="text-xs opacity-90">({service.price})</span>
    )}
  </a>
);

const PrBadge = () => (
  <div className="absolute top-2 right-2 z-10">
    <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
      PR
    </Badge>
  </div>
);

const AffiliateCard = ({
  title,
  description,
  image,
  amazon,
  rakuten,
  yahoo,
  other,
  hidePrBadge = false,
  amazonAssociateId = '',
  variant,
  className,
}: AffiliateCardProps) => {
  const services = buildServiceLinks(
    amazon,
    rakuten,
    yahoo,
    other,
    amazonAssociateId,
  );

  if (variant === 'compact') {
    return (
      <div className={cn(affiliateCardVariants({ variant }), className)}>
        {!hidePrBadge && <PrBadge />}
        <div className="flex items-center gap-3 p-3">
          {image && (
            <img
              src={image}
              alt={title}
              className="size-12 shrink-0 rounded object-contain"
              loading="lazy"
            />
          )}
          <div className="min-w-0 flex-1">
            <span className="text-foreground line-clamp-1 text-sm font-medium">
              {title}
            </span>
          </div>
          <div className="flex shrink-0 gap-1.5">
            {services.map((service) => (
              <ServiceButton key={service.label} service={service} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={cn(affiliateCardVariants({ variant }), className)}>
        {!hidePrBadge && <PrBadge />}
        <div className="flex items-center gap-3 p-3 md:p-4">
          {image && (
            <img
              src={image}
              alt={title}
              className="size-16 shrink-0 rounded object-contain"
              loading="lazy"
            />
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-foreground m-0 line-clamp-1 text-sm font-medium">
              {title}
            </h3>
            {description && (
              <p className="text-muted-foreground m-0 mt-0.5 line-clamp-1 text-xs">
                {description}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {services.map((service) => (
                <ServiceButton key={service.label} service={service} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(affiliateCardVariants({ variant }), className)}>
      {!hidePrBadge && <PrBadge />}
      <div className="flex flex-col sm:flex-row">
        {image && (
          <div className="bg-muted flex shrink-0 items-center justify-center p-4 sm:w-[180px]">
            <img
              src={image}
              alt={title}
              className="m-0 max-h-[140px] w-auto object-contain"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col">
          <div className="flex flex-col space-y-1.5 p-4 pb-2 md:p-6 md:pb-2">
            <h3 className="text-foreground m-0 line-clamp-2 text-base font-medium">
              {title}
            </h3>
            {description && (
              <p className="text-muted-foreground m-0 line-clamp-2 text-sm">
                {description}
              </p>
            )}
          </div>
          <div className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="flex flex-wrap gap-2">
              {services.map((service) => (
                <ServiceButton key={service.label} service={service} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AffiliateCard, affiliateCardVariants };
