import { useState, useEffect } from "react";
import { toast } from "sonner";
import { X, Loader2 } from "lucide-react";
import { z } from "zod";

const pakistanCities = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
  "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala",
  "Hyderabad", "Bahawalpur", "Sargodha", "Abbottabad", "Mardan",
  "Sukkur", "Larkana", "Mingora", "Sahiwal", "Sheikhupura",
];

const orderSchema = z.object({
  name: z.string().trim().min(2, "Naam kam az kam 2 characters ka hona chahiye").max(100),
  mobile: z.string().trim().regex(/^03\d{9}$/, "Valid Pakistani mobile number darj karein (03XXXXXXXXX)"),
  address: z.string().trim().min(10, "Mukammal address darj karein").max(300),
  city: z.string().min(1, "City select karein"),
});

interface OrderFormProps {
  product: { name: string; price: number; image: string } | null;
  onClose: () => void;
}

const OrderForm = ({ product, onClose }: OrderFormProps) => {
  const [form, setForm] = useState({ name: "", mobile: "", address: "", city: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = orderSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      
      // WhatsApp message
      const msg = `🛒 *New ZapCart Order*%0A%0A📦 Product: ${product.name}%0A💰 Price: Rs. ${product.price.toLocaleString()}%0A%0A👤 Name: ${result.data.name}%0A📱 Mobile: ${result.data.mobile}%0A🏙️ City: ${result.data.city}%0A📍 Address: ${result.data.address}`;
      window.open(`https://wa.me/923701930960?text=${msg}`, "_blank");
      
      toast.success("Order successfully place ho gaya! WhatsApp pe confirm karein.");
      onClose();
      setForm({ name: "", mobile: "", address: "", city: "" });
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-form-title"
    >
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 id="order-form-title" className="font-display font-bold text-xl text-card-foreground">
            Order Place Karein
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 border-b border-border flex items-center gap-4">
          <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
          <div>
            <p className="font-display font-semibold text-card-foreground">{product.name}</p>
            <p className="text-primary font-bold">Rs. {product.price.toLocaleString()}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label htmlFor="order-name" className="block text-sm font-medium text-card-foreground mb-1">
              Naam *
            </label>
            <input
              id="order-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Apna poora naam likhein"
              className="w-full px-4 py-2.5 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition"
            />
            {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="order-mobile" className="block text-sm font-medium text-card-foreground mb-1">
              Mobile Number *
            </label>
            <input
              id="order-mobile"
              type="tel"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              placeholder="03XXXXXXXXX"
              className="w-full px-4 py-2.5 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition"
            />
            {errors.mobile && <p className="text-destructive text-xs mt-1">{errors.mobile}</p>}
          </div>

          <div>
            <label htmlFor="order-city" className="block text-sm font-medium text-card-foreground mb-1">
              City *
            </label>
            <select
              id="order-city"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full px-4 py-2.5 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition"
            >
              <option value="">City select karein</option>
              {pakistanCities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            {errors.city && <p className="text-destructive text-xs mt-1">{errors.city}</p>}
          </div>

          <div>
            <label htmlFor="order-address" className="block text-sm font-medium text-card-foreground mb-1">
              Mukammal Address *
            </label>
            <textarea
              id="order-address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Ghar ka number, gali, mohalla, area"
              rows={3}
              className="w-full px-4 py-2.5 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition resize-none"
            />
            {errors.address && <p className="text-destructive text-xs mt-1">{errors.address}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-primary-foreground py-3 rounded-md font-display font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Order place ho raha hai...</span>
              </>
            ) : (
              "Order Confirm Karein"
            )}
          </button>
          <p className="text-muted-foreground text-xs text-center">
            🇵🇰 Sirf Pakistan mein delivery available hai • Cash on Delivery
          </p>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
