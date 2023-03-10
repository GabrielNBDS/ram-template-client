import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import ShellHeader from "./ShellHeader";
import { Sidebar } from "./Sidebar";

export default function Shell() {
  const [opened, setOpened] = useState(false);

  const isMd = useMediaQuery('(min-width: 992px)');

  return (
    <>
      {!isMd && <ShellHeader setOpened={setOpened} opened={opened} />}
      <Sidebar setOpened={setOpened} opened={opened} />
    </>
  )
}