# smpp-ts

TypeScript rewrite of the original [`node-smpp`](https://github.com/farhadi/node-smpp) library.

## ✨ Overview

`smpp-ts` is a TypeScript-based SMPP (Short Message Peer-to-Peer) library designed for Node.js. It is a complete rewrite of the original `node-smpp` package with full TypeScript support, improved type safety, modern coding standards, and maintainability.

This rewrite aims to preserve the original functionality and behavior of `node-smpp`, while providing a better development experience for modern JavaScript/TypeScript projects.

## 🔧 Features

- Fully written in TypeScript
- ES module compatible
- Backward-compatible where applicable with `node-smpp`

## 🚀 Installation

```bash
npm install github:elsamuell/smpp-ts
```

## 📦 Usage

Basic example of how to create a session:

```ts
import { smpp } from 'smpp-ts';

const session: any = SMPP.connect({
  host: 'smsc.example.comcalhost',
  port: 2775,
  debug: true
});

session.bind_transceiver({
  system_id: 'your-system-id',
  password: 'your-password',
});
session.on('bind_transceiver_resp', (pdu) => {
  console.log('Bound as transceiver');
});

session.on('close', () => {
  console.log('Connection closed');
});
```

## 📚 Migration Notes

If you're familiar with `node-smpp`, most of the concepts and APIs remain the same. The major changes are:

- ES module syntax (`import`/`export`)
- Strict TypeScript types and interfaces
- Improved code structure for maintainability

## 🙏 Acknowledgements

Original implementation and inspiration from [`node-smpp`](https://github.com/farhadi/node-smpp) by @farhadi.

## 📃 License

MIT License
