// app/(tabs)/profile/_layout.tsx
import { Tabs, Stack, useRouter, Link } from "expo-router";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Animated,
} from "react-native";
import { useAuth } from "~/src/providers/AuthProvider";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect, useRef, useState } from "react";
import { supabase } from "~/src/lib/supabase";
import { AdvancedImage } from "cloudinary-react-native";
import { cld } from "~/src/lib/cloudinary";
import YourPostsScreen from "~/src/components/YourPostsScreen";
import LikedScreen from "src/app/(tabs)/profile/liked";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreenMain() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [totalLikesReceived, setTotalLikesReceived] = useState(0);
  const [totalPiecesUploaded, setTotalPiecesUploaded] = useState(0);
  const [outfits, setOutfits] = useState([]);
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showSegmentedControl, setShowSegmentedControl] = useState(true);
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate the SegmentedControl based on showSegmentedControl state
    Animated.timing(translateY, {
      toValue: showSegmentedControl ? 0 : -50, // Adjust -50 to the height of your SegmentedControl
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showSegmentedControl]);

  useEffect(() => {
    const fetchProfileAndStats = async () => {
      try {
        // Fetch profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user?.id)
          .single();

        setProfile(profileData);
        setUsername(profileData.username);
        const image = cld.image(profileData.avatar_url);
        setImage(image);
        console.log(image);

        // Fetch user's outfits
        const { data: outfitsData } = await supabase
          .from("outfits")
          .select("*")
          .eq("user_id", user?.id);

        setOutfits(outfitsData);

        // Calculate total pieces uploaded
        const pieces = outfitsData.reduce(
          (acc, outfit) => acc + (outfit.items ? outfit.items.length : 0),
          0
        );
        setTotalPiecesUploaded(pieces);

        // Fetch total likes received
        const outfitIds = outfitsData.map((o) => o.id);
        if (outfitIds.length > 0) {
          const { count } = await supabase
            .from("outfit_likes")
            .select("id", { count: "exact", head: true })
            .in("outfit_id", outfitIds);

          setTotalLikesReceived(count || 0);
        }
      } catch (error) {
        console.error("Error fetching profile and stats:", error);
      }
    };

    if (user?.id) {
      fetchProfileAndStats();
    }
  }, [user]);
  const handleThis = async () => {
    console.log("isPressed");
  };
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ flex: 0 }}>
          {/* Header with profile info and settings button */}
          <View style={styles.header}>
            <Pressable
              onPress={() => {
                console.log("Navigating to settings");
                try {
                  router.push("/profile/settings");
                } catch (error) {
                  console.log(error);
                }
              }}
              style={styles.settingsButton}
            >
              <FontAwesome name="cog" size={24} color="#000" />
            </Pressable>
            <View style={styles.profileInfo}>
              {image ? (
                <AdvancedImage cldImg={image} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, { backgroundColor: "black" }]} />
              )}
              <Text style={styles.username}>{username}</Text>
              <View style={styles.statsContainer}>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{outfits.length}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{totalLikesReceived}</Text>
                  <Text style={styles.statLabel}>Likes</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{totalPiecesUploaded}</Text>
                  <Text style={styles.statLabel}>Pieces</Text>
                </View>
              </View>
            </View>
          </View>
          {/* Animated Segmented Control */}
          {showSegmentedControl && (
            <Animated.View
              style={{
                backgroundColor: "white",
                transform: [{ translateY }],
                zIndex: -10,
              }}
            >
              <SegmentedControl
                values={["Your Posts", "Liked"]}
                selectedIndex={selectedIndex}
                onChange={(event) => {
                  setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
                }}
                style={{ margin: 10, backgroundColor: "white" }}
              />
            </Animated.View>
          )}
          {/* Render the selected screen, pass setShowSegmentedControl */}
          {selectedIndex === 0 ? (
            <YourPostsScreen
              setShowSegmentedControl={setShowSegmentedControl}
            />
          ) : (
            <LikedScreen setShowSegmentedControl={setShowSegmentedControl} />
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: "#fff",
    position: "relative",
    borderBottomColor: "black",
    borderBottomWidth: 2,
  },
  settingsButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
  },
  profileInfo: { alignItems: "center" },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  username: { fontSize: 24, fontWeight: "bold", marginTop: 10 },
  statsContainer: { flexDirection: "row", marginTop: 10 },
  stat: { alignItems: "center", marginHorizontal: 15 },
  statNumber: { fontWeight: "bold" },
  statLabel: { color: "#888" },
});
