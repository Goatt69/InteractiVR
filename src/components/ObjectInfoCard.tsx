'use client';

import { useEffect, useRef, useState } from 'react';
import { VocabularyItem } from '@/app/types/vocabulary';
import { Text, Root, Container, FontFamilyProvider } from '@react-three/uikit';
import { Card, Button, Defaults } from '@react-three/uikit-apfel';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { Config_URL } from '@/config/config_url';

interface Props {
  objectId: number;
  name: string;
  objectIdentifier: string;
  position?: [number, number, number];
  onClose?: () => void;
}

export default function ObjectInfoCard({
  objectId,
  name,
  objectIdentifier,
  position = [0, 0, 0],
  onClose,
}: Props) {
  const groupRef = useRef<Group>(null);

  const [vocabularyItems, setVocabularyItems] = useState<VocabularyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gọi API để lấy từ vựng
  useEffect(() => {
    const fetchVocabulary = async () => {
      if (!objectId) {
        setError("Object ID is undefined");
        setIsLoading(false);
        return;
      }

      try {
        console.log(`Fetching vocabulary for object ID: ${objectId}`);
        console.log(`URL: ${Config_URL.vocabulary.getByObjectId(objectId)}`);
        
        const res = await fetch(Config_URL.vocabulary.getByObjectId(objectId));
        
        if (!res.ok) {
          throw new Error(`Failed to fetch vocabulary: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log("Vocabulary data:", data);
        
        setVocabularyItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching vocabulary:", error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVocabulary();
  }, [objectId]);

  // Làm card quay về phía camera
  useFrame(({ camera }) => {
    if (groupRef.current) {
      groupRef.current.lookAt(camera.position);
      groupRef.current.scale.setScalar(0.5);
    }
  });

  return (
    <group position={position} ref={groupRef}>
      <Root>
        <Defaults>
          <FontFamilyProvider
            quicksand={{ normal: 'fonts/Quicksand-msdf.json' }}
            timesNewRoman={{ normal: 'fonts/TIMES.TTF-msdf.json' }}
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
                <Text fontFamily="quicksand" fontSize={30} color="white">
                  {name}
                </Text>

                <Card
                  flexDirection="row"
                  gap={8}
                  padding={8}
                  backgroundColor="rgba(0, 0, 0, 0.4)"
                  borderRadius={8}
                >
                  <Text fontFamily="quicksand" fontSize={20} color="rgb(173, 216, 230)">
                    ID: {objectId}
                  </Text>
                  <Text fontFamily="quicksand" fontSize={20} color="rgb(200, 200, 200)">
                    Object: {objectIdentifier}
                  </Text>
                </Card>

                {/* Loading and error */}
                {isLoading && (
                  <Text fontFamily="quicksand" fontSize={20} color="white">
                    Loading vocabulary...
                  </Text>
                )}

                {error && (
                  <Text fontFamily="quicksand" fontSize={20} color="red">
                    Error: {error}
                  </Text>
                )}

                {/* Vocabulary section */}
                {!isLoading && !error && vocabularyItems.length > 0 && (
                  <Card
                    flexDirection="column"
                    gap={12}
                    padding={12}
                    backgroundColor="rgba(0, 0, 0, 0.4)"
                    borderRadius={8}
                  >
                    <Text fontFamily="quicksand" fontSize={24} color="white">
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
                          <Text fontFamily="quicksand" fontSize={20} color="white">
                            {vocab.englishWord}
                          </Text>
                          <Text fontFamily="timesNewRoman" fontSize={20} color="rgb(255, 255, 200)">
                            {vocab.pronunciation}
                          </Text>
                        </Card>
                        <Text fontFamily="quicksand" fontSize={20} color="rgb(173, 255, 173)">
                          {vocab.vietnameseTranslation}
                        </Text>
                        {vocab.examples.map((example, idx) => (
                          <Text
                            key={idx}
                            fontFamily="quicksand"
                            fontSize={16}
                            color="rgb(200, 200, 200)"
                          >
                            {example}
                          </Text>
                        ))}
                      </Card>
                    ))}
                  </Card>
                )}

                {onClose && (
                  <Button
                    backgroundColor="rgb(41, 82, 163)"
                    hover={{ backgroundColor: 'rgb(59, 130, 246)' }}
                    borderRadius={8}
                    padding={8}
                    onClick={onClose}
                  >
                    <Text fontFamily="quicksand" fontSize={18} color="white">
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
