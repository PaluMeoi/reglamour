import {
  Button,
  Center,
  Image,
  Loader,
  Paper,
  Stack,
  Text
} from "@mantine/core"
import { useState } from "react"

import { CopyEquipmentButton } from "~Components/CopyEquipmentButton"
import { Placeholder } from "~Components/Placeholder"
import type { Item } from "~lib/schema"
import { useQuery } from "~node_modules/@tanstack/react-query"
import classes from "~popup/App.module.css"

declare const browser: typeof chrome

const browserAPI = typeof browser !== "undefined" ? browser : chrome

function EquipmentItem(props: { item: Item; toggle: (slot: string) => void }) {
  return (
    <Button
      color={props.item.selected ? "teal" : "grey.2"}
      onClick={() => props.toggle(props.item.slot)}
      leftSection={
        <Image
          src={props.item.imageUrl}
          w="xl"
          style={{ filter: `grayscale(${props.item.selected ? "0" : "1"})` }}
        />
      }
      justify="space-between"
      variant={props.item.selected ? "filled" : "light"}
      className={classes.buttonRoot}>
      <div className={classes.scrollText}>{props.item.name}</div>
    </Button>
  )
}

async function isEorzeaCollection() {
  const siteRegex = /https:\/\/ffxiv\.eorzeacollection\.com\/glamour\/(\d+)\/.*/
  const tab = await browser.tabs
    .query({ active: true, currentWindow: true })
    .then((tab) => tab[0].url)
  return siteRegex.test(tab)
}

async function getEquipment(): Promise<Item[]> {
  return new Promise((resolve, reject) => {
    browserAPI.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]?.id) {
        reject(new Error("No active tab found"))
        return
      }
      browserAPI.tabs.sendMessage(tabs[0].id, "get-equipment", (response) => {
        if (browserAPI.runtime.lastError) {
          reject(browserAPI.runtime.lastError)
        } else {
          resolve(response)
        }
      })
    })
  })
}

export function App() {
  const [equipment, setEquipment] = useState([])

  const isEC = useQuery({
    queryKey: ["is-EorzeaCollection"],
    queryFn: isEorzeaCollection
  })

  const equipmentQuery = useQuery({
    queryKey: ["equipment"],
    queryFn: async (): Promise<Item[]> => {
      const data = await getEquipment()
      setEquipment(data)
      return data
    },
    enabled: isEC.data
  })

  function handleToggle(slot: string) {
    const newEquipment = equipment.map((item: Item) => {
      if (item.slot === slot) {
        item.selected = !item.selected
        return item
      }
      return item
    })
    setEquipment(newEquipment)
  }

  if (!isEC.data && isEC.isFetched) {
    return <Placeholder />
  }

  if (!equipmentQuery.data) {
    return (
      <Stack w={300} h={300}>
        <Loader color={"cyan"} />
        <Text>Loading...</Text>
      </Stack>
    )
  }

  return (
    <Paper w={300} p={"xs"}>
      <Stack gap="sm">
        <Paper withBorder p="xs">
          <Stack gap="3">
            {equipment.map((item: Item) => {
              return (
                <EquipmentItem
                  key={item.slot}
                  item={item}
                  toggle={handleToggle}
                />
              )
            })}
          </Stack>
        </Paper>
        <Center>
          <CopyEquipmentButton equipment={equipment} />
        </Center>
      </Stack>
    </Paper>
  )
}
