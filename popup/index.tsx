import {
  Button, ButtonGroup, Center, CopyButton,
  Image,
  Loader, Paper,
  Stack,
  Text,
} from "@mantine/core";
import classes from "./index.module.css"

import "@mantine/core/styles.css";
import { ThemeProvider } from "~theme";
import { Storage } from "@plasmohq/storage";
import { useStorage } from "@plasmohq/storage/dist/hook";
import type { Item } from "~lib/schema";
import {CopyEquipmentButton} from "~Components/CopyEquipmentButton";

function EquipmentItem(props: { item: Item; toggle: (slot: string) => void }) {
  return (
    <Button
      color={props.item.selected ? "teal" : "grey.2"}
      onClick={() => props.toggle(props.item.slot)}
      leftSection={<Image src={props.item.imageUrl} w="xl" style={{filter: `grayscale(${props.item.selected ? "0" : "1"})`}}/>}
      justify="space-between"
      variant={props.item.selected ? "filled": "light"}
      className={classes.buttonRoot}
    >
      <div className={classes.scrollText}>{props.item.name}</div>
    </Button>
  );
}

function IndexPopup() {
  const storage = new Storage({area: "local"});

  const [equipment, setEquipment] = useStorage({
    key: "equipment",
    instance: storage,
  });

  const [onEC] = useStorage({
    key: "onEC",
    instance: storage,
  })


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

  if (onEC === "false") {
    return <ThemeProvider>
      <Paper miw={500} mih={300} withBorder m = "lg">
        <Center>
          <Text fz="lg">
            Visit Eorzea Collection to use this extension.
          </Text>
        </Center>
      </Paper>
    </ThemeProvider>
  }

  if (!equipment) {
    return (
      <ThemeProvider>
        <Stack miw={500} >
          <Loader color={"cyan"} />
          <Text>
            Loading...
          </Text>
        </Stack>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Paper miw={300} p={"xs"}>
        <Stack gap="sm">
          <Paper withBorder p="xs">
            <Stack gap="3">
              {equipment.map((item: Item) => {
                return (
                  <EquipmentItem key={item.slot} item={item} toggle={handleToggle} />
                );
              })}
            </Stack>
          </Paper>
          <Center>
            <CopyEquipmentButton equipment={equipment} />
          </Center>
        </Stack>
      </Paper>
    </ThemeProvider>
  );
}

export default IndexPopup;
