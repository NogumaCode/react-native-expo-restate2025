import { Link } from 'expo-router';
import {  Text, View } from 'react-native';


export default function HomeScreen() {
  return (

    <View style={{ flex:1,justifyContent:"center",alignItems:"center" }}>
      <Text className="text-white text-xl font-bold">Hello Tailwind!</Text>
      <Link className='text-red-500' href="/sign-in">サインイン</Link>
      <Link href="/explore">検索</Link>
      <Link href="/profile">プロフィール</Link>
      <Link href={{ pathname: "/properties/[id]", params: { id: "1" } }}>プロパティ1</Link>
    </View>
  );
}
