
# `useFetchStream`

Using `fetch` read  stream data.

## Useage

### Basic Usage

The `useFetchStream` function can be providing a url. the url can be a string.

```ts
import { useFetchStream } from '@ifun-vue3/hooks'

const { readline,status } = useFetchStream(url);
```

You can use `readline` fuction to read the stream data.

```ts
for await (const line of readline()) {
    // handle every line data
}
```

### Abort a request

A request can be aborted by calling the `stop` function from the `useFetchStream` function.

```ts
const { stop, status } = useFetchStream(url);

setTimeout(() => {
    stop();
},5*1000)
```

A request can be alos aborted by automatically by using the `timeout` option. It will abort the request after the specified time.

```rs
const { status } = useFetchStream(url,{ timeout:10*1000 })
```
