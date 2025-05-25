'use client';

import { Text, Root, Container, FontFamilyProvider } from '@react-three/uikit';
import { Card, Button } from '@react-three/uikit-apfel';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState, memo } from 'react';
import { Group } from 'three';
import { objectService } from '@/services/object.service';
import { vocabularyService } from '@/services/vocabulary.service';
import { IObject } from '@/types/object.types';
import { IVocabulary } from '@/types/vocabulary.types';

interface ObjectInfoCardProps {
  // Required props
  id: number;

  // Optional props
  name?: string;
  objectIdentifier?: string;
  vocabularyItems?: IVocabulary[];
  onClose?: () => void;
  position?: [number, number, number];
  isLoading?: boolean;
}

// Using memo to prevent unnecessary re-renders
const ObjectInfoCard = memo(function ObjectInfoCard({
  id,
  name,
  objectIdentifier,
  vocabularyItems,
  onClose,
  position = [0, 0, 0],
  isLoading = false
}: ObjectInfoCardProps) {
  const groupRef = useRef<Group>(null);
  const [object, setObject] = useState<IObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create curved effect by manipulating the group's rotation to always face the camera
  useFrame(({ camera }) => {
    if (groupRef.current) {
      // Make the UI panel face the camera
      groupRef.current.lookAt(camera.position);

      // Apply scale to the group instead of the Root component
      groupRef.current.scale.setScalar(0.5);
    }
  });

  // Process examples to handle string or array format
  const getProcessedExamples = (examples: string | string[] | null) => {
    if (!examples) return null;
    
    if (typeof examples === 'string') {
      try {
        return JSON.parse(examples);
      } catch (e) {
        return examples;
      }
    }
    
    return examples;
  };

  useEffect(() => {
    // If direct props are provided, create an object from them
    if (name && objectIdentifier) {
      const directObject: IObject = {
        id,
        name,
        objectIdentifier,
        interactable: true,
        themeId: 1, // Default theme ID
        vocabularyItems: vocabularyItems || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setObject(directObject);
      setLoading(false);
      return;
    }

    // Otherwise fetch object from API
    const fetchObject = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await objectService.getObjectById(id);

        if (response.success && response.data) {
          setObject(response.data);
        } else {
          setError('Failed to fetch object data');
        }
      } catch (error) {
        console.error('Error fetching object:', error);
        setError('Error loading object information');
      } finally {
        setLoading(false);
      }
    };

    fetchObject();
  }, [id, name, objectIdentifier, vocabularyItems]);

  // Use a layout that faces the camera and has correct scaling
  return (
    <group position={position} ref={groupRef}>
      {/* Root component for UI elements */}
      <Root>
        <FontFamilyProvider
          quicksand={{
            normal: 'fonts/Quicksand-msdf.json',
          }}
          timesNewRoman={{
            normal: 'fonts/TIMES.TTF-msdf.json',
          }}
        >
          <Container
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width={800}
            height="auto"
          >
            <Card
              width={750}
              borderRadius={16}
              padding={16}
              gap={16}
              flexDirection="column"
              backgroundColor="rgba(0, 0, 0, 0.8)"
              borderWidth={1}
              borderColor="rgba(255, 255, 255, 0.3)"
            >
              {loading ? (
                <Text fontFamily="quicksand" fontSize={24} color="white" fontWeight="normal">
                  Loading object information...
                </Text>
              ) : error ? (
                <Text fontFamily="quicksand" fontSize={24} color="rgb(255, 100, 100)" fontWeight="normal">
                  {error}
                </Text>
              ) : object ? (
                <>
                  {/* Header with object name */}
                  <Text fontFamily="quicksand" fontSize={30} color="white" fontWeight="normal">
                    {object.name}
                  </Text>

                  {/* Object ID and identifier */}
                  <Card flexDirection="row" gap={8} padding={8} backgroundColor="rgba(0, 0, 0, 0.4)" borderRadius={8}>
                    <Text fontFamily="quicksand" fontSize={20} color="rgb(173, 216, 230)">
                      ID: {object.id}
                    </Text>
                    <Text fontFamily="quicksand" fontSize={20} color="rgb(200, 200, 200)">
                      {object.objectIdentifier}
                    </Text>
                  </Card>

                  {/* Vocabulary items section */}
                  {isLoading ? (
                    <Card
                      flexDirection="column"
                      gap={12}
                      padding={12}
                      backgroundColor="rgba(0, 0, 0, 0.4)"
                      borderRadius={8}
                    >
                      <Text fontFamily="quicksand" fontSize={24} color="white" fontWeight="normal">
                        Loading vocabulary...
                      </Text>
                    </Card>
                  ) : (object.vocabularyItems && object.vocabularyItems.length > 0) && (
                    <Card
                      flexDirection="column"
                      gap={12}
                      padding={12}
                      backgroundColor="rgba(0, 0, 0, 0.4)"
                      borderRadius={8}
                    >
                      <Text fontFamily="quicksand" fontSize={24} color="white" fontWeight="normal" >
                        Vocabulary
                      </Text>

                      {object.vocabularyItems.map((vocab: IVocabulary) => (
                        <Card
                          key={vocab.id}
                          flexDirection="column"
                          gap={4}
                          padding={8}
                          backgroundColor="rgba(0, 0, 0, 0.3)"
                          borderRadius={8}
                        >
                          <Card flexDirection="row" justifyContent="space-between">
                            <Text fontFamily="quicksand" fontSize={20} color="white" fontWeight="normal" >
                              {vocab.englishWord}
                            </Text>
                            <Text fontFamily="timesNewRoman" fontSize={20} color="rgb(255, 255, 200)" fontWeight="normal" >
                              {vocab.pronunciation}
                            </Text>
                          </Card>
                          <Text fontFamily="quicksand" fontSize={20} color="rgb(173, 255, 173)" fontWeight="normal" >
                            {vocab.vietnameseTranslation}
                          </Text>
                          {vocab.examples && (
                            <Card
                              flexDirection="column"
                              gap={4}
                              padding={4}
                              backgroundColor="rgba(0, 0, 0, 0.2)"
                              borderRadius={4}
                            >
                              {Array.isArray(getProcessedExamples(vocab.examples)) ? (
                                getProcessedExamples(vocab.examples).map((example: string, index: number) => (
                                  <Text key={index} fontFamily="quicksand" fontSize={16} color="rgb(200, 200, 200)" fontWeight="normal" >
                                    - {example}
                                  </Text>
                                ))
                              ) : (
                                <Text fontFamily="quicksand" fontSize={16} color="rgb(200, 200, 200)" fontWeight="normal" >
                                  {vocab.examples}
                                </Text>
                              )}
                            </Card>
                          )}
                        </Card>
                      ))}
                    </Card>
                  )}
                </>
              ) : (
                <Text fontFamily="quicksand" fontSize={24} color="white" fontWeight="normal">
                  No object information found
                </Text>
              )}

              {/* Close button */}
              {onClose && (
                <Card
                  backgroundColor="rgb(41, 82, 163)"
                  hover={{ backgroundColor: "rgb(59, 130, 246)" }}
                  borderRadius={8}
                  padding={8}
                  alignItems="center"
                  justifyContent="center"
                  onClick={onClose}
                >
                  <Text fontFamily="quicksand" fontSize={18} color="white" fontWeight="normal" >
                    Close
                  </Text>
                </Card>
              )}
            </Card>
          </Container>
        </FontFamilyProvider>
      </Root>
    </group>
  );
});

export default ObjectInfoCard;