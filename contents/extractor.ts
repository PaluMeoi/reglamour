import type { PlasmoCSConfig } from "plasmo";
import { ItemSchema } from "~lib/schema";

export const config: PlasmoCSConfig = {
  matches: ["https://ffxiv.eorzeacollection.com/glamour/*"],
};

declare const browser: typeof chrome;

const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

console.info("Extraction Script loading");

try {
  browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message:", message);

    if (message === "get-equipment") {
      extractEquipment().then(equipment => {
        console.log("Sending back equipment:", equipment);
        sendResponse(equipment);
      });
      return true;
    }

    console.warn("Unknown message type", message);
    return false;
  });

  console.info("Listener successfully added");
} catch (error) {
  console.error("Error setting up listener:", error);
}

const glamIdRegex =
  /https:\/\/ffxiv\.eorzeacollection\.com\/glamour\/(\d+)\/.*/;

function extractDyes(element: Element) {
  const dyes = [];
  const dyesElements = element.parentElement.querySelectorAll(
    ".c-gear-slot-item-info-color",
  );
  const dyeRegex = /([⬤◯]) (?<dye>.+)/;

  for (const [i, e] of dyesElements.entries()) {
    if (dyeRegex.test(e.textContent)) {
      dyes.push({
        name: dyeRegex.exec(e.textContent).groups.dye,
        slot: i,
      });
    }
  }
  return dyes;
}

async function extractEquipment() {
  const equipment = [];

  const regex = /\/glamours\/(?<slot>\w+)\/\d+/;

  const handElements = Array.from(
    document.querySelectorAll('a[href*="/glamours/"]'),
  ).filter((element) => regex.test(element.getAttribute("href")!));

  for (const element of handElements) {
    if (element.hasAttribute("href")) {
      const regexGroups = regex.exec(element.getAttribute("href")!)?.groups;

      const itemData = ItemSchema.parse(regexGroups);

      const nameElement = element.parentElement!.querySelector(
        ".c-gear-slot-item-name",
      );
      const imageUrlElement = element.parentElement!.querySelector(
        ".b-info-box-item-icon",
      );

      itemData["dyes"] = extractDyes(element);
      itemData["name"] = nameElement!.textContent!;
      itemData["imageUrl"] = imageUrlElement!.getAttribute("src")!;

      const iconIdRegex =
        /https:\/\/icons\.eorzeacollection\.com\/\d+\/(?<id>\d+)\.png/;
      itemData["id"] = Number(iconIdRegex.exec(itemData.imageUrl).groups["id"]);

      equipment.push(itemData);
    }
  }
  return equipment;
}
