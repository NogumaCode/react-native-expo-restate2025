import { Alert } from "react-native";
import { useEffect, useState, useCallback } from "react";

// カスタムフックのオプションの型定義
// - fn: 非同期でデータを取得する関数
// - params: API呼び出しのパラメータ (オプション)
// - skip: データ取得をスキップするかどうか
interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
  fn: (params: P) => Promise<T>;
  params?: P;
  skip?: boolean;
}

// カスタムフックの戻り値の型定義
// - data: 取得したデータ
// - loading: データ取得中かどうか
// - error: エラーが発生した場合のメッセージ
// - refetch: 新しいパラメータでデータを再取得する関数
interface UseAppwriteReturn<T, P> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (newParams: P) => Promise<void>;
}

// Appwrite のデータ取得用のカスタムフック
export const useAppwrite = <T, P extends Record<string, string | number>>({
  fn,
  params = {} as P,
  skip = false,
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
  // 取得したデータの状態
  const [data, setData] = useState<T | null>(null);
  // ローディング状態
  const [loading, setLoading] = useState(!skip);
  // エラーメッセージの状態
  const [error, setError] = useState<string | null>(null);

  // API からデータを取得する関数
  const fetchData = useCallback(
    async (fetchParams: P) => {
      setLoading(true);
      setError(null);

      try {
        // 指定された関数を実行してデータを取得
        const result = await fn(fetchParams);
        setData(result);
      } catch (err: unknown) {
        // エラーメッセージを取得
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        // アラートを表示
        Alert.alert("Error", errorMessage);
      } finally {
        // ローディング状態を終了
        setLoading(false);
      }
    },
    [fn]
  );

  // 初回レンダリング時にデータを取得
  useEffect(() => {
    if (!skip) {
      fetchData(params);
    }
  }, []);

  // 新しいパラメータでデータを再取得
  const refetch = async (newParams: P) => await fetchData(newParams);

  // 取得したデータや関数を返す
  return { data, loading, error, refetch };
};
