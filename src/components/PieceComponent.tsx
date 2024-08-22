// import { useState } from "react";
// import { ActivityIndicator, Text, View, Image, Button } from "react-native";
// import { fetchGoogleLensResults } from "../lib/googlelens";

// type SimilarItem = {
//     link: string;
//     source: string;
//     title: string;
//     thumbnail: string;
// };

// type PieceComponentProps = {
//     item: {
//         name: string;
//         cropUrl: string;
//     };
// };

// export default function PieceComponent({ item }: PieceComponentProps) {
//     const [isExpanded, setIsExpanded] = useState(false);
//     const [similarItems, setSimilarItems] = useState<SimilarItem[]>([]);
//     const [isLoading, setIsLoading] = useState(false);

//     const loadSimilarItems = async () => {
//         setIsLoading(true);
//         try {
//             const googleLensResults = await fetchGoogleLensResults(item.cropUrl);
//             setSimilarItems(googleLensResults.visual_matches);
//         } catch (error) {
//             console.error('Error fetching similar items:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <View>
//             <Text>{item.name}</Text>
//             {isLoading ? (
//                 <ActivityIndicator />
//             ) : (
//                 <View>
//                     {similarItems.length > 0 ? ( // Check if there are similar items
//                         similarItems.map((similarItem, index) => (
//                             <View key={index}>
//                                 <Image source={{ uri: similarItem.thumbnail }} />
//                                 <Text>{similarItem.title}</Text>
//                                 <Text>{similarItem.source}</Text>
//                             </View>
//                         ))
//                     ) : null}
//                 </View>
//             )}
//             <Button title="Load Similar Items" onPress={loadSimilarItems} />
//         </View>
//     );
// }