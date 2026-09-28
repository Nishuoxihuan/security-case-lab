/** 构建搜索索引（文档 9.2）：输出 data/generated/search-index.json */
import fs from 'node:fs';
import path from 'node:path';
import { getAllCases } from '../lib/content';
import { buildSearchDocuments } from '../lib/search';

const outDir = path.join(process.cwd(), 'data', 'generated');
fs.mkdirSync(outDir, { recursive: true });

const docs = buildSearchDocuments(getAllCases());
const outPath = path.join(outDir, 'search-index.json');
fs.writeFileSync(outPath, JSON.stringify(docs, null, 2) + '\n');
console.log(`搜索索引已生成：${docs.length} 篇文档 → data/generated/search-index.json`);
