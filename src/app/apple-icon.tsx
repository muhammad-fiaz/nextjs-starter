import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 96,
        background: "#09090b",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fafafa",
        borderRadius: 36,
        fontWeight: 800,
        fontFamily: "sans-serif",
      }}
    >
      N
    </div>,
    {
      ...size,
    },
  );
}
