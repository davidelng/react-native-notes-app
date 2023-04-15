import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Editor from "../screens/Editor";
import Settings from "../screens/Settings";
import Home from "../screens/Home";
import TagsList from "../components/TagsList";
import Title from "../components/Title";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function TabNav({}) {
  return (
    <Tab.Navigator
      initialRouteName="Tutte le note"
      screenOptions={{
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        unmountOnBlur: true,
      }}
    >
      <Tab.Screen
        name="Tutte le note"
        component={Home}
        initialParams={{ filter: null }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="notebook-outline"
              size={size}
              color={color}
            />
          ),
          tabBarLabel: "Note",
          headerTitle: (props) => <Title title="Note" />,
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
          headerTitle: (props) => <Title title="Etichette" />,
          tabBarLabel: "Etichette",
        }}
      />
      <Tab.Screen
        name="Editor"
        component={Editor}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="plus" size={size} color={color} />
          ),
          headerTitle: (props) => <Title title="Editor" />,
          tabBarLabel: "Crea",
        }}
      />
      <Tab.Screen
        name="Impostazioni"
        component={Settings}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={size} color={color} />
          ),
          headerTitle: (props) => <Title title="Impostazioni" />,
          tabBarLabel: "Impostazioni",
        }}
      />
    </Tab.Navigator>
  );
}
