import { Pressable, Text, StyleSheet } from "react-native";
import React, { useState } from "react";

type ButtonProps = {
  width: string | number;
  title: string;
  onPress?: () => void;
};

export default function Button({ width, title, onPress }: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[
        styles.button,
        { width }, // Apply dynamic width
        isPressed && styles.buttonPressed, // Apply pressed style conditionally
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 12,
    padding: 12,
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "#CBCBCB",
    alignSelf: "center",
  },
  buttonPressed: {
    backgroundColor: "#CBCBCB", // Darker shade for pressed state
  },
  text: {
    color: "white",
    fontFamily: "monospace",
    fontWeight: "600",
  },
});
