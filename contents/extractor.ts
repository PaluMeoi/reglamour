import type {PlasmoCSConfig} from "plasmo";
import {Storage} from "@plasmohq/storage";
import {ItemSchema} from "~lib/schema";

export const config: PlasmoCSConfig = {
  matches: ["https://ffxiv.eorzeacollection.com/glamour/*"],
};

const storage = new Storage({ area: "local" });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.message === "TabActivated") {
    console.log("TabActivated");
    init()
  }
})

setTimeout(init, 1000);

const glamIdRegex = /https:\/\/ffxiv\.eorzeacollection\.com\/glamour\/(\d+)\/.*/

function extractDyes(element: Element) {
  const dyes = []
  const dyesElements = element.parentElement.querySelectorAll(".c-gear-slot-item-info-color")
  const dyeRegex = /([⬤◯]) (?<dye>.+)/

  for (const [i, e] of dyesElements.entries()) {
    dyes.push({
      name: dyeRegex.exec(e.textContent).groups.dye,
      slot: i
    })
  }
  return dyes;
}

async function init() {
  // const glamId = glamIdRegex.exec(location.href)[1]
  //
  // // Check to see if the current glamId is the same
  // const storedGlamId = await storage.get("glamId")
  // if (storedGlamId === glamId) {
  //   return
  // }

  const equipment = [];

  const regex = /\/glamours\/(?<slot>\w+)\/(?<id>\d+)/;

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

      itemData["dyes"] = extractDyes(element)
      itemData["name"] = nameElement!.textContent!;
      itemData["imageUrl"] = imageUrlElement!.getAttribute("src")!;

      equipment.push(itemData);
    }
  }

  await storage.set("equipment", equipment);
  // storage.set("glamId", glamId);
}
