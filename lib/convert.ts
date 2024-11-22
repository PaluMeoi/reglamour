import { gzip } from "pako";
import type {Item} from "~lib/schema";

const slots = new Map([
  ["head", "Head"],
  ["body", "Body"],
  ["hands", "Hands"],
  ["legs", "Legs"],
  ["feet", "Feet"],
  ["earrings", "Ears"],
])

export function MakeGlamStructure(input: Item[]) {

}

export function convertToGlamourer(input: any) {
  const inputString = JSON.stringify(input);
  const codes = inputString.split("").map((e) => e.charCodeAt(0));
  const bytes = Uint8Array.from(codes);
  const compressed = gzip(bytes);
  const finalArray = new Uint8Array([...[6], ...compressed]);
  return Array.from(finalArray, (c) => String.fromCharCode(c)).join("");
}
