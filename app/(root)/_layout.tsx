import { Redirect, Slot } from "expo-router";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGlobalContext } from "@/lib/global-provider";

// `AppLayout`: アプリ全体のレイアウトとログイン管理
export default function AppLayout() {

  // `useGlobalContext()` を使って `loading` 状態と `isLogged` を取得
  const { loading, isLogged } = useGlobalContext();

 // `loading` が `true` の場合は、ローディングインジケーターを表示
  if (loading) {
    return (
      <SafeAreaView className="bg-white h-full flex justify-center items-center">
        <ActivityIndicator className="text-primary-300" size="large" />
      </SafeAreaView>
    );
  }

   // `isLogged` が `false` の場合（未ログイン）は、`/sign-in` ページにリダイレクト
  if (!isLogged) {
    return <Redirect href="/sign-in" />;
  }

   // `isLogged` が `true` の場合（ログイン済み）は、`Slot` を表示
  return <Slot />;

}
