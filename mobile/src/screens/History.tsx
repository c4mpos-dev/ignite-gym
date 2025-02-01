import { useCallback, useState } from "react";
import { SectionList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Heading, Text, VStack, useToast } from "@gluestack-ui/themed";

import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { Loading } from "@components/Loading";
import { ToastMessage } from "@components/ToastMessage";

import { AppError } from "@utils/AppError";

import { api } from "@services/api";
import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO";

export function History(){
    const [isLoading, setIsLoading] = useState(true);
    const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);

    const toast = useToast();

    async function fecthHistory() {
        try {
            setIsLoading(true);

            const response = await api.get("/history");
            setExercises(response.data);
            
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Erro ao carregar o histórico.";

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

    useFocusEffect(useCallback(() => {
        fecthHistory();
    }, []));

    return(
        <VStack flex={1}>
            <ScreenHeader title="Histórico de Exercícios"/>
            
            { isLoading ? <Loading /> : 
                <SectionList 
                    sections={exercises}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <HistoryCard data={item}/>}
                    renderSectionHeader={({ section }) => (
                        <Heading color="$gray200" fontSize="$md" mt="$10" mb="$3" fontFamily="$heading">{section.title}</Heading>
                    )} 
                    style={{ paddingHorizontal: 32 }}
                    contentContainerStyle={
                        exercises.length === 0 && { flex: 1, justifyContent: "center" }
                    }
                    ListEmptyComponent={() => (
                        <Text color="$gray100" textAlign="center">
                            Não há exercícios registrados ainda. {"\n"}
                            Vamos fazer exercícios hoje?
                        </Text>
                    )}
                    showsVerticalScrollIndicator={false}
                />
            }
        </VStack>
    );
}