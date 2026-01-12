export type Result<T, E = Error> =
  | { type: "success"; data: T }
  | { type: "failure"; error: E };

export const success = <T>(data: T): Result<T, never> => ({
  type: "success",
  data,
});

export const failure = <E>(error: E): Result<never, E> => ({
  type: "failure",
  error,
});
