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

export {
  GeistSans,
  GeistMono,
  GeistPixel,
  GeistPixelSquare,
  GeistPixelGrid,
  GeistPixelCircle,
  GeistPixelTriangle,
  GeistPixelLine,
  GeistSerif,
  GeistSerifRegular,
  GeistSerifSquare,
  GeistSerifTriangle,
  GeistSerifHeart,
};

/**
 * Combined font CSS variable classNames for application root layout.
 */
export const fontVariables = [
  GeistSans.variable,
  GeistMono.variable,
  GeistPixel.variable,
  GeistPixelSquare.variable,
  GeistPixelGrid.variable,
  GeistPixelCircle.variable,
  GeistPixelTriangle.variable,
  GeistPixelLine.variable,
  GeistSerif.variable,
  GeistSerifRegular.variable,
  GeistSerifSquare.variable,
  GeistSerifTriangle.variable,
  GeistSerifHeart.variable,
].join(" ");
