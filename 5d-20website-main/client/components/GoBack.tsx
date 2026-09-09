import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GoBackProps {
  to?: string;
  label?: string;
  className?: string;
}

export default function GoBack({
  to,
  label = "Go Back",
  className = "",
}: GoBackProps) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (to) {
      navigate(to);
    } else {
      // Go back in history, or to home if no history
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/");
      }
    }
  };

  return (
    <Button
      onClick={handleGoBack}
      variant="ghost"
      className={`flex items-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 ${className}`}
    >
      <ArrowLeft className="mr-2 w-4 h-4" />
      {label}
    </Button>
  );
}
