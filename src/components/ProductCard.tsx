import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  image: string;
  onBuy: () => void;
}

const ProductCard = ({ name, price, oldPrice, description, image, onBuy }: ProductCardProps) => {
  return (
    <div className="group bg-card rounded-lg overflow-hidden shadow-[var(--card-shadow)] hover:shadow-[var(--card-hover-shadow)] transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className="aspect-square overflow-hidden bg-secondary">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-lg text-card-foreground">{name}</h3>
        <p className="text-muted-foreground text-sm mt-1 flex-1 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-xl text-primary">Rs. {price.toLocaleString()}</span>
            {oldPrice && (
              <span className="text-muted-foreground text-sm line-through">Rs. {oldPrice.toLocaleString()}</span>
            )}
          </div>
          <button
            onClick={onBuy}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <ShoppingCart className="w-4 h-4" />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
