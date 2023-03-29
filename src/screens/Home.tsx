import { StyleSheet, View, FlatList } from "react-native";
import NewNoteButton from "../components/NewNoteButton";
import NoteListItem from "../components/NoteListItem";
import mock from "../../mock.json";
import { useEffect, useState } from "react";

import * as Db from "../db/Db";
import { queries } from "../db/queries";

export default function Home({ navigation }) {
  const db = Db.getConnection("notes.sqlite");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        queries.get("getAllNotes"),
        null,
        (txObj, result) => {
          setNotes(result.rows._array);
        },
        (txObj, err) => {
          return false;
        }
      );
    });
  }, []);

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
        data={notes}
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
