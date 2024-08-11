import { Image, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import Button from "~/src/components/Button";
import { supabase } from "~/src/lib/supabase";

export default function ProfileScreen() {
  const [username, setUsername] = useState("");
  const [image, setImage] = useState<string | null>(null);

  // useEffect(() => {
  //   if (!image) {
  //     pickImage();
  //   }
  // }, [image]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  return (
    <View className="p-3 flex-1">
      {/* Avatar image picker */}
      {image ? (
        <Image
          source={{ uri: image }}
          className="w-52 aspect-square self-center rounded-full"
        />
      ) : (
        <View className="w-52 aspect-square self-center rounded-full bg-slate-300" />
      )}
      <Text
        onPress={pickImage}
        className="text-blue-500 font-semibold m-5 self-center"
      >
        Change
      </Text>

      {/*form */}
      <Text className="mb-2 text-gray-500 font-semibold">Username</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        className="border border-gray-300 p-3 rounded-md shadow-sm"
      />
      {/*Button*/}
      <View className="gap-2 mt-auto">
        <Button title={"Update"}></Button>
        <Button
          title={"Sign out"}
          onPress={() => supabase.auth.signOut()}
        ></Button>
      </View>
    </View>
  );
}
