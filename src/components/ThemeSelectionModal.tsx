'use client';

import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem, CircularProgress, Image, Spinner } from '@heroui/react';
import { ITheme, ThemeWithProgress } from '@/types/theme.types';
import { ApiResponse } from '@/types/api.types';
import ThemeService, { themeService } from '@/services/theme.service';

interface ThemeSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedTheme: string;
  onThemeSelection: (themeId: string) => void;
  onStartExperience: () => void;
}

export default function ThemeSelectionModal({
  isOpen,
  onOpenChange,
  selectedTheme,
  onThemeSelection,
  onStartExperience
}: ThemeSelectionModalProps) {
  const [themes, setThemes] = useState<ThemeWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // We're using the singleton themeService instance

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setLoading(true);
        const response = await themeService.getTheme();

        if (response.success && response.data) {
          // Transform ITheme[] to ThemeWithProgress[]
          // Transform API theme data to display format with progress stats
          const themesWithProgress = Array.isArray(response.data)
            ? response.data.map((theme: ITheme) => ({
                id: theme.id?.toString() || Math.random().toString(36).substring(7),
                name: theme.name,
                description: theme.description,
                imageUrl: theme.imageUrl,
                difficulty: theme.difficulty,
                isLocked: theme.isLocked,
                progress: 0, // Set default progress values
                totalItems: 0,
                completedItems: 0
              }))
            : [];

          setThemes(themesWithProgress);

          // If no theme is selected and we have themes, select the first one
          if (!selectedTheme && themesWithProgress.length > 0) {
            onThemeSelection(themesWithProgress[0].id);
          }
        } else {
          setError('Failed to fetch themes');
        }
      } catch (err) {
        console.error('Error fetching themes:', err);
        setError('An error occurred while fetching themes');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchThemes();
    }
  }, [isOpen]);

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
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Spinner size="lg" color="primary" label="Loading themes..." />
                </div>
              ) : error ? (
                <div className="p-4 text-red-500 text-center">
                  {error}
                  <Button
                    color="primary"
                    variant="light"
                    className="mt-2"
                    onClick={() => {
                      setError(null);
                      setLoading(true);
                      // Re-fetch themes
                      themeService.getTheme()
                        .then((response: ApiResponse<ITheme[]>) => {
                          if (response.success && response.data) {
                            const themesWithProgress = Array.isArray(response.data) 
                              ? response.data.map((theme: ITheme) => ({
                                  id: theme.id?.toString() || Math.random().toString(36).substring(7),
                                  name: theme.name,
                                  description: theme.description,
                                  imageUrl: theme.imageUrl,
                                  difficulty: theme.difficulty,
                                  isLocked: theme.isLocked,
                                  progress: 0,
                                  totalItems: 0,
                                  completedItems: 0
                                }))
                              : [];
                            setThemes(themesWithProgress);
                          } else {
                            setError('Failed to fetch themes');
                          }
                        })
                        .catch((err: unknown) => {
                          console.error('Error fetching themes:', err);
                          setError('An error occurred while fetching themes');
                        })
                        .finally(() => setLoading(false));
                    }}
                  >
                    Retry
                  </Button>
                </div>
              ) : themes.length === 0 ? (
                <div className="p-4 text-center">
                  No themes available
                </div>
              ) : (
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
                        {selectedThemeDetails.imageUrl ? (
                          <Image
                            src={selectedThemeDetails.imageUrl}
                            alt={selectedThemeDetails.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <span className="text-gray-400">No image available</span>
                          </div>
                        )}
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
                      <p className="text-gray-600 mb-3">{selectedThemeDetails.description || 'No description available'}</p>
                      <div className="text-sm text-gray-500">
                        Progress: {selectedThemeDetails.completedItems}/{selectedThemeDetails.totalItems} items completed
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onClick={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onClick={onStartExperience}
                isDisabled={!selectedTheme || loading}
              >
                Start Experience
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
