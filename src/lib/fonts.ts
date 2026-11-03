import { GeistMono } from "geist/font/mono";
import {
  GeistPixelCircle,
  GeistPixelGrid,
  GeistPixelLine,
  GeistPixelSquare,
  GeistPixelTriangle,
} from "geist/font/pixel";
import { GeistPixel } from "geist/font/pixel/variable";
import { GeistSans } from "geist/font/sans";
import {
  GeistSerif,
  GeistSerifHeart,
  GeistSerifRegular,
  GeistSerifSquare,
  GeistSerifTriangle,
} from "geist/font/serif";

export const fontVariables = [
  GeistSans.variable,
  GeistMono.variable,
  GeistSerif.variable,
  GeistPixel.variable,
].join(" ");

export const fontClasses = {
  sans: GeistSans.className,
  mono: GeistMono.className,
  serif: GeistSerif.className,
  serifRegular: GeistSerifRegular.className,
  serifSquare: GeistSerifSquare.className,
  serifTriangle: GeistSerifTriangle.className,
  serifHeart: GeistSerifHeart.className,
  pixelSquare: GeistPixelSquare.className,
  pixelGrid: GeistPixelGrid.className,
  pixelCircle: GeistPixelCircle.className,
  pixelTriangle: GeistPixelTriangle.className,
  pixelLine: GeistPixelLine.className,
};
