'use client';

import { VocabularyItem } from '@/app/data/solarSystem';
import { Text, Root, Container, FontFamilyProvider } from '@react-three/uikit';
import { Card, Button, Defaults } from '@react-three/uikit-apfel';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Group } from 'three';

interface ObjectInfoCardProps {
  name: string;
  id: number;
  objectIdentifier: string;
  vocabularyItems?: VocabularyItem[];
  onClose?: () => void;
  position?: [number, number, number];
}

export default function ObjectInfoCard({
  name,
  id,
  objectIdentifier,
  vocabularyItems,
  onClose,
  position = [0, 0, 0]
}: ObjectInfoCardProps) {
  const groupRef = useRef<Group>(null);

  // Create curved effect by manipulating the group's rotation to always face the camera
  useFrame(({ camera }) => {
    if (groupRef.current) {
      // Make the UI panel face the camera
      groupRef.current.lookAt(camera.position);

      // Apply scale to the group instead of the Root component
      groupRef.current.scale.setScalar(0.5);
    }
  });

  return (
    <group position={position} ref={groupRef}>
      <Root>
        <Defaults>
          <FontFamilyProvider
            quicksand={
              {
                normal: 'fonts/Quicksand-msdf.json',
              }
            }
            timesNewRoman={
              {
                normal: 'fonts/TIMES.TTF-msdf.json',
              }
            }
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
              {/* Header with object name */}
              <Text fontFamily="quicksand" fontSize={30} color="white" fontWeight="normal" >
                {name}
              </Text>

              {/* Object ID and identifier */}
              <Card flexDirection="row" gap={8} padding={8} backgroundColor="rgba(0, 0, 0, 0.4)" borderRadius={8}>
                <Text fontFamily="quicksand" fontSize={20} color="rgb(173, 216, 230)" >
                  ID: {id}
                </Text>
                <Text fontFamily="quicksand" fontSize={20} color="rgb(200, 200, 200)" >
                  Object: {objectIdentifier}
                </Text>
              </Card>

              {/* Vocabulary items section */}
              {vocabularyItems && vocabularyItems?.length > 0 && (
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

                  {vocabularyItems.map((vocab) => (
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
                      {vocab.examples.map((example, idx) => (
                        <Text key={idx} fontFamily="quicksand" fontSize={16} color="rgb(200, 200, 200)" fontWeight="normal" >
                          {example}
                        </Text>
                      ))}
                    </Card>
                  ))}
                </Card>
              )}

              {/* Close button */}
              {onClose && (
                <Button
                  backgroundColor="rgb(41, 82, 163)"
                  hover={{ backgroundColor: "rgb(59, 130, 246)" }}
                  borderRadius={8}
                  padding={8}
                  onClick={onClose}
                >
                  <Text fontFamily="quicksand" fontSize={18} color="white" fontWeight="normal" >
                    Close
                  </Text>
                </Button>
              )}
            </Card>
          </Container>
          </FontFamilyProvider>
        </Defaults>
      </Root>
    </group>
  );
}