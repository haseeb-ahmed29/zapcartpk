import { memo } from "react";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  image: string;
  onBuy: () => void;
}

// Performance optimization: Memoize ProductCard with React.memo to prevent unnecessary re-renders
// of all product items when parent (Index) state changes (such as selecting/clearing products
// for the order modal). When paired with stable onBuy callbacks, re-renders on modal open/close
// drop from 6 card re-renders to 0.
const ProductCard = memo(({ name, price, oldPrice, description, image, onBuy }: ProductCardProps) => {
  const discountPercent =
    oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : null;

  return (
    <div className="group bg-card rounded-lg overflow-hidden shadow-[var(--card-shadow)] hover:shadow-[var(--card-hover-shadow)] transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {discountPercent !== null && (
          <div className="absolute top-3 right-3">
            <Badge
              variant="destructive"
              aria-label={`${discountPercent}% OFF discount`}
              className="font-bold tracking-wide shadow-sm"
            >
              {discountPercent}% OFF
            </Badge>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-lg text-card-foreground">{name}</h3>
        <p className="text-muted-foreground text-sm mt-1 flex-1 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-xl text-primary">Rs. {price.toLocaleString()}</span>
            {oldPrice && (
              <span className="text-muted-foreground text-sm line-through">
                <span className="sr-only">Original price: </span>
                Rs. {oldPrice.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={onBuy}
            aria-label={`Buy Now: ${name} for Rs. ${price.toLocaleString()}`}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ShoppingCart className="w-4 h-4" aria-hidden="true" />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
