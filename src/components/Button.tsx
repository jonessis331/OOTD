import { Pressable, Text } from "react-native";

type ButtonProps = {
  title: string;
  onPress?: () => void;
};

export default function Button({ title, onPress }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 bg-blue-500 w-56 p-3 items-center rounded-full self-center"
    >
      <Text className="text-white font-semibold">{title}</Text>
    </Pressable>
  );
}
