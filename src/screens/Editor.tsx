import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useTheme } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Note, Tag, AIPrompt } from "../../types";
import TrashNoteButton from "../components/TrashNoteButton";
import TagBadge from "../components/TagBadge";
import AIButton from "../components/AIButton";
import { dateFormatter, getDateForCreation } from "../lib/dateFormatter";
import { generateCompletion } from "../lib/openai";
import * as Db from "../db/Db";
import { queries } from "../db/queries";

const emptyAIPrompt: AIPrompt = { prompt: "", temperature: 0, maxTokens: 1000 };

const emptyNote: Note = {
  id: null,
  title: "",
  content: "",
  tag: null,
  tagColor: null,
  tagId: null,
  timestamp: getDateForCreation(),
  pinned: 0,
};

export default function Editor({ route, navigation }) {
  const { colors } = useTheme();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [tags, setTags] = useState(null);
  const [AIPrompt, setAIPrompt] = useState(emptyAIPrompt);
  const [AILoading, setAILoading] = useState(false);
  const AITextRef = useRef(null);

  const [note, setNote] = useState(emptyNote);

  const AIBottomSheetRef = useRef<BottomSheetModal>(null);
  const tagBottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["50%", "70%", "90%"], []);
  const handleSheetChanges = useCallback(
    (index: number, sheet: "ai" | "tag") => {
      let bottomSheet = sheet === "ai" ? AIBottomSheetRef : tagBottomSheetRef;
      bottomSheet.current?.snapToIndex(index);
    },
    []
  );
  const openBottomSheet = useCallback((sheet: "ai" | "tag") => {
    let bottomSheet = sheet === "ai" ? AIBottomSheetRef : tagBottomSheetRef;
    bottomSheet.current?.present();
  }, []);
  const closeBottomSheet = useCallback((sheet: "ai" | "tag") => {
    let bottomSheet = sheet === "ai" ? AIBottomSheetRef : tagBottomSheetRef;
    bottomSheet.current?.dismiss();
  }, []);

  const db = Db.getConnection();

  let data: Note;

  useEffect(() => {
    if (route.params?.data) {
      data = {
        ...route.params.data,
        timestamp: dateFormatter(route.params.data.timestamp),
      };
      delete route.params.data;
    } else {
      data = emptyNote;
    }

    setNote(data);
    loadTags();
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            display: "flex",
            gap: 16,
            flexDirection: "row",
            alignItems: "center",
            marginRight: 16,
          }}
        >
          <AIButton onPress={() => openBottomSheet("ai")} />
          {note.id !== null && (
            <TrashNoteButton
              onPress={() => {
                setDeleteModalVisible(true);
              }}
            />
          )}
          <Pressable onPress={() => manageNote()}>
            <Feather name="save" size={24} style={{ color: colors.text }} />
          </Pressable>
        </View>
      ),
    });
  }, [note]);

  function createNote(note: Note) {
    db.transaction((tx) =>
      tx.executeSql(
        queries.get("insertNote"),
        [
          note.title === "" ? "Senza titolo" : note.title,
          note.content,
          0,
          note.tagId,
        ],
        (txObj, result) => {
          return true;
        },
        (txObj, err) => {
          alert(err.message);
          return false;
        }
      )
    );
  }

  function updateNote(note: Note) {
    db.transaction((tx) =>
      tx.executeSql(
        queries.get("updateNote"),
        [
          note.title === "" ? "Senza titolo" : note.title,
          note.content,
          0,
          note.tagId,
          note.id,
        ],
        (txObj, result) => {
          return true;
        },
        (txObj, err) => {
          alert(err.message);
          return false;
        }
      )
    );
  }

  function manageNote() {
    if (note.id === null) {
      createNote(note);
    } else if (note.id !== null) {
      updateNote(note);
    } else {
      alert("Impossibile salvare la nota");
      return;
    }
    navigation.jumpTo("Tutte le note");
  }

  function deleteNote(id: number) {
    db.transaction((tx) =>
      tx.executeSql(
        queries.get("deleteNote"),
        [id],
        (txObj, result) => {
          return true;
        },
        (txObj, err) => {
          alert(err.message);
          return false;
        }
      )
    );
  }

  function loadTags() {
    db.transaction((tx) => {
      tx.executeSql(
        queries.get("getAllTags"),
        null,
        (txObj, result) => {
          setTags(result.rows._array);
        },
        (txObj, err) => {
          alert(err.message);
          return false;
        }
      );
    });
  }

  function selectTag(tag: Tag | null) {
    if (tag !== null) {
      setNote((prev) => {
        return { ...prev, tagId: tag.id, tag: tag.name, tagColor: tag.color };
      });
    } else {
      setNote((prev) => {
        return { ...prev, tagId: null, tag: null, tagColor: null };
      });
    }
    closeBottomSheet("tag");
  }

  function handleAIGeneration(prompt: AIPrompt) {
    setAILoading(true);
    if (AIPrompt.prompt !== "") {
      db.transaction((tx) => {
        tx.executeSql(
          queries.get("getConf"),
          ["OPENAI_API_KEY"],
          async (tx, res) => {
            const key = res.rows.item(0).value;
            const generatedText = await generateCompletion(
              key,
              prompt.prompt,
              prompt.temperature,
              prompt.maxTokens
            );
            setNote((prev) => {
              return {
                ...prev,
                content:
                  prev.content + "\n\n-- AI Generated\n\n" + generatedText,
              };
            });
            setAIPrompt(emptyAIPrompt);
            closeBottomSheet("ai");
            setAILoading(false);
          },
          (tx, err) => {
            setAILoading(false);
            alert("Errore durante la generazione");
            return false;
          }
        );
      });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.date, { color: colors.text }]}>
        {note.timestamp}
      </Text>
      <TextInput
        style={[
          styles.title,
          { borderBottomColor: colors.border, color: colors.text },
        ]}
        placeholder="Titolo"
        placeholderTextColor={colors.text}
        value={note.title}
        onChangeText={(text) =>
          setNote((prev) => {
            return { ...prev, title: text };
          })
        }
      />
      <View>
        <Pressable style={styles.picker} onPress={() => openBottomSheet("tag")}>
          {!note.tag && (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 3,
                borderWidth: 1,
                borderStyle: "solid",
                borderRadius: 20,
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderColor: colors.primary + "50",
                backgroundColor: colors.primary + "50",
              }}
            >
              <Text style={{ color: colors.text }}>Tag</Text>
              <Feather
                name="chevron-down"
                size={16}
                color={colors.text}
                style={{ marginTop: 3 }}
              />
            </View>
          )}
          {note.tag && <TagBadge accent={note.tagColor} content={note.tag} />}
        </Pressable>
      </View>
      <ScrollView>
        <TextInput
          style={[styles.content, { color: colors.text + "f0" }]}
          placeholder="..."
          placeholderTextColor={colors.notification}
          multiline
          value={note.content}
          onChangeText={(text) =>
            setNote((prev) => {
              return { ...prev, content: text };
            })
          }
        />
      </ScrollView>

      {/* DELETE MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => {
          setDeleteModalVisible(!deleteModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <Pressable
            onPress={() => setDeleteModalVisible(false)}
            style={{ flex: 1 }}
          />
          <View
            style={[
              styles.modalView,
              { backgroundColor: colors.backgroundLighter },
            ]}
          >
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setDeleteModalVisible(!deleteModalVisible);
                deleteNote(note.id);
                navigation.navigate("Tutte le note");
              }}
            >
              <Feather name="trash" size={24} color="#DC143C" />
              <Text style={[styles.modalButtonText, { color: "#DC143C" }]}>
                Elimina definitivamente
              </Text>
            </Pressable>
            <Pressable
              style={styles.modalButton}
              onPress={() => setDeleteModalVisible(!deleteModalVisible)}
            >
              <AntDesign name="close" size={24} color={colors.text} />
              <Text style={[styles.modalButtonText, { color: colors.text }]}>
                Annulla
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* DELETE MODAL */}

      {/* AI BOTTOM SHEET */}
      <BottomSheetModal
        ref={AIBottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={(index) => handleSheetChanges(index, "ai")}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: colors.backgroundLighter }}
        handleIndicatorStyle={{ backgroundColor: colors.text }}
        onDismiss={() => setAIPrompt(emptyAIPrompt)}
      >
        <View style={styles.bottomSheetView}>
          {AILoading ? (
            <ActivityIndicator color={colors.primary} size="large" />
          ) : (
            <>
              <BottomSheetTextInput
                ref={AITextRef}
                style={{
                  color: colors.text,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  backgroundColor: colors.notification + "20",
                  borderRadius: 50,
                  marginBottom: 16,
                }}
                placeholder="Chiedi qualcosa all'intelligenza artificiale"
                placeholderTextColor={colors.notification}
                multiline
                value={AIPrompt.prompt}
                onChangeText={(text) =>
                  setAIPrompt((prev) => {
                    return { ...prev, prompt: text };
                  })
                }
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  marginBottom: 16,
                }}
              >
                <View
                  style={{
                    borderRadius: 8,
                    padding: 10,
                  }}
                >
                  <Text style={{ color: colors.text }}>
                    Temperatura: {AIPrompt.temperature}
                  </Text>
                  <Slider
                    style={{ height: 30 }}
                    minimumValue={0}
                    maximumValue={1}
                    step={0.1}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.background}
                    thumbTintColor={colors.primary}
                    onValueChange={(val) =>
                      setAIPrompt((prev) => {
                        let temp = parseFloat(val.toFixed(1));
                        temp = temp === 1.0 ? 1 : temp;
                        return { ...prev, temperature: temp };
                      })
                    }
                  />
                </View>
                <View
                  style={{
                    borderRadius: 8,
                    padding: 10,
                  }}
                >
                  <Text style={{ color: colors.text }}>
                    Max Tokens: {AIPrompt.maxTokens}
                  </Text>
                  <Slider
                    style={{ height: 30 }}
                    minimumValue={10}
                    maximumValue={1000}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.background}
                    thumbTintColor={colors.primary}
                    onValueChange={(val) =>
                      setAIPrompt((prev) => {
                        return { ...prev, maxTokens: Math.floor(val) };
                      })
                    }
                  />
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: 16,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Pressable
                  style={[
                    styles.button,
                    {
                      backgroundColor: colors.primary + "80",
                    },
                  ]}
                  onPress={() => handleAIGeneration(AIPrompt)}
                >
                  <Text style={[styles.textStyle, { color: colors.text }]}>
                    Genera
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </BottomSheetModal>
      {/* AI BOTTOM SHEET */}

      {/* TAG BOTTOM SHEET */}
      <BottomSheetModal
        ref={tagBottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={(index) => handleSheetChanges(index, "tag")}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: colors.backgroundLighter }}
        handleIndicatorStyle={{ backgroundColor: colors.text }}
      >
        <View style={styles.bottomSheetView}>
          <Pressable
            onPress={() => selectTag(null)}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              marginBottom: 16,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                backgroundColor: colors.primary + "50",
                paddingHorizontal: 6,
                paddingVertical: 2,
                gap: 3,
                borderRadius: 20,
              }}
            >
              <AntDesign name="close" size={18} color={colors.text} />
              <Text style={{ color: colors.text }}>Nessuno</Text>
            </View>
          </Pressable>
          {tags &&
            tags.map((tag: Tag) => {
              return (
                <Pressable
                  key={tag.id}
                  onPress={() => selectTag(tag)}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    marginBottom: 16,
                  }}
                >
                  <TagBadge accent={tag.color} content={tag.name} />
                </Pressable>
              );
            })}
        </View>
      </BottomSheetModal>
      {/* TAG BOTTOM SHEET */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    padding: 16,
    fontSize: 20,
    fontWeight: "600",
  },
  content: {
    padding: 16,
    flex: 1,
    textAlignVertical: "top",
    fontSize: 16,
  },
  date: {
    fontSize: 12,
    paddingHorizontal: 16,
    opacity: 0.7,
  },
  picker: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  centeredView: {
    flex: 1,
  },
  modalView: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    width: "100%",
  },
  modalButtonText: {
    color: "white",
    textAlign: "left",
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 50,
  },
  modalButton: {
    borderRadius: 4,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    textAlign: "center",
    fontSize: 16,
  },
  bottomSheetView: {
    padding: 25,
    width: "100%",
  },
});
