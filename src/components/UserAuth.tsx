import { useEffect, useState } from "react";
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
  useDisclosure,
  Spinner
} from "@heroui/react";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema, registerSchema, errors } from "@/schemas/user.schema";
import { ZodError } from "zod";

interface UserAuthProps {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export default function UserAuth({ isOpen, onOpenChange }: UserAuthProps) {
  const [selected, setSelected] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [nameErrors, setNameErrors] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
  }>({});
  const { login, register, isLoading, error, isAuthenticated } = useAuth();
  const disclosure = useDisclosure();
  const drawerOpen = isOpen !== undefined ? isOpen : disclosure.isOpen;

  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      if (open) {
        disclosure.onOpen();
      } else {
        disclosure.onClose();
      }
    }

    if (!open) {
      resetForm();
    }
  };

  useEffect(() => {
    if (isAuthenticated && drawerOpen) {
      handleOpenChange(false);
    }
  }, [isAuthenticated, drawerOpen, handleOpenChange]);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setFormErrors({});
    setEmailErrors([]);
    setPasswordErrors([]);
    setNameErrors([]);
  };

  // Validation functions for signup form
  // Get error messages from the schema error object
  const validateEmail = (value: string): string[] => {
    const errorsList: string[] = [];

    if (!value) {
      errorsList.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errorsList.push(errors.email.invalid);
    }

    return errorsList;
  };

  const validatePassword = (value: string): string[] => {
    const errorsList: string[] = [];

    if (!value) {
      errorsList.push(errors.password.required);
    } else if (value.length < 8) {
      errorsList.push(errors.password.tooShort);
    }

    if (!/[A-Z]/.test(value)) {
      errorsList.push(errors.password.missingUppercase);
    }
    if (!/[a-z]/.test(value)) {
      errorsList.push(errors.password.missingLowercase);
    }
    if (!/[0-9]/.test(value)) {
      errorsList.push(errors.password.missingNumber);
    }

    return errorsList;
  };

  const validateName = (value: string): string[] => {
    const errorsList: string[] = [];

    if (!value) {
      errorsList.push(errors.name.required);
    } else if (value.length < 3) {
      errorsList.push(errors.name.tooShort);
    }

    return errorsList;
  };

  // Update validation errors in real-time only for signup form
  useEffect(() => {
    // Only validate in real-time for sign-up form
    if (selected === "sign-up") {
      setNameErrors(validateName(name));
      setEmailErrors(validateEmail(email));
      setPasswordErrors(validatePassword(password));
    } else {
      // Clear validation errors for login form
      setEmailErrors([]);
      setPasswordErrors([]);
    }
  }, [email, password, name, selected]);

  const validateForm = (): boolean => {
    try {
      if (selected === "login") {
        loginSchema.parse({ email, password });
      } else {
        registerSchema.parse({ name, email, password });
      }
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = error.errors.reduce((acc, curr) => {
          const field = curr.path[0] as string;
          acc[field] = curr.message;
          return acc;
        }, {} as Record<string, string>);

        setFormErrors(fieldErrors);
      } else {
        console.error('Validation error:', error);
      }
      return false;
    }
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      const validData = loginSchema.parse({ email, password });
      await login(validData.email, validData.password);
    } catch (error) {
      if (error instanceof ZodError) {
          const fieldErrors = error.errors.reduce((acc, curr) => {
          const field = curr.path[0] as string;
          acc[field] = curr.message;
          return acc;
        }, {} as Record<string, string>);

        setFormErrors(fieldErrors);
      } else {
        console.error('Login error:', error);
      }
    }
  };

  const handleSignUp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Don't proceed if there are validation errors
    if (nameErrors.length > 0 || emailErrors.length > 0 || passwordErrors.length > 0) {
      return;
    }

    try {
      const validData = registerSchema.parse({ name, email, password });
      await register(validData.name, validData.email, validData.password);
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = error.errors.reduce((acc, curr) => {
          const field = curr.path[0] as string;
          acc[field] = curr.message;
          return acc;
        }, {} as Record<string, string>);

        setFormErrors(fieldErrors);
      } else {
        console.error('Registration error:', error);
      }
    }
  };

  return (
    <>
      {isOpen === undefined && !isAuthenticated && (
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
                  {error && (
                    <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 rounded-md">
                      {error}
                    </div>
                  )}

                  <Tabs
                    fullWidth
                    aria-label="Authentication tabs"
                    selectedKey={selected}
                    size="md"
                    onSelectionChange={(key) => {
                      setSelected(key.toString());
                      setFormErrors({});
                    }}
                  >
                    <Tab key="login" title="Login">
                      <form className="flex flex-col gap-4">
                        <Input
                          isRequired
                          isDisabled={isLoading}
                          label="Email"
                          placeholder="Enter your email"
                          type="email"
                          value={email}
                          onValueChange={setEmail}
                          validationBehavior="aria"
                          errorMessage={formErrors.email}
                          isInvalid={!!formErrors.email}
                        />
                        <Input
                          isRequired
                          label="Password"
                          placeholder="Enter your password"
                          type="password"
                          value={password}
                          onValueChange={setPassword}
                          errorMessage={passwordErrors.length > 0 ? (
                            <ul className="list-disc pl-4">
                              {passwordErrors.map((error, i) => (
                                <li key={i} className="text-xs">{error}</li>
                              ))}
                            </ul>
                          ) : undefined}
                          isInvalid={passwordErrors.length > 0}
                        />
                        <p className="text-center text-small">
                          Need to create an account?{" "}
                          <Link size="sm" onPress={() => setSelected("sign-up")}>
                            Sign up
                          </Link>
                        </p>
                        <div className="flex gap-2 justify-end">
                          <Button
                            fullWidth
                            color="primary"
                            isDisabled={isLoading}
                            onClick={handleLogin}
                          >
                            {isLoading ? <Spinner size="sm" color="white" /> : "Login"}
                          </Button>
                        </div>
                      </form>
                    </Tab>
                    <Tab key="sign-up" title="Sign up">
                      <form className="flex flex-col gap-4">
                        <Input
                          isRequired
                          variant="faded"
                          label="Name"
                          placeholder="Enter your name"
                          type="text"
                          value={name}
                          onValueChange={setName}
                          errorMessage={nameErrors.length > 0 ? (
                            <ul className="list-disc pl-4">
                              {nameErrors.map((error, i) => (
                                <li key={i} className="text-xs text-gray-500">{error}</li>
                              ))}
                            </ul>
                          ) : undefined}
                          isInvalid={nameErrors.length > 0}
                        />
                        <Input
                          isRequired
                          variant="faded"
                          label="Email"
                          placeholder="Enter your email"
                          type="email"
                          value={email}
                          onValueChange={setEmail}
                          errorMessage={emailErrors.length > 0 ? (
                            <ul className="list-disc pl-4 text-gray-500">
                              {emailErrors.map((error, i) => (
                                <li key={i} className="text-xs">{error}</li>
                              ))}
                            </ul>
                          ) : undefined}
                          isInvalid={emailErrors.length > 0}
                        />
                        <Input
                          isRequired
                          variant="faded"
                          label="Password"
                          placeholder="Enter your password"
                          type="password"
                          value={password}
                          onValueChange={setPassword}
                          errorMessage={passwordErrors.length > 0 ? (
                            <ul className="list-disc pl-4 text-gray-500">
                              {passwordErrors.map((error, i) => (
                                <li key={i} className="text-xs">{error}</li>
                              ))}
                            </ul>
                          ) : undefined}
                          isInvalid={passwordErrors.length > 0}
                        />
                        <p className="text-center text-small">
                          Already have an account?{" "}
                          <Link size="sm" onPress={() => setSelected("login")}>
                            Login
                          </Link>
                        </p>
                        <div className="flex gap-2 justify-end">
                          <Button
                            fullWidth
                            color="primary"
                            isDisabled={isLoading || nameErrors.length > 0 || emailErrors.length > 0 || passwordErrors.length > 0}
                            onClick={handleSignUp}
                          >
                            {isLoading ? <Spinner size="sm" color="white" /> : "Sign up"}
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