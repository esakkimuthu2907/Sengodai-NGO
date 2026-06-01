import { useState, useEffect } from "react";

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    label: "Trusted\n& Secure",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="15" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M4 20c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    label: "Connecting\nLives",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
        <path d="M12 2C12 2 6 8.5 6 13a6 6 0 0012 0c0-4.5-6-11-6-11z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
      </svg>
    ),
    label: "Donate Blood\nSave Lives",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
      </svg>
    ),
    label: "Stronger\nTogether",
  },
];

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const duration = 3000;
    const interval = 30;
    let current = 0;
    const timer = setInterval(() => {
      current += (interval / duration) * 100;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(onComplete, 600);
        }, 400);
      }
      setProgress(current);
    }, interval);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`splash-screen ${fadeOut ? "splash-fade-out" : ""}`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #ffffff 0%, #fff5f5 40%, #ffffff 60%, #dc2626 92%, #b91c1c 100%)",
        overflow: "hidden",
      }}
    >
      {/* Background decorative elements */}
      <div className="splash-bg-decor" />

      {/* Main content */}
      <div className="splash-content">
        {/* Logo */}
        <div className="splash-logo-container">
          <img
            src="/sengodai-logo.png"
            alt="Sengodai Blood Network"
            className="splash-logo"
          />
        </div>

        {/* Title */}
        <h1 className="splash-title">SENGODAI</h1>

        {/* Subtitle with heartbeat line */}
        <div className="splash-subtitle-row">
          <svg className="splash-heartbeat" viewBox="0 0 60 20" fill="none">
            <path d="M0 10 L10 10 L15 3 L20 17 L25 7 L30 13 L35 10 L60 10" stroke="hsl(354, 80%, 52%)" strokeWidth="1.5" fill="none" />
          </svg>
          <span className="splash-subtitle">BLOOD NETWORK</span>
          <svg className="splash-heartbeat" viewBox="0 0 60 20" fill="none">
            <path d="M0 10 L25 10 L30 3 L35 17 L40 7 L45 13 L50 10 L60 10" stroke="hsl(354, 80%, 52%)" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        {/* Heart icon */}
        <div className="splash-heart">
          <svg viewBox="0 0 24 24" fill="hsl(354, 80%, 52%)" className="h-4 w-4">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        {/* Tagline */}
        <p className="splash-tagline">
          Every Drop Counts. Be a Hero. Save a Life.
        </p>

        {/* Loading indicator */}
        <div className="splash-loading">
          <div className="splash-loading-heart">
            <svg viewBox="0 0 24 24" fill="none" stroke="hsl(354, 80%, 52%)" strokeWidth="1.5" className="h-8 w-8">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <span className="splash-loading-text">Loading...</span>
        </div>

        {/* Progress bar */}
        <div className="splash-progress-track">
          <div
            className="splash-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom wave + features */}
      <div className="splash-bottom">
        {/* Wave SVG */}
        <svg
          className="splash-wave"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C360,120 720,0 1080,60 C1260,90 1350,80 1440,60 L1440,120 L0,120 Z"
            fill="#dc2626"
            fillOpacity="0.35"
          />
          <path
            d="M0,80 C320,40 640,110 960,70 C1200,40 1360,90 1440,70 L1440,120 L0,120 Z"
            fill="#dc2626"
            fillOpacity="0.6"
          />
          <path
            d="M0,95 C240,70 480,110 720,90 C960,70 1200,100 1440,85 L1440,120 L0,120 Z"
            fill="#dc2626"
          />
        </svg>

        {/* Feature pills */}
        <div className="splash-features">
          {features.map((f, i) => (
            <div key={i} className="splash-feature">
              <div className="splash-feature-icon">{f.icon}</div>
              <span className="splash-feature-label">
                {f.label.split("\n").map((line, j) => (
                  <span key={j}>
                    {line}
                    {j === 0 && <br />}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
