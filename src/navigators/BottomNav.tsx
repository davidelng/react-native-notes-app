import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Editor from "../screens/Editor";
import Settings from "../screens/Settings";
import Home from "../screens/Home";
import TagsList from "../components/TagsList";
import { Feather, MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { Colors } from "react-native/Libraries/NewAppScreen";

const Tab = createBottomTabNavigator();

export default function TabNav() {
  return (
    <Tab.Navigator
      initialRouteName="Tutte le note"
      screenOptions={{
        tabBarShowLabel: false,
        unmountOnBlur: true,
      }}
    >
      <Tab.Screen
        name="Tutte le note"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="notebook-outline"
              size={size}
              color={color}
            />
          ),
          // headerTitle: "Native Notes",
        }}
      />
      <Tab.Screen
        name="Etichette"
        component={TagsList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="tag-multiple-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Editor"
        component={Editor}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="plus" size={size} color={color} />
            // <MaterialCommunityIcons
            //   name="note-edit-outline"
            //   size={size}
            //   color={color}
            // />
          ),
        }}
      />
      <Tab.Screen
        name="Impostazioni"
        component={Settings}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
