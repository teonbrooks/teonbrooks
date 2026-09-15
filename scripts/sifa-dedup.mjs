#!/usr/bin/env node
/**
 * One-time cleanup: an accidental re-run of sifa-migrate.mjs duplicated every
 * record it created (talks, posters, positions, involvement, honors,
 * projects). This finds duplicate groups by content-matching key within each
 * collection, keeps the one with the earliest createdAt (the original), and
 * deletes the rest.
 *
 * Usage:
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-dedup.mjs --dry-run
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-dedup.mjs
 */

const DID = 'did:plc:yl7wcldipsfnjdww2jg5mnrv';
const PDS_URL = process.env.SIFA_PDS_URL ?? 'https://inkcap.us-east.host.bsky.network';
const DRY_RUN = process.argv.includes('--dry-run');

async function login() {
	const identifier = process.env.SIFA_IDENTIFIER;
	const password = process.env.SIFA_APP_PASSWORD;
	if (!identifier || !password) {
		throw new Error('Set SIFA_IDENTIFIER and SIFA_APP_PASSWORD env vars (an app password, not your main password).');
	}
	const res = await fetch(`${PDS_URL}/xrpc/com.atproto.server.createSession`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ identifier, password })
	});
	if (!res.ok) throw new Error(`Login failed: ${res.status} ${await res.text()}`);
	const { accessJwt, did } = await res.json();
	if (did !== DID) throw new Error(`Logged in as ${did}, expected ${DID} — wrong account?`);
	return accessJwt;
}

async function listAllRecords(collection) {
	const records = [];
	let cursor;
	for (;;) {
		const url = new URL(`${PDS_URL}/xrpc/com.atproto.repo.listRecords`);
		url.searchParams.set('repo', DID);
		url.searchParams.set('collection', collection);
		url.searchParams.set('limit', '100');
		if (cursor) url.searchParams.set('cursor', cursor);
		const res = await fetch(url);
		if (!res.ok) throw new Error(`listRecords failed (${collection}): ${res.status} ${await res.text()}`);
		const data = await res.json();
		records.push(...data.records);
		if (!data.cursor || data.records.length === 0) break;
		cursor = data.cursor;
	}
	return records;
}

let opCount = 0;

async function deleteRecord(token, collection, rkey, label) {
	opCount++;
	console.log(`[${opCount}] DELETE ${collection}/${rkey}: ${label}`);
	if (DRY_RUN) return;
	const res = await fetch(`${PDS_URL}/xrpc/com.atproto.repo.deleteRecord`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
		body: JSON.stringify({ repo: DID, collection, rkey })
	});
	if (!res.ok) throw new Error(`deleteRecord failed (${collection}/${rkey}, ${label}): ${res.status} ${await res.text()}`);
}

/** Dedup key builders per collection — must match on stable content, not on
 * fields Sifa's app layer may normalize (e.g. company/agentRef). */
const KEY_BUILDERS = {
	'id.sifa.profile.presentationDelivery': (v) => `${v.title}|${v.eventName ?? ''}|${v.date ?? ''}`,
	'id.sifa.profile.position': (v) => `${v.title}|${(v.company ?? '').replace(/,?\s*LLC$/i, '').trim()}|${v.startedAt ?? ''}`,
	'id.sifa.profile.involvement': (v) => `${v.role}|${v.upstream ?? ''}|${v.startedAt ?? ''}`,
	'id.sifa.profile.honor': (v) => `${v.title}|${v.awardedAt ?? ''}`,
	'id.sifa.profile.project': (v) => `${v.name}`
};

async function dedupCollection(token, collection) {
	const records = await listAllRecords(collection);
	const keyFor = KEY_BUILDERS[collection];
	const groups = new Map();
	for (const r of records) {
		const key = keyFor(r.value);
		if (!groups.has(key)) groups.set(key, []);
		groups.get(key).push(r);
	}
	for (const [key, group] of groups) {
		if (group.length <= 1) continue;
		group.sort((a, b) => new Date(a.value.createdAt) - new Date(b.value.createdAt));
		const [keep, ...dupes] = group;
		console.log(`\nDuplicate group "${key}" (${group.length} copies) — keeping ${keep.uri.split('/').pop()} (${keep.value.createdAt})`);
		for (const dupe of dupes) {
			const rkey = dupe.uri.split('/').pop();
			await deleteRecord(token, collection, rkey, `duplicate of "${key}", created ${dupe.value.createdAt}`);
		}
	}
}

async function main() {
	console.log(DRY_RUN ? '=== DRY RUN — no writes will be made ===' : '=== LIVE RUN — writing to Sifa ===');
	const token = DRY_RUN ? null : await login();

	for (const collection of Object.keys(KEY_BUILDERS)) {
		console.log(`\n--- ${collection} ---`);
		await dedupCollection(token, collection);
	}

	console.log(`\n${opCount} duplicate(s) ${DRY_RUN ? 'found' : 'deleted'}.`);
}

main().catch((err) => {
	console.error('\nDedup failed:', err.message);
	process.exit(1);
});
