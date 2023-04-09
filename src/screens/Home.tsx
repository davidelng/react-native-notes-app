import { StyleSheet, View, FlatList, TextInput, Pressable } from "react-native";
import NoteListItem from "../components/NoteListItem";
import { useEffect, useState } from "react";
import * as Db from "../db/Db";
import { queries } from "../db/queries";
import SearchButton from "../components/SearchButton";
import FilterButton from "../components/FilterButton";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

export default function Home({ route, navigation }) {
  const db = Db.getConnection();
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState("");
  const [isFiltering, setIsFiltering] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [listOrder, setListOrder] = useState("DESC");

  const { colors } = useTheme();

  const filter =
    route.params && route.params.filter ? route.params.filter : null;

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <FilterButton
  //         onPress={() => {
  //           setIsFiltering((prev) => !prev);
  //         }}
  //       />
  //     ),
  //   });

  //   const unsubscribe = navigation.addListener("focus", () => {
  //     loadData(filter);
  //   });
  //   return unsubscribe;
  // }, [navigation]);

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

    loadData(filter);
  }, []);

  useEffect(() => {
    loadData(filter);
  }, [listOrder]);

  function loadData(filter: number | null) {
    // let query = "";
    // let params = null;

    // if (filter !== null) {
    //   query = queries.get("getNotesByTag");
    //   params = [filter];
    // } else {
    //   query = queries.get("getAllNotes") + " " + listOrder;
    // }

    let query = queries.get("getAllNotes") + " " + listOrder;
    let params = null;

    setIsFetching(true);
    db.transaction((tx) => {
      tx.executeSql(
        query,
        params,
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
            paddingBottom: 16,
          }}
        >
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 50,
              backgroundColor: colors.backgroundLighter,
              display: "flex",
              gap: 10,
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
            }}
          >
            <SearchButton />
            <TextInput
              style={{
                backgroundColor: "transparent",
                color: colors.text,
                flex: 1,
              }}
              placeholder="Cerca"
              placeholderTextColor={colors.primary + "80"}
              inputMode="search"
              value={query}
              onChangeText={(text) => setQuery(text)}
            />
          </View>
          <Pressable
            onPress={() => {
              setListOrder((prev) => (prev === "DESC" ? "ASC" : "DESC"));
              loadData(filter);
            }}
          >
            <Ionicons name="swap-vertical" size={24} color={colors.text} />
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
        onRefresh={() => loadData(filter)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
