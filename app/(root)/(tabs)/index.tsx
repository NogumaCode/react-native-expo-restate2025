import { Link } from 'expo-router';
import {  Text, View } from 'react-native';


export default function HomeScreen() {
  return (

    <View className='flex items-center justify-center'>
      <Text className="text-white text-3xl font-bold font-rubik ">Hello Tailwind!</Text>
      <Link className='text-red-500' href="/sign-in">サインイン</Link>
      <Link href="/explore">検索</Link>
      <Link href="/profile">プロフィール</Link>
      <Link href={{ pathname: "/properties/[id]", params: { id: "1" } }}>プロパティ1</Link>
    </View>
  );
}
