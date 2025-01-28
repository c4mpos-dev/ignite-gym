import { Controller, useForm } from "react-hook-form";

import { VStack, Image, Center, Text, Heading, ScrollView } from "@gluestack-ui/themed";

import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRouthProps } from "@routes/auth.routes";

import BackgroundImg from "@assets/background.png";
import Logo from "@assets/logo.svg";

import { Input } from "@components/Input";
import { Button } from "@components/Button";

type FormData = {
    email: string;
    password: string;
}

export function SignIn(){
    const navigation = useNavigation<AuthNavigatorRouthProps>();

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>();

    function handleNewAccount(){
        navigation.navigate("signUp");
    }

    function handleSignIn({ email, password }: FormData){
        console.log(email, password);
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

                        <Button title="Acessar" onPress={handleSubmit(handleSignIn)}/>
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