import { VStack, Image, Center, Text, Heading, ScrollView } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";

import { AuthNavigatorRouthProps } from "@routes/auth.routes";

import BackgroundImg from "@assets/background.png";
import Logo from "@assets/logo.svg";

import { Input } from "@components/Input";
import { Button } from "@components/Button";

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    password_confirm: string;
}

const signUpSchema = yup.object({
    name: yup.string().required("Informe o nome."),
    email: yup.string().required("Informe o E-mail.").email("E-mail inválido."),
    password: yup.string().required("Informe a senha.").min(6, "A senha deve ter pelo menos 6 digítos."),
    password_confirm: yup
        .string()
        .oneOf([yup.ref('password'), ""], "As senhas devem coincidir.")
        .required("Confirme a senha.")
});

export function SignUp(){
    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });

    const navigation = useNavigation<AuthNavigatorRouthProps>();

    function handleGoBack(){
        navigation.goBack();
    }

    function handleSignUp(data: FormDataProps) {
        console.log(data);
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
        
                    <Center gap='$2' flex={1}>
                        <Heading color='$gray100'>Crie sua conta</Heading>

                        <Controller 
                            control={control}
                            name="name"
                            render={({ field: { onChange, value } }) => (
                                <Input 
                                    placeholder="Nome" 
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
                                    keyboardType="email-address" 
                                    autoCapitalize="none" 
                                    onChangeText={onChange} 
                                    value={value}
                                    errorMessage={errors.email?.message}
                                />
                            )}
                        />  

                        <Controller 
                            control={control}
                            name="password"
                            render={({ field: { onChange, value } }) => (
                                <Input 
                                    placeholder="Senha" 
                                    secureTextEntry 
                                    onChangeText={onChange} 
                                    value={value}
                                    errorMessage={errors.password?.message}
                                />
                            )}
                        />

                        <Controller 
                            control={control}
                            name="password_confirm"
                            render={({ field: { onChange, value } }) => (
                                <Input 
                                    placeholder="Confirmar senha" 
                                    secureTextEntry 
                                    onChangeText={onChange} 
                                    value={value} 
                                    onSubmitEditing={handleSubmit(handleSignUp)} 
                                    returnKeyType="send"
                                    errorMessage={errors.password_confirm?.message}
                                />
                            )}
                        />
                        
                        <Button title="Criar e acessar" onPress={handleSubmit(handleSignUp)}/>
                    </Center>

                    <Button title="Voltar para o login" variant="outline" mt="$12" onPress={handleGoBack}/>
                </VStack>
            </VStack>
        </ScrollView>
    );
}