import { ImageResponse } from "next/og";

export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#09090b",
        color: "#fafafa",
        fontSize: 105,
        fontWeight: 900,
        borderRadius: 40,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      N
    </div>,
    {
      width: 192,
      height: 192,
    },
  );
}
