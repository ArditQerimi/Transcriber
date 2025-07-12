import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { Button, Text } from 'react-native';
import TempScreen from './TempScreen';
import Basic from './TextEditor';
const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Basic}
          options={{title: 'Welcome'}}
        />
        <Stack.Screen name="Editor" component={Basic} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};



const HomeScreen = ({navigation}) => {
    return (
      <Button
        title="Go to Jane's profile"
        onPress={() =>
          navigation.navigate('Editor', {name: 'Jane'})
        }
      />
    );
  };
  const ProfileScreen = ({navigation, route}) => {
    return <Text>This is {route.params.name}'s profile</Text>;
  };

  export default MyStack