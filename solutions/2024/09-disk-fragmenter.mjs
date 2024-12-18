import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

class Block {
  constructor(fileId, range) {
    this.fileId = fileId;
    this.range = range;
  }

  get isFree() {
    return this.fileId === -1;
  }

  get len() {
    return this.range[1] - this.range[0] + 1;
  }

  clone() {
    return new Block(this.fileId, [...this.range]);
  }
}

class Filesystem {
  constructor(blocks) {
    this.blocks = blocks;
  }

  splitLeft(ind, fileId, len) {
    const block = this.blocks[ind];
    if (block.len < len) throw new Error("block too short to split");

    if (block.len === len) {
      block.fileId = fileId;
      return false;
    }

    this.blocks.splice(ind, 0, new Block(fileId, [block.range[0], block.range[0] + len - 1]));
    block.range[0] += len;
    return true;
  }

  splitRight(ind, fileId, len) {
    const block = this.blocks[ind];
    if (block.len < len) throw new Error("block too short to split");

    if (block.len === len) {
      block.fileId = fileId;
      return false;
    }

    block.range[1] -= len;
    this.blocks.splice(ind + 1, 0, new Block(fileId, [block.range[1] + 1, block.range[1] + len]));
    return true;
  }

  checksum() {
    return _.sum(
      this.blocks.map((block) =>
        block.isFree ? 0 : (block.fileId * (block.range[0] + block.range[1]) * block.len) / 2
      )
    );
  }

  clone() {
    return new Filesystem(this.blocks.map((block) => block.clone()));
  }
}

export async function solve() {
  let pointer = 0;
  const fs = new Filesystem(
    (await fetchInputForDay(9, 2024))
      .trim()
      .split("")
      .map(
        (len, index) =>
          new Block(index % 2 === 0 ? index / 2 : -1, [pointer, (pointer += Number(len)) - 1])
      )
  );

  function defrag1(fs) {
    let fileBlockIndex = fs.blocks.length - 1;
    let freeBlockIndex = 1;

    while (fileBlockIndex > freeBlockIndex) {
      const fileBlock = fs.blocks[fileBlockIndex];
      const freeBlock = fs.blocks[freeBlockIndex];

      if (fileBlock.len <= freeBlock.len) {
        fs.splitLeft(freeBlockIndex, fileBlock.fileId, fileBlock.len);
        fileBlock.fileId = -1;
      } else {
        freeBlock.fileId = fileBlock.fileId;
        fs.splitRight(fileBlockIndex, -1, freeBlock.len);
      }

      while (!fs.blocks[freeBlockIndex].isFree) freeBlockIndex += 1;
      while (fs.blocks[fileBlockIndex].isFree) fileBlockIndex -= 1;
    }

    return fs.checksum();
  }

  function defrag2(fs) {
    for (let index = fs.blocks.length - 1; index >= 0; index -= 1) {
      const block = fs.blocks[index];
      if (block.isFree) continue;

      for (let i = 0; i < index; i += 1) {
        const freeBlock = fs.blocks[i];
        if (freeBlock.isFree && freeBlock.len >= block.len) {
          const newBlockAdded = fs.splitLeft(i, block.fileId, block.len);
          if (newBlockAdded) index += 1;

          block.fileId = -1;
          break;
        }
      }
    }

    return fs.checksum();
  }

  console.log("Answer, part 1:", defrag1(fs.clone()));
  console.log("Answer, part 2:", defrag2(fs.clone()));
}
