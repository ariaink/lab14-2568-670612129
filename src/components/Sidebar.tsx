import { NavLink as RouterNavLink } from "react-router-dom";
import {
  NavLink,
  Stack,
  Box,
  Avatar,
  Indicator,
  Text,
  Group,
} from "@mantine/core";
export default function Sidebar() {
  return (
    <Stack
      align="stretch"
      justify="space-between"
      gap="md"
      style={{ height: "100%" }}
    >
      <Box>
        <NavLink
          label="MarathonRegisterPage1"
          component={RouterNavLink}
          to="/"
        />
        <NavLink
          label="MarathonRegisterPage2"
          component={RouterNavLink}
          to="/MarathonRegisterPage2"
        />
      </Box>
      <Box p={10}>
        <Group>
          <Indicator
            inline
            size={12}
            offset={7}
            position="bottom-end"
            color="red"
            withBorder
          >
            <Avatar size="md" radius="xl" src="/charliebrown.jpg" />
          </Indicator>
          <Text component={RouterNavLink} to="/">
            User : Rungphailin : Admin
          </Text>
        </Group>
      </Box>
    </Stack>
  );
}
