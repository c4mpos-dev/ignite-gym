import { ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { VStack, Text, Icon, HStack, Heading, Image, Box } from "@gluestack-ui/themed";

import { ArrowLeft } from "lucide-react-native";

import { AppNavigatorRoutesProps } from "@routes/app.routes";

import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepetitionsSvg from "@assets/repetitions.svg";
import { Button } from "@components/Button";


export function Exercise(){
    const navigation = useNavigation<AppNavigatorRoutesProps>();

    function handleGoBack(){
        navigation.goBack();
    }

    return(
        <VStack flex={1}>
            <VStack px="$8" bg="$gray600" pt="$12">
                <TouchableOpacity onPress={handleGoBack}>
                    <Icon as={ArrowLeft} color="$green500" size="xl"/>
                </TouchableOpacity>     

                <HStack justifyContent="space-between" alignItems="center" mt="$4" mb="$8">
                    <Heading color="$gray100" fontFamily="$heading" fontSize="$lg" flexShrink={1}>Puxada frontal</Heading>

                    <HStack alignItems="center">
                        <BodySvg/>

                        <Text color="$gray200" ml="$1" textTransform="capitalize">Costas</Text>
                    </HStack>
                </HStack>           
            </VStack>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }} fadingEdgeLength={20}>
                <VStack p="$8">
                    <Image 
                        source={{ uri: "https://i.pinimg.com/236x/a0/9e/8b/a09e8b81659d0d9899e52863cdcf67b5.jpg" }}
                        alt="Imagem do exercício"
                        mb="$3"
                        rounded="$lg"
                        resizeMode="cover"
                        w="$full"
                        h="$80"
                    />

                    <Box bg="$gray600" rounded="$md" pb="$4" px="$4">
                        <HStack alignItems="center" justifyContent="space-around" mb="$6" mt="$5">
                            <HStack>
                                <SeriesSvg />
                                <Text color="$gray200" ml="$2">3 séries</Text>
                            </HStack>
                            <HStack>
                                <RepetitionsSvg />
                                <Text color="$gray200" ml="$2">12 repetições</Text>
                            </HStack>
                        </HStack>

                        <Button title="Marcar como realizado"/>
                    </Box>
                </VStack>
            </ScrollView>
        </VStack>
    );
}