import { createHash } from "node:crypto";

export type KeyFacts = {
  fingerprint: string;
  identity: string;
  algorithms: string[];
  expires: string;
};

const CURVES: Record<string, string> = {
  "2b06010401da470f01": "Ed25519",
  "2b060104019755010501": "Curve25519",
};

type Packet = { tag: number; body: Uint8Array };

function unarmor(armored: string): Uint8Array {
  const lines = armored.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === "") + 1;
  const end = lines.findIndex((line, index) => index >= start && /^[=-]/.test(line));
  return Uint8Array.from(Buffer.from(lines.slice(start, end).join(""), "base64"));
}

// RFC 9580, section 4.2: GnuPG writes the legacy header format, other tools the OpenPGP one.
function header(bytes: Uint8Array, at: number): { tag: number; length: number; size: number } {
  const ctb = bytes[at] ?? 0;
  const view = new DataView(bytes.buffer, bytes.byteOffset);
  if ((ctb & 0x40) === 0) {
    const tag = (ctb >> 2) & 0x0f;
    switch (ctb & 3) {
      case 0:
        return { tag, length: bytes[at + 1] ?? 0, size: 2 };
      case 1:
        return { tag, length: view.getUint16(at + 1), size: 3 };
      default:
        return { tag, length: view.getUint32(at + 1), size: 5 };
    }
  }
  const first = bytes[at + 1] ?? 0;
  if (first < 192) {
    return { tag: ctb & 0x3f, length: first, size: 2 };
  }
  if (first < 224) {
    return { tag: ctb & 0x3f, length: ((first - 192) << 8) + (bytes[at + 2] ?? 0) + 192, size: 3 };
  }
  return { tag: ctb & 0x3f, length: view.getUint32(at + 2), size: 6 };
}

function packets(bytes: Uint8Array): Packet[] {
  const found: Packet[] = [];
  let at = 0;
  while (at < bytes.length) {
    const { tag, length, size } = header(bytes, at);
    found.push({ tag, body: bytes.subarray(at + size, at + size + length) });
    at += size + length;
  }
  return found;
}

function hex(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("hex");
}

function curve(key: Uint8Array): string {
  const oid = key.subarray(7, 7 + (key[6] ?? 0));
  return CURVES[hex(oid)] ?? `algorithm ${key[5] ?? 0}`;
}

function fingerprint(key: Uint8Array): string {
  const prefix = Uint8Array.of(0x99, key.length >> 8, key.length & 0xff);
  const digest = createHash("sha1").update(prefix).update(key).digest("hex").toUpperCase();
  return digest.match(/.{4}/g)?.join(" ") ?? digest;
}

// Key expiration time subpacket (type 9) of the self-signature: seconds after the key's creation.
function lifetime(signature: Uint8Array): number | undefined {
  const view = new DataView(signature.buffer, signature.byteOffset);
  const hashed = view.getUint16(4);
  let at = 6;
  while (at < 6 + hashed) {
    const length = signature[at] ?? 0;
    const type = (signature[at + 1] ?? 0) & 0x7f;
    if (type === 9) {
      return view.getUint32(at + 2);
    }
    at += 1 + length;
  }
  return undefined;
}

export function readKey(armored: string): KeyFacts {
  const all = packets(unarmor(armored));
  const primary = all.find((packet) => packet.tag === 6);
  const uid = all.findIndex((packet) => packet.tag === 13);
  const selfSignature = all.slice(uid + 1).find((packet) => packet.tag === 2);
  if (!primary || uid < 0 || !selfSignature) {
    throw new Error("security.asc: no primary key, identity or self-signature");
  }
  const created = new DataView(primary.body.buffer, primary.body.byteOffset + 1, 4).getUint32(0);
  const seconds = lifetime(selfSignature.body);
  if (seconds === undefined) {
    throw new Error("security.asc: the key never expires");
  }
  const subkeys = all.filter((packet) => packet.tag === 14).map((packet) => curve(packet.body));
  return {
    fingerprint: fingerprint(primary.body),
    identity: new TextDecoder().decode(all[uid]?.body),
    algorithms: [curve(primary.body), ...subkeys],
    expires: new Date((created + seconds) * 1000).toISOString().slice(0, 10),
  };
}
