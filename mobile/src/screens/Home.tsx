import { useState, useEffect } from "react";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Heading, HStack, Text, VStack, useToast, Toast, ToastTitle, set } from "@gluestack-ui/themed";

import { api } from "@services/api";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { ExerciseCard } from "@components/ExerciseCard";

import { AppError } from "@utils/AppError";

export function Home(){
    const [exercises, setExercises] = useState(["Puxada frontal", "Remada curvada", "Remada unilateral", "Levantamento terra", "Levantamento terra2", "Levantamento terra3", "Levantamento terra5", "Levantamento terra6"]);
    const [groups, setGroups] = useState<string[]>([]);
    const [groupSelected, setGroupSelected] = useState("Costas");

    const toast = useToast();
    const navigation = useNavigation<AppNavigatorRoutesProps>();

    function handleOpenExerciseDetails() {
        navigation.navigate("exercise");
    }

    async function fetchGroups() {
        try {
            const response = await api.get("/groups");
            setGroups(response.data);

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Erro ao buscar grupos musculares.";

            if(!toast.isActive("error")) {
                toast.show({
                    id: "error",
                    placement: "top",
                    render: () => (
                    <Toast backgroundColor='$red500' action="error" variant="outline" mt="$14">
                        <ToastTitle  color="$white">{title}</ToastTitle>
                    </Toast>
                    ),
                });
            }
        }
    }

    useEffect(() => {
        fetchGroups();
    }, []);

    return(
        <VStack flex={1}>
            <HomeHeader />
            <FlatList 
                data={groups}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <Group 
                        name={item.toUpperCase()}
                        isActive={groupSelected.toUpperCase() === item.toUpperCase()} 
                        onPress={() => setGroupSelected(item)}
                    />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 32 }}
                style={{ marginVertical: 40, maxHeight: 44, minHeight: 44 }}
            />

            <VStack px="$8" flex={1}>
                <HStack justifyContent="space-between" mb="$5" alignItems="center">
                    <Heading color="$gray200" fontSize="$md" fontFamily="$heading">Exercícios</Heading>
                    <Text color="$gray200" fontSize="$sm" fontFamily="$body">{exercises.length}</Text>
                </HStack>

                <FlatList 
                    data={exercises}
                    keyExtractor={item => item}
                    renderItem={(()=> <ExerciseCard onPress={handleOpenExerciseDetails}/>)}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    fadingEdgeLength={20}
                />
            </VStack>
        </VStack>
    );
}