import { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Center, VStack, Text, Heading, useToast } from "@gluestack-ui/themed";
import { Controller, useForm } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup"

import userPhotoDefault from "@assets/userPhotoDefault.png";

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { ToastMessage } from "@components/ToastMessage";
import { Loading } from "@components/Loading";

import { useAuth } from "@hooks/useAuth";

import { AppError } from "@utils/AppError";
import { api } from "@services/api";

type FormDataProps = yup.InferType<typeof profileSchema>;

const profileSchema = yup.object({
    name: yup.string().required("Informe o nome."),
    email: yup.string().optional(),
    old_password: yup.string().optional(),
    password: yup.string().min(6, "A senha deve ter pelo menos 6 digítos.").nullable().transform((value) => !!value ? value : null),
    confirm_password: yup
        .string()
        .nullable()
        .transform((value) => !!value ? value : null)
        .oneOf([yup.ref('password'), ""], "As senhas devem coincidir.")
        .when("password", {
            is: ( password: any ) => !!password,
            then: (schema) => schema.nullable().required("Confirme a senha.").transform((value) => !!value ? value : null)
        })
});

export function Profile(){
    const [isUpdating, setIsUpdating] = useState(false);
    const [photoIsLoading, setPhotoIsLoading] = useState(false);

    const toast = useToast();
    const { user, updateUserProfile } = useAuth();
    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        defaultValues: {
            name: user.name,
            email: user.email
        },
        resolver: yupResolver(profileSchema)
    });

    async function handleUserPhotoSelect(){
        setPhotoIsLoading(true);
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

                const fileExtension = photoURI.split(".").pop();

                const photoFile = {
                    name: `${user.name}.${fileExtension}`.toLowerCase(),
                    uri: photoURI,
                    type: `${photoSelected.assets[0].type}/${fileExtension}`
                } as any;

                const userPhotoUploadForm = new FormData();
                userPhotoUploadForm.append("avatar", photoFile);

                const avatarUpdatedResponse = await api.patch("/users/avatar", userPhotoUploadForm, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });

                const userUpdated = user;
                userUpdated.avatar = avatarUpdatedResponse.data.avatar;
                updateUserProfile(userUpdated);

                toast.show({
                    placement: "top",
                    render: ({ id }) => (
                        <ToastMessage 
                            id={id} 
                            title="Foto de perfil atualizada!" 
                            onClose={() => toast.close(id)}
                            action="success"
                            description="Sua foto de perfil foi atualizada com sucesso."
                        />
                    )
                })
            }
        }
        catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Erro ao atualizar a foto de perfil.";

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
            });
        
        }
        finally {
            setPhotoIsLoading(false);
        }
    }

    async function handleProfileUpdate(data: FormDataProps){
        try {
            setIsUpdating(true);

            const userUpdated = user;
            userUpdated.name = data.name;

            await api.put("/users", data);
            await updateUserProfile(userUpdated);
            
            toast.show({
                placement: "top",
                render: ({ id }) => (
                    <ToastMessage 
                        id={id} 
                        title="Perfil atualizado com sucesso!" 
                        onClose={() => toast.close(id)}
                        action="success"
                    />
                )
            });

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Erro ao atualizar o perfil.";

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
            });
        }
        finally {
            setIsUpdating(false);
        }
    }

    return(
        <VStack flex={1}>
            <ScreenHeader title="Perfil"/>

            <ScrollView contentContainerStyle={{ paddingBottom: 36 }} fadingEdgeLength={20}>
                <Center mt="$6" px="$10">
                    { photoIsLoading ? <Loading /> :
                        <UserPhoto 
                            source={ 
                                user.avatar 
                                ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` } 
                                : userPhotoDefault 
                            } 
                            alt="Foto do usuário"
                            size="xl"
                        />
                    }

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
                                    errorMessage={errors.name?.message}
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
                        <Controller
                            control={control}
                            name="old_password"
                            render={({ field: { onChange } }) => (
                                <Input 
                                    placeholder="Senha antiga" 
                                    bg="$gray600"
                                    onChangeText={onChange}
                                    secureTextEntry
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange } }) => (
                                <Input 
                                    placeholder="Nova senha" 
                                    bg="$gray600"
                                    onChangeText={onChange}
                                    secureTextEntry
                                    errorMessage={errors.password?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="confirm_password"
                            render={({ field: { onChange } }) => (
                                <Input 
                                    placeholder="Confirme a nova senha" 
                                    bg="$gray600"
                                    onChangeText={onChange}
                                    secureTextEntry
                                    errorMessage={errors.confirm_password?.message}
                                />
                            )}
                        />

                        <Button 
                            title="Atualizar"
                            onPress={handleSubmit(handleProfileUpdate)}
                            isLoading={isUpdating}
                        />
                    </Center>
                </Center>
            </ScrollView>
        </VStack>
    )
}

