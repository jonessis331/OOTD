import { Pressable, Text } from "react-native";

type ButtonProps = {
  width: string,
  title: string;
  onPress?: () => void;
};

export default function Button({ width, title, onPress}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`mb-3 bg-blue-500 w-[${width}] p-3 items-center rounded-full self-center`}
    >
      <Text className="text-white font-mono font-semibold">{title}</Text>
    </Pressable>
  );
}
