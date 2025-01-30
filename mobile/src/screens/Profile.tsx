import { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Center, VStack, Text, Heading, useToast } from "@gluestack-ui/themed";
import { Controller, useForm } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { ToastMessage } from "@components/ToastMessage";

import { useAuth } from "@hooks/useAuth";

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    old_password: string;
    confirm_password: string;
}

export function Profile(){
    const [userPhoto, setUserPhoto] = useState("https://github.com/c4mpos-dev.png");

    const toast = useToast();
    const { user } = useAuth();
    const { control } = useForm<FormDataProps>({
        defaultValues: {
            name: user.name,
            email: user.email
        }
    });

    async function handleUserPhotoSelect(){
        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true
            });

            if(photoSelected.canceled) { return }

            const photoURI = photoSelected.assets[0].uri;

            if (photoURI) { 
                const photoInfo = await FileSystem.getInfoAsync(photoURI) as { size: number };

                if (photoInfo.size && (photoInfo.size / 1024 / 1024) > 5) {
                    return toast.show({
                        placement: "top",
                        render: ({ id }) => (
                            <ToastMessage 
                                id={id} 
                                title="Imagem muito grande!" 
                                description="O tamanho dessa imagem é maior que 5MB." 
                                action="error" 
                                onClose={() => toast.close(id)}
                            />
                        )
                    })
                }

                setUserPhoto(photoURI);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    return(
        <VStack flex={1}>
            <ScreenHeader title="Perfil"/>

            <ScrollView contentContainerStyle={{ paddingBottom: 36 }} fadingEdgeLength={20}>
                <Center mt="$6" px="$10">
                    <UserPhoto 
                        source={{ uri: userPhoto}} 
                        alt="Foto do usuário"
                        size="xl"
                    />

                    <TouchableOpacity onPress={handleUserPhotoSelect}>
                        <Text color="$green500" fontFamily="$heading" fontSize="$md" mt="$2" mb="$8">Alterar Foto</Text>
                    </TouchableOpacity>

                    <Center w="$full" gap="$4">
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, value } }) => (
                                <Input 
                                    placeholder="Nome" 
                                    bg="$gray600"
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, value } }) => (
                                <Input 
                                    placeholder="E-mail" 
                                    bg="$gray600"
                                    onChangeText={onChange}
                                    value={value}
                                    isReadOnly
                                />
                            )}
                        />
                    </Center>

                    <Heading 
                        alignSelf="flex-start" 
                        fontFamily="$heading" 
                        color="$gray200" 
                        fontSize="$md"
                        mt="$12"
                        mb="$2"
                    >
                        Alterar senha
                    </Heading>

                    <Center w="$full" gap="$4">
                        <Input placeholder="Senha antiga" bg="$gray600" secureTextEntry/>
                        <Input placeholder="Nova senha" bg="$gray600" secureTextEntry/>
                        <Input placeholder="Confirme a nova senha" bg="$gray600" secureTextEntry/>

                        <Button title="Atualizar"/>
                    </Center>
                </Center>
            </ScrollView>
        </VStack>
    )
}

