import { ToastDescription, ToastTitle, Toast, Pressable, Icon, VStack, Box } from "@gluestack-ui/themed";
import { X } from "lucide-react-native";

type Props = {
    id: string;
    title: string;
    description?: string;
    action?: "error" | "success";
    onClose: () => void;
}

export function ToastMessage({ id, title, description, action = "success", onClose}: Props){
    return(
        <Toast 
            nativeID={`toast-${id}`} 
            action={action} 
            bgColor={action === "success" ? "$green500" : "$red500"}
            mt="$14"
        >
            <VStack space="xs" w="$full">
                <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                    <ToastTitle color="$white" fontFamily="$heading">
                        {title}
                    </ToastTitle>

                    <Pressable onPress={onClose}>
                        <Icon as={X} color="$coolGray50" size="md" />
                    </Pressable>
                </Box>

                {description && <ToastDescription color="$white" fontFamily="$body">{description}</ToastDescription>}
            </VStack>
        </Toast>
    );
}