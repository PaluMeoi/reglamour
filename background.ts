import {Storage} from "@plasmohq/storage"

export {}

const storage = new Storage({area: "local"})

// chrome.tabs.onActivated.addListener((activeTab) => {
//   console.log(activeTab);
//   chrome.tabs.get(activeTab.tabId, (tab) => {
//     if (tab.url.startsWith("https://ffxiv.eorzeacollection.com/glamour")) {
//       chrome.tabs.sendMessage(activeTab.tabId, {message: "TabActivated"})
//       storage.set("onEC", "true")
//     } else {
//       storage.set("onEC", "false");
//     }
//   })
// })
