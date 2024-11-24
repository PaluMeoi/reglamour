import { Button, Paper, Stack, Title } from "@mantine/core";
import { Pyramid } from "~Components/Icons/Pyramid";

export function Placeholder() {
  return (
    <>
      <Paper radius="md" w={300} h={300} p="xl">
        <Stack justify="center" align="center">
          <Title order={3}>reGlamour</Title>
          <Button
            component="a"
            href="https://ffxiv.eorzeacollection.com/glamours"
            leftSection={<Pyramid />}
            color="red"
          >
            Eorzea Collection
          </Button>
        </Stack>
      </Paper>
    </>
  );
}
