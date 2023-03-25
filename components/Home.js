import { useState, useCallback, useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import NewNoteButton from "./NewNoteButton";
import NoteListItem from "./NoteListItem";
import mock from "../mock.json";

export default function Home({ navigation }) {
  const renderNote = ({ item }) => {
    return (
      <NoteListItem
        navigation={navigation}
        data={item}
        onPress={() => alert(item.id)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mock}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        // extraData={selectedId}
      />
      <NewNoteButton navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
