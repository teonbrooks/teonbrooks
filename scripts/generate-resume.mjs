#!/usr/bin/env node
/**
 * Generates the résumé PDF — a curated, industry-facing subset of the CV
 * (see scripts/lib/resume-data.mjs for exactly what's included/excluded and
 * why), from the same Sifa-sourced toml mirror the CV uses. Writes an
 * intermediate resume-data.json next to the Typst template and shells out
 * to `typst compile`.
 *
 * Requires Typst: brew install typst
 * Usage: node scripts/generate-resume.mjs
 */

import { execFile } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { loadResumeData } from './lib/resume-data.mjs';

const execFileAsync = promisify(execFile);
const TYPST_DIR = path.join(import.meta.dirname, 'typst');
const OUTPUT_DIR = path.join(import.meta.dirname, '..', 'output');

async function main() {
	const data = await loadResumeData();
	await writeFile(path.join(TYPST_DIR, 'resume-data.json'), JSON.stringify(data, null, 2));

	await mkdir(OUTPUT_DIR, { recursive: true });
	const outputPath = path.join(OUTPUT_DIR, 'resume.pdf');

	try {
		await execFileAsync('typst', ['compile', path.join(TYPST_DIR, 'resume.typ'), outputPath]);
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
