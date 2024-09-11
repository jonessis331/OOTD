import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TextInput, TouchableOpacity, ScrollView, Text } from 'react-native';
import SmallItem from './SmallItem';
import SmallItemImageOnly from './SmallItemImageOnly';

const { width, height } = Dimensions.get('window');

interface RectangleComponentProps {
  items: any[];
  onClose: () => void;
  onAdd: (item: any) => void;
}

const RectangleComponent: React.FC<RectangleComponentProps> = ({ items, onClose, onAdd }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [defaultItems, setDefaultItems] = useState<any[]>([]);
  const [itemsToShow, setItemsToShow] = useState(10); // Number of items to show initially

  useEffect(() => {
    // Load the first few items by default
    setDefaultItems(items.slice(0, itemsToShow)); // Adjust the number as needed
  }, [items, itemsToShow]);

  const filteredItems = items.filter(item =>
    item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemsToDisplay = searchQuery ? filteredItems : defaultItems;

  const handleLoadMore = () => {
    setItemsToShow(prev => prev + 10); // Load 10 more items
  };

  return (
    <View style={styles.rectangle}>
      <TextInput
        style={styles.textInput}
        placeholder="Search items..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        {itemsToDisplay.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <SmallItemImageOnly item={item} />
            <TouchableOpacity onPress={() => onAdd(item)} style={styles.addButton}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        ))}
        {itemsToDisplay.length < items.length && (
          <TouchableOpacity onPress={handleLoadMore} style={styles.loadMoreButton}>
            <Text style={styles.loadMoreButtonText}>Load More</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  rectangle: {
    width: width * 0.98,
    height: height * 0.75,
    backgroundColor: 'lightgray',
    borderRadius: 30,
    shadowOpacity: 20,
    shadowColor: 'black',
    zIndex: 1,
    padding: 10,
  },
  textInput: {
    width: '100%',
    height: 40,
    backgroundColor: 'white',
    opacity: 0.5,
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadMoreButton: {
    backgroundColor: 'slategray',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  loadMoreButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: 'slategray',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default RectangleComponent;