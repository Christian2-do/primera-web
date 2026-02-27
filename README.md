# primera-web

This is an Ionic/Vue project. It now includes the **Webnative SDK** dependency and a simple demo script.

## Running the Webnative Demo

You can verify that the `webnative` package is installed and working by running:

```bash
npm run webnative:demo
```

This script will print the installed SDK version and whether the current environment is supported.

## Using Webnative in the App

The login page (`/src/views/login.vue`) displays the Webnative version and support status as part of its UI. You can also import and use `webnative` anywhere in your project:

```ts
import * as webnative from 'webnative';

console.log(webnative.VERSION);
```

Because `webnative` is primarily browser-oriented, certain operations such as `webnative.program()` may only work in a browser environment.

## VS Code Extension

For additional tooling, the workspace recommends the [Webnative](https://marketplace.visualstudio.com/items?itemName=Webnative.webnative) extension. Install it via the Extensions view in VS Code and run its commands through the command palette (e.g. `Webnative: Start`).

---

Feel free to remove the dependency if you don't actually need it; it was added to satisfy the request to "arreglar y ejecutar webnative".