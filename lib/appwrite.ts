
import {
  Client,
  Account,
  OAuthProvider,
  Avatars,

} from "react-native-appwrite";

import * as Linking from "expo-linking";

import { openAuthSessionAsync } from "expo-web-browser";


export const config = {
  platform: "com.palet.restate",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,

};
export const client = new Client();
client
  .setEndpoint(config.endpoint!)// AppwriteのAPIエンドポイントを設定
  .setProject(config.projectId!)// AppwriteのプロジェクトIDを設定
  .setPlatform(config.platform!);// プラットフォーム情報を設定

  export const avatar = new Avatars(client);// ユーザーのアイコン管理
export const account = new Account(client);// ユーザー認証管理

// Google OAuth 認証処理
export async function login() {
  try {
    // Expo の `Linking` を使ってアプリのリダイレクトURLを作成
    const redirectUri = Linking.createURL("/");

     // Appwrite に Googleログインのリクエストを送信し、認証URLを取得
    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri  // 認証成功後に戻ってくるURL
    );

    // OAuthのURLが取得できなかった場合、エラーをスロー
    if (!response) throw new Error("OAuth2 トークンの作成に失敗しました。");

     // Expo の `openAuthSessionAsync` でブラウザを開いて Googleログイン
    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri  // 認証完了後のリダイレクトURL
    );

     // ユーザーが認証画面を閉じた場合、エラーをスロー
    if (browserResult.type !== "success")
      throw new Error("OAuth2 トークンの作成に失敗しました。");

     // Google認証後、AppwriteがリダイレクトURLに `userId` と `secret` を含めてくる
    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();

    // 必要な情報が取得できなかったらエラーをスロー
    if (!secret || !userId) throw new Error("OAuth2 トークンの作成に失敗しました。");

    // Appwrite の `createSession` でユーザーのセッションを作成
    const session = await account.createSession(userId, secret);

    // セッションの作成に失敗した場合、エラーをスロー
    if (!session) throw new Error("セッションの作成に失敗しました");

    // ログイン成功
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function logout() {
  try {
    const result = await account.deleteSession("current");
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const result = await account.get();
    if (result.$id) {
      const userAvatar = avatar.getInitials(result.name);

      return {
        ...result,
        avatar: userAvatar.toString(),
      };
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}
