import { useState, useEffect, useCallback } from "react";
import { FlatList } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Heading, HStack, Text, VStack, useToast } from "@gluestack-ui/themed";

import { api } from "@services/api";
import { ExerciseDTO } from "@dtos/ExerciseDTO";

import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { ExerciseCard } from "@components/ExerciseCard";
import { Loading } from "@components/Loading";
import { ToastMessage } from "@components/ToastMessage";

import { AppError } from "@utils/AppError";

export function Home(){
    const [isLoading, setIsLoading] = useState(true);
    const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
    const [groups, setGroups] = useState<string[]>([]);
    const [groupSelected, setGroupSelected] = useState("antebraço");

    const toast = useToast();
    const navigation = useNavigation<AppNavigatorRoutesProps>();

    function handleOpenExerciseDetails(exerciseId: string) {
        navigation.navigate("exercise", {exerciseId});
    }

    async function fetchGroups() {
        try {
            setIsLoading(true);

            const response = await api.get("/groups");
            setGroups(response.data);

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Erro ao buscar grupos musculares.";

            toast.show({
                placement: "top",
                render: ({ id }) => (
                    <ToastMessage 
                        id={id} 
                        title={title}
                        onClose={() => toast.close(id)}
                        action="error"
                    />
                )
            })
        }
        finally {
            setIsLoading(false);
        }
    }

    async function fetchExercisesByGroup() {
        try {
            setIsLoading(true);

            const response = await api.get(`/exercises/bygroup/${groupSelected}`);
            setExercises(response.data);
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Erro ao carregar os exercícios.";

            toast.show({
                placement: "top",
                render: ({ id }) => (
                    <ToastMessage 
                        id={id} 
                        title={title}
                        onClose={() => toast.close(id)}
                        action="error"
                    />
                )
            })
        }
        finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchGroups();
    }, []);

    useFocusEffect(useCallback(() => {
        fetchExercisesByGroup();
    }, [groupSelected]));

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

            { 
                isLoading ? <Loading /> :

                <VStack px="$8" flex={1}>
                    <HStack justifyContent="space-between" mb="$5" alignItems="center">
                        <Heading color="$gray200" fontSize="$md" fontFamily="$heading">Exercícios</Heading>
                        <Text color="$gray200" fontSize="$sm" fontFamily="$body">{exercises.length}</Text>
                    </HStack>

                    <FlatList 
                        data={exercises}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <ExerciseCard 
                                onPress={() => handleOpenExerciseDetails(item.id)}
                                data={item}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        fadingEdgeLength={20}
                    />
                </VStack>
            }
        </VStack>
    );
}