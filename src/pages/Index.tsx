import { useState } from "react";
import { Zap, Truck, ShieldCheck, Phone } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import OrderForm from "@/components/OrderForm";

import heroBg from "@/assets/hero-bg.jpg";
import productMouse from "@/assets/product-mouse.jpg";
import productKeyboard from "@/assets/product-keyboard.jpg";
import productHeadset from "@/assets/product-headset.jpg";
import productUsbhub from "@/assets/product-usbhub.jpg";
import productWebcam from "@/assets/product-webcam.jpg";
import productMousepad from "@/assets/product-mousepad.jpg";

const products = [
  {
    id: 1,
    name: "Gaming Mouse RGB",
    price: 2500,
    oldPrice: 3500,
    description: "High precision gaming mouse with RGB lighting, 7200 DPI sensor aur 6 programmable buttons.",
    image: productMouse,
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    price: 5500,
    oldPrice: 7000,
    description: "RGB backlit mechanical keyboard with blue switches, durable keys aur anti-ghosting technology.",
    image: productKeyboard,
  },
  {
    id: 3,
    name: "Gaming Headset Pro",
    price: 3800,
    oldPrice: 5000,
    description: "Surround sound gaming headset with noise-cancelling mic, comfortable ear cushions aur bass boost.",
    image: productHeadset,
  },
  {
    id: 4,
    name: "USB-C Hub 4-in-1",
    price: 2200,
    description: "Aluminum USB-C hub with 3x USB 3.0 ports aur 1x USB-C charging port. Laptop ke liye perfect.",
    image: productUsbhub,
  },
  {
    id: 5,
    name: "HD Webcam 1080p",
    price: 4200,
    oldPrice: 5500,
    description: "Full HD webcam with auto-focus, built-in microphone aur privacy cover. Video calls ke liye ideal.",
    image: productWebcam,
  },
  {
    id: 6,
    name: "RGB Mouse Pad XL",
    price: 1800,
    description: "Extra large gaming mouse pad with RGB edge lighting, anti-slip base aur smooth cloth surface.",
    image: productMousepad,
  },
];

const features = [
  { icon: Truck, text: "Free Delivery (Rs. 3000+ orders)" },
  { icon: ShieldCheck, text: "7 Din Easy Return Policy" },
  { icon: Phone, text: "WhatsApp Support Available" },
];

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-7 h-7 text-primary" />
            <span className="font-display font-bold text-xl text-foreground">ZapCart</span>
          </div>
          <span className="text-sm text-muted-foreground hidden sm:block">🇵🇰 Pakistan's Computer Accessories Store</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[360px] flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="Computer accessories" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-primary-foreground mb-4 drop-shadow-lg">
            ⚡ ZapCart
          </h1>
          <p className="text-primary-foreground/90 text-lg sm:text-xl max-w-xl mx-auto font-body">
            Premium Computer Accessories — Cash on Delivery across Pakistan
          </p>
        </div>
      </section>

      {/* Features bar */}
      <section className="bg-primary">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-primary-foreground text-sm font-medium">
              <f.icon className="w-4 h-4" />
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground text-center mb-10">
          Hamari Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              oldPrice={product.oldPrice}
              description={product.description}
              image={product.image}
              onBuy={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="font-display font-semibold text-foreground">ZapCart</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2026 ZapCart — Pakistan ka apna Computer Accessories Store
          </p>
          <p className="text-muted-foreground text-xs mt-1">Cash on Delivery • All over Pakistan</p>
        </div>
      </footer>

      {/* Order Form Modal */}
      <OrderForm product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

export default Index;
