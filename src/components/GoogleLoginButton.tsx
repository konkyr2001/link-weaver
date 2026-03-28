import { useRef, useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useTheme } from "@/hooks/use-theme";

type GoogleLoginButtonProps = {
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  onSuccess: (credentialResponse: any) => void;
  onError?: () => void;
};

export function GoogleLoginButton({ text = "continue_with", onSuccess, onError }: GoogleLoginButtonProps) {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(Math.floor(entry.contentRect.width));
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ colorScheme: theme }} className="google-login w-full">
      {width && (
        <GoogleLogin
          key={`${theme}-${width}`}
          text={text}
          size="large"
          type="standard"
          logo_alignment="left"
          width={String(width)}
          theme={theme === "dark" ? "filled_black" : "outline"}
          onSuccess={onSuccess}
          onError={onError ?? (() => console.log("login failed"))}
        />
      )}
    </div>
  );
}
