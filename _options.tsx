import {
  Button,
  Group,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { ThemeProvider } from "~theme";

import "@mantine/core/styles.css";
import { Storage } from "@plasmohq/storage";
import { useStorage } from "@plasmohq/storage/dist/hook";
import { useForm, zodResolver } from "@mantine/form";
import { OptionsSchema } from "~lib/schema";
import { useEffect } from "react";

export default function _options() {
  const [storage, setStorage] = useStorage({
    key: "options",
    instance: new Storage({ area: "sync" }),
  });

  const form = useForm({
    mode: "uncontrolled",
    initialValues: OptionsSchema.parse(storage),
    validate: zodResolver(OptionsSchema),
  });

  useEffect(() => {
    if (storage) {
      form.setValues(storage);
    }
  }, [storage]);

  function handleSubmit(values) {
    setStorage(values);
  }

  return (
    <ThemeProvider>
      <Stack justify="center" align="center">
        <Title>
          reGlamour Options
        </Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Customization"
              description="Default customizations to use for copying to glamourer"
              key={form.key("customization")}
              {...form.getInputProps("customization")}
            />
            <Group>
              <Button type="submit">
                Save
              </Button>
            </Group>
          </Stack>
        </form>
        <pre>
          {JSON.stringify(storage, null, 2)}
        </pre>
      </Stack>
    </ThemeProvider>
  );
}
