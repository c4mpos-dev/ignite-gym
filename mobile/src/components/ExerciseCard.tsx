import { TouchableOpacity, TouchableOpacityProps } from "react-native";

import { Heading, HStack, Image, Text, VStack, Icon } from "@gluestack-ui/themed";
import { ChevronRight } from "lucide-react-native";


type Props = TouchableOpacityProps;

export function ExerciseCard({ ...rest }: Props){
    return(
        <TouchableOpacity {...rest}>
            <HStack bg="$gray500" alignItems="center" p="$4" pr="$4" rounded="$md" mb="$3">
                <Image 
                    source={{ uri: "https://i.pinimg.com/236x/a0/9e/8b/a09e8b81659d0d9899e52863cdcf67b5.jpg"}}
                    alt="Imagem do exercício"
                    w="$16"
                    h="$16"
                    rounded="$md"
                    mr="$4"
                    resizeMode="cover"
                />
                <VStack flex={1}>
                    <Heading fontSize="$lg" color="$white" fontFamily="$heading">Puxada Frontal</Heading>
                    <Text fontSize="$sm" color="$gray200" mt="$1" numberOfLines={2}>3 séries x 12 repetições</Text>
                </VStack>

                <Icon as={ChevronRight} color="$gray300"/>
            </HStack>
        </TouchableOpacity>
    );
}