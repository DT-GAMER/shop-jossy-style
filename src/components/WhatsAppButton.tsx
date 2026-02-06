import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/types";

export default function WhatsAppButton() {
  const handleClick = () => {
    const message = encodeURIComponent("Hello! I'm interested in your products at Jossy-Diva Collections.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${message}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp shadow-lg transition-transform hover:scale-110 active:scale-95"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="h-7 w-7 text-whatsapp-foreground" fill="currentColor" />
    </button>
  );
}
