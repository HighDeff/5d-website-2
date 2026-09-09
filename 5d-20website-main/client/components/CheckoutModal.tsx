import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Smartphone,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
} from "lucide-react";
import { CartItem } from "@/hooks/useShoppingCart";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onCheckout: (method: "paypal" | "cashapp", contactInfo: ContactInfo) => void;
}

interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onCheckout,
}: CheckoutModalProps) {
  const [step, setStep] = useState<"contact" | "payment">("contact");
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [errors, setErrors] = useState<Partial<ContactInfo>>({});

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.08;
  const shipping = cartItems.length > 0 ? 9.99 : 0;
  const total = subtotal + tax + shipping;

  const validateContactInfo = () => {
    const newErrors: Partial<ContactInfo> = {};

    if (!contactInfo.firstName.trim()) newErrors.firstName = "Required";
    if (!contactInfo.lastName.trim()) newErrors.lastName = "Required";
    if (!contactInfo.email.trim()) newErrors.email = "Required";
    if (contactInfo.email && !/\S+@\S+\.\S+/.test(contactInfo.email)) {
      newErrors.email = "Invalid email";
    }
    if (!contactInfo.phone.trim()) newErrors.phone = "Required";
    if (!contactInfo.address.trim()) newErrors.address = "Required";
    if (!contactInfo.city.trim()) newErrors.city = "Required";
    if (!contactInfo.state.trim()) newErrors.state = "Required";
    if (!contactInfo.zipCode.trim()) newErrors.zipCode = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContactSubmit = () => {
    if (validateContactInfo()) {
      setStep("payment");
    }
  };

  const handlePayment = (method: "paypal" | "cashapp") => {
    onCheckout(method, contactInfo);
    onClose();
    setStep("contact");
    setContactInfo({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Checkout
          </DialogTitle>
          <DialogDescription>
            {step === "contact"
              ? "Please provide your contact and shipping information"
              : "Choose your payment method to complete your order"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Package className="mr-2 w-5 h-5" />
                Order Summary ({cartItems.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-contain bg-gray-50 rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        ${item.price} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                <div className="border-t pt-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {step === "contact" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <User className="mr-2 w-5 h-5" />
                  Contact & Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={contactInfo.firstName}
                      onChange={(e) =>
                        setContactInfo((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={contactInfo.lastName}
                      onChange={(e) =>
                        setContactInfo((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="mr-1 w-4 h-4" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) =>
                      setContactInfo((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone className="mr-1 w-4 h-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    value={contactInfo.phone}
                    onChange={(e) =>
                      setContactInfo((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="address" className="flex items-center">
                    <MapPin className="mr-1 w-4 h-4" />
                    Street Address *
                  </Label>
                  <Input
                    id="address"
                    value={contactInfo.address}
                    onChange={(e) =>
                      setContactInfo((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={contactInfo.city}
                      onChange={(e) =>
                        setContactInfo((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={contactInfo.state}
                      onChange={(e) =>
                        setContactInfo((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }))
                      }
                      className={errors.state ? "border-red-500" : ""}
                    />
                    {errors.state && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={contactInfo.zipCode}
                      onChange={(e) =>
                        setContactInfo((prev) => ({
                          ...prev,
                          zipCode: e.target.value,
                        }))
                      }
                      className={errors.zipCode ? "border-red-500" : ""}
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.zipCode}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleContactSubmit}
                  className="w-full"
                  size="lg"
                >
                  Continue to Payment
                </Button>
              </CardContent>
            </Card>
          )}

          {step === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button
                    onClick={() => handlePayment("paypal")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="lg"
                  >
                    <CreditCard className="mr-2 w-5 h-5" />
                    Pay with PayPal - ${total.toFixed(2)}
                  </Button>
                  <Button
                    onClick={() => handlePayment("cashapp")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    <Smartphone className="mr-2 w-5 h-5" />
                    Pay with Cash App - ${total.toFixed(2)}
                  </Button>
                </div>
                <Button
                  onClick={() => setStep("contact")}
                  variant="outline"
                  className="w-full"
                >
                  Back to Contact Info
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
