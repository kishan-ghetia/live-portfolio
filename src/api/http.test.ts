import { ApiError, http } from "./http";

const URL = "https://api.example.test/items";

let fetchSpy: jest.SpiedFunction<typeof fetch>;

beforeEach(() => {
  fetchSpy = jest.spyOn(globalThis, "fetch");
});

afterEach(() => {
  fetchSpy.mockRestore();
  jest.useRealTimers();
});

function respond(status: number, body: string | null) {
  fetchSpy.mockResolvedValue(new Response(body, { status }));
}

test("POST sends a JSON body and treats 201 as success", async () => {
  respond(201, '{"id":1}');

  await expect(http.post(URL, { name: "a" })).resolves.toEqual({ id: 1 });

  const init = fetchSpy.mock.calls[0][1];
  expect(init?.method).toBe("POST");
  expect(init?.body).toBe('{"name":"a"}');
});

test("non-2xx status throws an http error with status and body", async () => {
  respond(500, "boom");

  const error = await http.get(URL).catch((e: unknown) => e);
  expect(error).toBeInstanceOf(ApiError);
  expect(error).toMatchObject({ kind: "http", status: 500, responseBody: "boom" });
});

test("fetch failure throws a network error", async () => {
  fetchSpy.mockRejectedValue(new TypeError("Network request failed"));

  await expect(http.get(URL)).rejects.toMatchObject({ kind: "network" });
});

test("slow request is aborted with a timeout error", async () => {
  jest.useFakeTimers();
  fetchSpy.mockImplementation(
    (_input, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject(new Error("aborted")));
      }),
  );

  const pending = http.get(URL, { timeoutMs: 50 });
  jest.advanceTimersByTime(50);

  await expect(pending).rejects.toMatchObject({ kind: "timeout" });
});

// Further tests that could be added:
//
// 1. Custom headers are merged with the defaults and can override them
//    - The wrapper always sends Accept: application/json.
//    - If a caller passes its own headers (e.g. an auth token), they should be added.
//    - If the caller sends a header the wrapper also sets, the caller's version should win.
//
// 2. An empty response body resolves to null
//    - Some requests succeed but return nothing (e.g. DELETE often returns 204).
//    - JSON.parse("") would crash on that.
//    - The wrapper returns null instead; the test would confirm no crash.
//
// 3. A non-JSON response body throws a parse error
//    - A server can return an HTML error page instead of JSON (e.g. a proxy's 502 page with status 200).
//    - JSON.parse would fail on it.
//    - The wrapper turns that into an ApiError with kind "parse" so the app can show a proper error.
//
// 4. get, put, patch and delete each send the right HTTP method
//    - http.get should send GET, http.delete should send DELETE, and so on.
//    - A copy-paste mistake could make http.put send POST.
//    - The test would call each shortcut and check the method that was sent.
