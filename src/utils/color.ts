import { z } from 'zod';

export interface HueColorConfig {
  /// 0-360
  angle: number
  /// 0-100
  saturation: number
  /// 0-100
  lightness: number
  /// 0-100
  alpha?: number
}

export const HueColorConfig_zod = z.object({
  angle: z.number(),
  saturation: z.number(),
  lightness: z.number(),
  alpha: z.number().optional(),
});

export function hueColorConfigToColorString(colorConfig: HueColorConfig) {
  return `hsl(${colorConfig.angle}, ${colorConfig.saturation}%, ${colorConfig.lightness}%)`;
}
