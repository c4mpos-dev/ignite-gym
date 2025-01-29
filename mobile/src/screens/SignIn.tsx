import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";

import { VStack, Image, Center, Text, Heading, ScrollView, useToast, ToastTitle, Toast, set } from "@gluestack-ui/themed";

import { AuthNavigatorRouthProps } from "@routes/auth.routes";

import { useAuth } from "@hooks/useAuth";

import BackgroundImg from "@assets/background.png";
import Logo from "@assets/logo.svg";

import { Input } from "@components/Input";
import { Button } from "@components/Button";

import { AppError } from "@utils/AppError";


type FormData = {
    email: string;
    password: string;
}

export function SignIn(){
    const [isLoading, setIsLoading] = useState(false);

    const { signIn } = useAuth();
    const navigation = useNavigation<AuthNavigatorRouthProps>();
    const toast = useToast();

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>();

    function handleNewAccount(){
        navigation.navigate("signUp");
    }

    async function handleSignIn({ email, password }: FormData){
        try { 
            setIsLoading(true);
            await signIn(email, password);

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Erro na autenticação. Tente novamente.";

            setIsLoading(false);

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

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <VStack flex={1}>
                <Image 
                    source={BackgroundImg} 
                    defaultSource={BackgroundImg}
                    alt="Pessoas treinando"
                    w='$full'
                    h={624}
                    position="absolute"
                />

                <VStack flex={1} px='$10' pb='$16'>
                    <Center my='$24'>
                        <Logo />
                        <Text color='$gray100' fontSize='$sm'>
                            Treine sua mente e o seu corpo.
                        </Text>
                    </Center>
        
                    <Center gap='$2'>
                        <Heading color='$gray100'>Acesse a conta</Heading>

                        <Controller 
                            control={control}
                            name="email"
                            rules={{ required: "Informe o e-mail" }}
                            render={({ field: { onChange } }) => (
                                <Input 
                                    placeholder="E-mail" 
                                    keyboardType="email-address"
                                    onChangeText={onChange}
                                    errorMessage={errors.email?.message}
                                    autoCapitalize="none"
                                />
                            )}
                        />

                        <Controller 
                            control={control}
                            name="password"
                            rules={{ required: "Informe a senha" }}
                            render={({ field: { onChange } }) => (
                                <Input 
                                    secureTextEntry
                                    placeholder="Senha"
                                    onChangeText={onChange}
                                    errorMessage={errors.password?.message}
                                />
                            )}
                        />

                        <Button title="Acessar" onPress={handleSubmit(handleSignIn)} isLoading={isLoading}/>
                    </Center>

                    <Center flex={1} justifyContent="flex-end" mt="$4">
                        <Text color="$gray100" fontFamily="$body" fontSize="$sm" mb="$3">
                            Ainda não tem acesso
                        </Text>

                        <Button title="Criar Conta" variant="outline" onPress={handleNewAccount}/>
                    </Center>
                </VStack>

            </VStack>
        </ScrollView>
    );
}