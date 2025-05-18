'use client';

import React from 'react';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem, CircularProgress, Image } from '@heroui/react';

interface Theme {
  id: string;
  name: string;
  description: string;
  progress: number;
  totalItems: number;
  completedItems: number;
  imageUrl: string;
}

interface ThemeSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  themes: Theme[];
  selectedTheme: string;
  onThemeSelection: (themeId: string) => void;
  onStartExperience: () => void;
}

export default function ThemeSelectionModal({
  isOpen,
  onOpenChange,
  themes,
  selectedTheme,
  onThemeSelection,
  onStartExperience
}: ThemeSelectionModalProps) {

  // Get the selected theme details
  const selectedThemeDetails = themes.find(theme => theme.id === selectedTheme);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">Choose Your VR Theme</h2>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Select
                  label="Select Theme"
                  placeholder="Select a VR theme"
                  selectedKeys={selectedTheme ? [selectedTheme] : []}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0]?.toString() || '';
                    onThemeSelection(selectedKey);
                  }}
                  className="w-full"
                >
                  {themes.map((theme) => (
                    <SelectItem key={theme.id} textValue={theme.name}>
                      <div className="flex items-center justify-between w-full">
                        <span>{theme.name}</span>
                        <CircularProgress
                          classNames={{
                            svg: "w-6 h-6",
                            indicator: "stroke-blue-500",
                            track: "stroke-blue-100",
                          }}
                          value={theme.progress}
                          size="sm"
                          aria-label={`${theme.progress}% completed`}
                          showValueLabel={false}
                        />
                      </div>
                    </SelectItem>
                  ))}
                </Select>

                {selectedThemeDetails && (
                  <div className="mt-4 p-4 border rounded-lg">
                    <div className="mb-3 relative aspect-video rounded-md overflow-hidden">
                      <Image
                        src={selectedThemeDetails.imageUrl}
                        alt={selectedThemeDetails.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{selectedThemeDetails.name}</h3>
                      <div className="flex items-center">
                        <CircularProgress
                          classNames={{
                            svg: "w-10 h-10",
                            indicator: "stroke-blue-500",
                            track: "stroke-blue-100",
                            value: "text-sm font-semibold text-blue-500",
                          }}
                          value={selectedThemeDetails.progress}
                          strokeWidth={4}
                          showValueLabel={true}
                          valueLabel={`${selectedThemeDetails.progress}%`}
                          aria-label={`${selectedThemeDetails.progress}% completed`}
                        />
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{selectedThemeDetails.description}</p>
                    <div className="text-sm text-gray-500">
                      Progress: {selectedThemeDetails.completedItems}/{selectedThemeDetails.totalItems} items completed
                    </div>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onClick={onClose}>
                Cancel
              </Button>
              <Button color="primary" onClick={onStartExperience} isDisabled={!selectedTheme}>
                Start Experience
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
