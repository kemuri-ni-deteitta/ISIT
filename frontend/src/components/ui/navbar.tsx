import { HamburgerIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Portal, Drawer } from "@chakra-ui/react";
import { SearchInput } from "./SearchInput";
import { LuHouse, LuCreditCard, LuChartArea, LuUsers, LuSettings, LuBanknote, LuBookUser, LuCoins } from "react-icons/lu";
import { useRouter } from "next/navigation";

const pages = [
  { name: "Главная", path: "/", icon: LuHouse },
  { name: "Учёт затрат", path: "/expenses", icon: LuCreditCard },
  { name: "Аналитика и отчётность", path: "/analytics", icon: LuChartArea },
  { name: "Управление пользователями", path: "/admin-panel", icon: LuUsers },
  { name: "Типы затрат", path: "/type_of_expenditure", icon: LuCoins },
  { name: "Источники финансирования", path: "/funding-sources", icon: LuBanknote },
  { name: "Подразделения", path: "/departments", icon: LuBookUser },
];

export default function Navbar() {
  const router = useRouter();
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  return (
    <Drawer.Root placement="start">
      <Box as="nav" position="fixed" top="0" left="0" right="0" height="60px" px="4" borderBottomWidth="1px" bg="white">
        <Flex align="center" justify="space-between" height="100%">
          <Drawer.Trigger asChild>
            <IconButton variant="ghost" aria-label="Open menu">
              <HamburgerIcon />
            </IconButton>
          </Drawer.Trigger>
        </Flex>
      </Box>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Body pt="32px">
              <SearchInput
                onChange={() => {}}
              />
              <Flex direction="column" mt={2}>
                {pages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <Flex
                      key={page.path}
                      align="center"
                      gap="3"
                      cursor="pointer"
                      _hover={{ bg: "gray.100", borderRadius: "md" }}
                      p="2"
                      onClick={() => handleNavigate(page.path)}
                    >
                      <Icon size={20} />
                      <Box>{page.name}</Box>
                    </Flex>
                  );
                })}
              </Flex>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
