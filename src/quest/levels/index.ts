import type { Level } from "../types";
import { premiersPas } from "./premiersPas";
import { tourelles } from "./tourelles";

// Quest order: follows the chapters. A level unlocks once the previous one is passed.
export const questLevels = [premiersPas, tourelles] as Level<unknown>[];
