import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FF6A2B",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: 2,
          transform: "skewX(-10deg)",
        }}
      >
        I
      </div>
    ),
    size
  );
}
