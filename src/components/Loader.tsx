import React from "react";

interface LoaderProps {
  text: string;
  variant: "image" | "workspace";
  loading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ loading, text, variant }) => {
  if (!loading) {
    return null;
  }

  if (variant === "workspace") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-50">
        <div className="text-brand-500 text-center">
          <div className="w-12 h-12 mb-2 relative mx-auto">
            <div className="absolute w-full h-full rounded-full animate-spin border-2 border-transparent [border-top-color:theme(colors.brand.300)] [border-bottom-color:theme(colors.brand.100)]">
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0%,theme(colors.brand.300)_30%,theme(colors.brand.100)_70%,transparent_100%)] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
              <div className="absolute inset-[3px] bg-brand-100 rounded-full" />
            </div>
          </div>
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 animate-gradient-flow" />
      <div className="absolute inset-0 bg-turquoise-gradient bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-900/80 to-brand-900/30" />
      <div className="relative text-brand-700 text-center flex flex-col items-center z-10">
        <div className="w-12 h-12 mb-2 relative">
          <div className="absolute w-full h-full rounded-full animate-spin border-2 border-transparent [border-top-color:theme(colors.brand.300)] [border-bottom-color:theme(colors.brand.100)]">
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0%,theme(colors.brand.300)_30%,theme(colors.brand.100)_70%,transparent_100%)] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]">
              <div className="absolute inset-[3px] bg-brand-900 rounded-full" />
            </div>
          </div>
        </div>
        {text}
      </div>
    </div>
  );
};

export default Loader;
