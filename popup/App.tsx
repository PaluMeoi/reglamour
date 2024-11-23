declare const browser: typeof chrome;

const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

import type { Item } from "~lib/schema";
import {
  Button,
  Center,
  Image,
  Loader,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import classes from "~popup/App.module.css";
import { useState } from "react";
import { CopyEquipmentButton } from "~Components/CopyEquipmentButton";
import { useQuery } from "~node_modules/@tanstack/react-query";

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
      className={classes.buttonRoot}
    >
      <div className={classes.scrollText}>{props.item.name}</div>
    </Button>
  );
}

async function getEquipment(): Promise<Item[]> {
  return new Promise((resolve, reject) => {
    browserAPI.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (!tabs[0]?.id) {
        reject(new Error ('No active tab found'))
        return;
      }

      console.log(tabs[0]);
      browserAPI.tabs.sendMessage(
        tabs[0].id,
        "get-equipment",
        (response) => {
          console.log("Got response in popup:", response);
          if (browserAPI.runtime.lastError) {
            reject(browserAPI.runtime.lastError);
          } else {
            resolve(response);
          }
        }
      )
    })
  })
}

export function App() {
  const [equipment, setEquipment] = useState([]);

  const equipmentQuery = useQuery({
    queryKey: ["equipment"],
    queryFn: async (): Promise<Item[]> => {
      const data = await getEquipment();
      console.log("Recieved equipment:", data);
      setEquipment(data);
      return data;
    },
  });

  function handleToggle(slot: string) {
    const newEquipment = equipment.map((item: Item) => {
      if (item.slot === slot) {
        item.selected = !item.selected;
        return item;
      }
      return item;
    });
    setEquipment(newEquipment);
  }

  if (!equipmentQuery.data) {
    return (
      <Stack miw={500}>
        <Loader color={"cyan"} />
        <Text>
          Loading...
        </Text>
      </Stack>
    );
  }

  return (
    <Paper miw={300} p={"xs"}>
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
              );
            })}
          </Stack>
        </Paper>
        <Center>
          <CopyEquipmentButton equipment={equipment} />
        </Center>
      </Stack>
    </Paper>
  );
}
