import { Button, CopyButton } from "@mantine/core";
import { type Item } from "~lib/schema";
import { useState } from "react";
import { convertToGlamourer, getItemIdsMap } from "~lib/convert";
import { useQuery } from "~node_modules/@tanstack/react-query";

interface Props {
  equipment: Item[];
}

export function CopyEquipmentButton(props: Props) {
  const { equipment } = props;

  const iconIds = equipment.map((item) => item.id);

  const itemIdsMapQuery = useQuery({
    queryKey: iconIds,
    queryFn: async () => {
      return getItemIdsMap(equipment);
    },
    enabled: equipment.length > 0,
  });

  const glamBase64 = convertToGlamourer(
    equipment.filter((item: Item) => item.selected),
    itemIdsMapQuery.data,
  );

  if (!glamBase64) {
    return null;
  }

  return (
    <>
      <CopyButton value={glamBase64}>
        {({ copied, copy }) => (
          <Button color={copied ? "teal" : "blue"} onClick={copy}>
            {copied ? "Copied!" : "Copy"}
          </Button>
        )}
      </CopyButton>
    </>
  );
}
