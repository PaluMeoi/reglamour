import {
  ActionIcon,
  Button,
  Paper,
  Space,
  Stack,
  Text,
  Title
} from "@mantine/core"

import { Github } from "~Components/Icons/Github"
import { Pyramid } from "~Components/Icons/Pyramid"

export function Placeholder() {
  return (
    <>
      <Paper radius="md" w={300} h={300} p="xl">
        <Stack justify="space-between" align="center">
          <Stack align="center" justify="flex-start">
            <Title order={3}>reGlamour</Title>
            <Button
              component="a"
              href="https://ffxiv.eorzeacollection.com/glamours"
              leftSection={<Pyramid />}
              color="red">
              Eorzea Collection
            </Button>
          </Stack>
          <Space h="xl" />
          <Stack justify="flex-end" align="center" gap="xs">
            <ActionIcon
              component="a"
              href="https://github.com/PaluMeoi/reglamour"
              variant="transparent"
              color="cyan"
              size="xl">
              <Github />
            </ActionIcon>
            <Text c="dimmed" size="xs" ta="center">
              FINAL FANTASY XIV © 2010-2024 SQUARE ENIX CO., LTD. All Rights
              Reserved.
            </Text>
          </Stack>
        </Stack>
      </Paper>
    </>
  )
}
