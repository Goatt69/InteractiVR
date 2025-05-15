import React from "react";
import {
  Tabs,
  Tab,
  Input,
  Link,
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure
} from "@heroui/react";

interface UserAuthProps {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export default function UserAuth({ isOpen, onOpenChange }: UserAuthProps) {
  const [selected, setSelected] = React.useState("login");
  const disclosure = useDisclosure();

  // Use provided props or internal state
  const drawerOpen = isOpen !== undefined ? isOpen : disclosure.isOpen;
  const handleOpenChange = onOpenChange || disclosure.onOpenChange;

  return (
    <>
      {/* Only show this button if no external control is provided */}
      {isOpen === undefined && (
        <Button onPress={disclosure.onOpen}>Sign In</Button>
      )}

      <Drawer
        isOpen={drawerOpen}
        onOpenChange={handleOpenChange}
        placement="right"
        size="sm"
        backdrop="opaque"
        radius="none"
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 text-center">
                Welcome to InteractiVR
              </DrawerHeader>
              <DrawerBody className="flex items-center">
                <div className="w-full max-w-md mx-auto">
                  <Tabs
                    fullWidth
                    aria-label="Authentication tabs"
                    selectedKey={selected}
                    size="md"
                    onSelectionChange={(key) => setSelected(key.toString())}
                  >
                    <Tab key="login" title="Login">
                      <form className="flex flex-col gap-4">
                        <Input isRequired label="Email" placeholder="Enter your email" type="email" />
                        <Input
                          isRequired
                          label="Password"
                          placeholder="Enter your password"
                          type="password"
                        />
                        <p className="text-center text-small">
                          Need to create an account?{" "}
                          <Link size="sm" onPress={() => setSelected("sign-up")}>
                            Sign up
                          </Link>
                        </p>
                        <div className="flex gap-2 justify-end">
                          <Button fullWidth color="primary">
                            Login
                          </Button>
                        </div>
                      </form>
                    </Tab>
                    <Tab key="sign-up" title="Sign up">
                      <form className="flex flex-col gap-4 h-[300px]">
                        <Input isRequired label="Name" placeholder="Enter your name" type="text" />
                        <Input isRequired label="Email" placeholder="Enter your email" type="email" />
                        <Input
                          isRequired
                          label="Password"
                          placeholder="Enter your password"
                          type="password"
                        />
                        <p className="text-center text-small">
                          Already have an account?{" "}
                          <Link size="sm" onPress={() => setSelected("login")}>
                            Login
                          </Link>
                        </p>
                        <div className="flex gap-2 justify-end">
                          <Button fullWidth color="primary">
                            Sign up
                          </Button>
                        </div>
                      </form>
                    </Tab>
                  </Tabs>
                </div>
              </DrawerBody>
              <DrawerFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  className="w-full"
                >
                  Cancel
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}

