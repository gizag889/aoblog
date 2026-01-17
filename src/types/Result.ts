export type Result<T, E = Error> =
| { type: "success"; data: T } 
| { type: "failure"; error: E };

//成功した際に呼び出す
export const success = <T>(data: T): Result<T, never> => ({
  type: "success",
  data,
});

//失敗した際に呼び出す
export const failure = <E>(error: E): Result<never, E> => ({
  type: "failure",
  error,
});
