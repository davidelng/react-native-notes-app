import { View, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

export default function SkeletonNote() {
  const { colors } = useTheme();
  const bg = colors.backgroundLighter;

  return (
    <View style={[styles.container, { borderColor: bg }]}>
      <View
        style={[
          styles.skeleton,
          { backgroundColor: bg, width: "80%", marginBottom: 10 },
        ]}
      />
      <View style={styles.secondLine}>
        <View
          style={[styles.skeleton, { backgroundColor: bg, width: "30%" }]}
        />
        <View
          style={[
            styles.skeleton,
            { backgroundColor: bg, width: "30%", marginBottom: 8 },
          ]}
        />
      </View>
      <View>
        <View style={[styles.skeleton, { backgroundColor: bg, height: 15 }]} />
        <View style={[styles.skeleton, { backgroundColor: bg, height: 15 }]} />
        <View style={[styles.skeleton, { backgroundColor: bg, height: 15 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 2,
    borderStyle: "dashed",
  },
  skeleton: {
    borderRadius: 50,
    height: 20,
    marginBottom: 8,
  },
  secondLine: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
