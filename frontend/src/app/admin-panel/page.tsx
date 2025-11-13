import { Box, Heading } from "@chakra-ui/react";
import { AdminPanelUsersManager } from "./components/AdminPanelUsersManager";
export default async function AdmimPanelPage() {
  return (
    <Box>
      <Heading textStyle="heading.title" mb="35px">
        Управление пользователями
      </Heading>
      <AdminPanelUsersManager/>
    </Box>
  );
}
