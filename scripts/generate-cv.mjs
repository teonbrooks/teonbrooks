#!/usr/bin/env node
/**
 * Generates the CV PDF from Sifa-sourced content (via the local toml mirror
 * in static/content/cv/, kept in sync with scripts/sifa-export-toml.mjs).
 * Writes an intermediate data.json next to the Typst template and shells
 * out to `typst compile`.
 *
 * Requires Typst: brew install typst
 * Usage: node scripts/generate-cv.mjs
 */

import { execFile } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { loadCvData } from './lib/cv-data.mjs';

const execFileAsync = promisify(execFile);
const TYPST_DIR = path.join(import.meta.dirname, 'typst');
const OUTPUT_DIR = path.join(import.meta.dirname, '..', 'output');

async function main() {
	const data = await loadCvData();
	await writeFile(path.join(TYPST_DIR, 'data.json'), JSON.stringify(data, null, 2));

	await mkdir(OUTPUT_DIR, { recursive: true });
	const outputPath = path.join(OUTPUT_DIR, 'cv.pdf');

	try {
		await execFileAsync('typst', ['compile', path.join(TYPST_DIR, 'cv.typ'), outputPath]);
	} catch (err) {
		if (err.code === 'ENOENT') {
			throw new Error('Typst not found. Install it with: brew install typst');
		}
		console.error(err.stdout || '');
		console.error(err.stderr || '');
		throw new Error('typst compile failed');
	}

	console.log(`Wrote ${path.relative(process.cwd(), outputPath)}`);
}

main().catch((err) => {
	console.error(err.message);
	process.exit(1);
});
