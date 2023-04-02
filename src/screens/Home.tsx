import { StyleSheet, View, FlatList, TextInput, Pressable } from "react-native";
import NewNoteButton from "../components/NewNoteButton";
import NoteListItem from "../components/NoteListItem";
import { useEffect, useState } from "react";
import * as Db from "../db/Db";
import { queries } from "../db/queries";
import SearchButton from "../components/SearchButton";
import FilterButton from "../components/FilterButton";
import { Ionicons } from "@expo/vector-icons";

export default function Home({ navigation }) {
  const db = Db.getConnection("notes.sqlite");
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [listOrder, setListOrder] = useState("DESC");

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <FilterButton
          onPress={() => {
            setIsFiltering((prev) => !prev);
          }}
        />
      ),
    });

    const unsubscribe = navigation.addListener("focus", () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  function loadData() {
    setIsFetching(true);
    db.transaction((tx) => {
      tx.executeSql(
        queries.get("getAllNotes") + " " + listOrder,
        null,
        (txObj, result) => {
          setNotes(result.rows._array);
          setIsFetching(false);
        },
        (txObj, err) => {
          alert(err.message);
          setIsFetching(false);
          return false;
        }
      );
    });
  }

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(query.toLowerCase())
  );

  const renderNote = ({ item }) => {
    return (
      <NoteListItem
        navigation={navigation}
        data={item}
        onPress={() => navigation.navigate("Editor", { data: item })}
      />
    );
  };

  return (
    <View style={styles.container}>
      {isFiltering && (
        <View
          style={{
            display: "flex",
            gap: 16,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
          }}
        >
          <View
            style={{
              padding: 10,
              borderRadius: 4,
              backgroundColor: "#303030",
              display: "flex",
              gap: 10,
              flexDirection: "row",
              flex: 1,
            }}
          >
            <SearchButton />
            <TextInput
              style={{
                backgroundColor: "transparent",
                color: "#fff",
                flex: 1,
              }}
              placeholder="Search"
              placeholderTextColor="#ffffff50"
              value={query}
              onChangeText={(text) => setQuery(text)}
            />
          </View>
          <Pressable
            onPress={() => {
              // filteredNotes.reverse();
              // setNotes((prev) => prev.reverse());
              setListOrder((prev) => (prev === "DESC" ? "ASC" : "DESC"));
              loadData();
            }}
          >
            <Ionicons name="swap-vertical" size={24} color="#fff" />
          </Pressable>
        </View>
      )}
      <FlatList
        data={filteredNotes}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        // extraData={} // set this to re-render on a state change
        style={{ flex: 1 }}
        refreshing={isFetching}
        onRefresh={loadData}
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
