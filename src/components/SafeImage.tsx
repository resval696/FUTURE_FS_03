import React, { useState } from "react";
import { Loader2, ImageOff } from "lucide-react";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  containerStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  loading?: "lazy" | "eager";
}

export default function SafeImage({
  src,
  alt,
  className = "",
  containerStyle,
  style,
  loading,
}: SafeImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-primary-light, #f3f4f6)",
        overflow: "hidden",
        borderRadius: "inherit",
        ...containerStyle,
      }}
    >
      {/* Loading Spinner */}
      {isLoading && !hasError && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 10,
          }}
        >
          <Loader2
            className="animate-spin"
            style={{
              width: "24px",
              height: "24px",
              color: "var(--color-primary, #6366f1)",
            }}
          />
        </div>
      )}

      {/* Error Fallback */}
      {hasError ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            textAlign: "center",
            color: "#9ca3af",
            gap: "8px",
          }}
        >
          <ImageOff size={32} strokeWidth={1.5} />
          <span style={{ fontSize: "0.8rem", fontWeight: 500 }}>
            Image non disponible
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`${className} transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          loading={loading}
          onLoad={() => setIsLoading(false)}
          onError={() => setHasError(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: style?.objectFit || "cover",
            ...style,
          }}
        />
      )}
    </div>
  );
}
