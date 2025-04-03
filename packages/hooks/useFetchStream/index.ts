import { ref } from "vue";

// 当前状态
export type Status = "finish" | "stop" | "loading" | "error" | "connecting";
// 匹配换行符
const Regex_Match_Line = /\r\n|\n|\r/gm;
export const useFetchStream = (
  url: string,
  options?: Omit<Request, "url"> & { timeout: number }
) => {
  const decoder = new TextDecoder();
  const status = ref<Status>("finish");
  const error = ref<Response | null>(null);
  //
  const abortController = new AbortController();
  // 超时停止
  const timeoutSignal = AbortSignal.timeout(options?.timeout || 0);

  async function* readline() {
    status.value = "connecting";
    const res = await fetch(url, {
      ...options,
      signal: AbortSignal.any([abortController.signal, timeoutSignal]),
    });

    // 请求状态，连接错误、网络错误
    if (res.ok) {
      error.value = res;
      status.value = "error";
      return;
    }
    // 请求类型错误
    // 必须是text/stream 响应数据
    if (res.headers.get("Content-Type") !== "text/event-stream") {
      error.value = res;
      status.value = "error";
      return;
    }
    status.value = "loading";
    let render = res.body!.getReader();
    let { value: value, done: done } = await render.read();

    // 解析每一块的文本数据
    let buffer = value ? decoder.decode(value) : "";
    let startIndex = 0;
    for (;;) {
      if (["finish", "stop"].includes(status.value)) {
        // 读取完成、暂停
        return;
      }
      let line = Regex_Match_Line.exec(buffer);
      if (line) {
        // 匹配成功，存在换行内容
        // 输出当前行内容
        yield buffer.substring(startIndex, line.index);
        startIndex = Regex_Match_Line.lastIndex;
        continue;
      }
      // 没有匹配到
      if (done) {
        // 读取结束
        status.value = "finish";
        break;
      }
      ({ value: value, done: done } = await render.read());
      buffer =
        buffer.substring(startIndex) + (value ? decoder.decode(value) : "");
      startIndex = Regex_Match_Line.lastIndex = 0;
    }

    // 读取结束，处理剩余
    if (startIndex < value!.length) {
      yield buffer.substring(startIndex);
    }
  }

  return {
    readline,
    status,
    error,
    stop() {
      // 停止读取
      abortController.abort();
      status.value = "stop";
    },
  };
};
