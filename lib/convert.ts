import { gzip } from "pako"

import type { Item, XivApi } from "~lib/schema"
import { stains } from "~lib/stain"

const slots = new Map([
  ["head", "Head"],
  ["body", "Body"],
  ["hands", "Hands"],
  ["legs", "Legs"],
  ["feet", "Feet"],
  ["earrings", "Ears"],
  ["necklace", "Neck"],
  ["bracelets", "Wrists"],
  ["weapon", "MainHand"],
  ["offhand", "OffHand"],
  ["lring", "LFinger"],
  ["rring", "RFinger"]
])

export async function getItemIdsMap(input: Item[]) {
  if (input.length === 0) return new Map()
  const filter = `(${input.map((item) => `Icon=${item.id}`).join(" ")})`
  const url = `https://beta.xivapi.com/api/1/search?sheets=Item&query=${filter}`
  const result = await fetch(url, { cache: "force-cache" })
  const data = (await result.json()) as XivApi
  return new Map(
    input.map((item) => [
      item.id,
      data.results.find(
        (i) => i.fields.Icon.id === item.id && i.fields.Name === item.name
      ).row_id
    ])
  )
}

export function MakeGlamStructure(
  input: Item[],
  items: Iterable<readonly [unknown, unknown]>
) {
  const itemsMap = new Map(items)
  const Equipment = {}

  function buildItem(item: Item, slotOverride?: string) {
    const slot = slotOverride || slots.get(item.slot)
    // Get Dyes
    const dyes = {}
    const dye1 = item.dyes[0] ? item.dyes[0].name : null
    const dye2 = item.dyes[1] ? item.dyes[1].name : null

    if (dye1) {
      dyes["Stain"] = stains.get(dye1)
    }
    if (dye2) {
      dyes["Stain2"] = stains.get(dye2)
    }

    Equipment[slot] = {
      ItemId: itemsMap.get(item.id),
      Apply: item.selected,
      ApplyStain: item.selected,
      ...dyes
    }

    if (
      slot === "MainHand" &&
      input.filter((i) => i.slot === "offhand").length === 0
    ) {
      buildItem(item, "OffHand")
    }
  }

  for (const item of input) {
    if (slots.has(item.slot)) {
      try {
        buildItem(item)
      } catch (e) {
        console.error("Error building item", item)
      }
    }
  }
  return { FileVersion: 1, Equipment }
}

export function convertToGlamourer(input: any, itemsMap: Map<number, number>) {
  const inputString = JSON.stringify(MakeGlamStructure(input, itemsMap))
  const codes = inputString.split("").map((e) => e.charCodeAt(0))
  const bytes = Uint8Array.from(codes)
  const compressed = gzip(bytes)
  const finalArray = new Uint8Array([...[6], ...compressed])
  const result = Array.from(finalArray, (c) => String.fromCharCode(c)).join("")
  return btoa(result)
}
