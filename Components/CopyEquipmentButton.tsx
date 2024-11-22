import {Button, ButtonGroup, CopyButton} from "@mantine/core";
import {EquipmentSchema, type Item} from "~lib/schema";
import {useState} from "react";

interface Props {
  equipment: Item[];
}

export function CopyEquipmentButton(props: Props) {
  const [clipboard, setClipboard] = useState("Test")

  const {equipment} = props;

  async function mergeCopy() {
    try {
      const clipboardContent = JSON.parse(await navigator.clipboard.readText());
      setClipboard(clipboardContent)
      console.log(clipboardContent);
      if (EquipmentSchema.safeParse(clipboardContent)) {
        console.log(EquipmentSchema.safeParse(clipboardContent));


      }
    } catch (error) {
      console.warn("REGLAMOUR: Invalid base glamour to merge.")
    }

  }

  return (
    <>
      <ButtonGroup>
        <CopyButton value={JSON.stringify(equipment.filter((item: Item) => item.selected), null, 2)}>
          {({copied, copy}) => (
            <Button color={copied ? "teal" : "blue"} onClick={copy}>
              {copied ? "Copied!" : "Copy"}
            </Button>
          )}
        </CopyButton>
        <Button onClick={mergeCopy}>
          Merge
        </Button>
      </ButtonGroup>
    </>
  );
}
