#!/usr/bin/env node
/**
 * Moves Gotham Data Clinic from a position record to an involvement record
 * (kind: Charity, matching how the other nonprofit board seat — Future of
 * Research — is already categorized). Reverses the merge patch2 did back
 * when consolidating Sifa, per Teon's request.
 *
 * Usage:
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch17.mjs --dry-run
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch17.mjs
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

let opCount = 0;

async function createRecord(token, collection, record, label) {
	opCount++;
	console.log(`[${opCount}] CREATE ${collection}: ${label}`);
	if (DRY_RUN) return;
	const res = await fetch(`${PDS_URL}/xrpc/com.atproto.repo.createRecord`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
		body: JSON.stringify({ repo: DID, collection, record })
	});
	if (!res.ok) throw new Error(`createRecord failed (${collection}, ${label}): ${res.status} ${await res.text()}`);
}

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

const nowIso = () => new Date().toISOString();

async function main() {
	console.log(DRY_RUN ? '=== DRY RUN — no writes will be made ===\n' : '=== LIVE RUN — writing to Sifa ===\n');
	const token = DRY_RUN ? null : await login();

	await createRecord(
		token,
		'id.sifa.profile.involvement',
		{
			$type: 'id.sifa.profile.involvement',
			kind: 'id.sifa.defs#involvementCharity',
			upstream: 'Gotham Data Clinic',
			upstreamUrl: 'https://gothamdataclinic.org',
			role: 'President',
			startedAt: '2019-11',
			description:
				'We are the Gotham Data Clinic, and we are focused on researching, building, and sharing data science education tools for the next generation of scientists and technologists.\n\n' +
				'Originally founded in 2019 as CiELabs, the nonprofit was on hiatus through the pandemic. In 2023, we rebranded and refocused our efforts.\n\n' +
				'Founded and established the nonprofit from its incorporation through its application for federal tax exemption. Lead workshops on data literacy with partner organizations. Build new partnerships with NYC Public Schools and CUNY. Lead product development work for new digital infrastructure to teach data science at scale. Write scholarly work to support both our community and product development work.',
			createdAt: nowIso()
		},
		'Gotham Data Clinic — new involvement record (President)'
	);

	await deleteRecord(token, 'id.sifa.profile.position', '3mizjdque222b', 'Gotham Data Clinic — delete position record');

	console.log(`\n${opCount} operations ${DRY_RUN ? 'planned' : 'completed'}.`);
}

main().catch((err) => {
	console.error('\nPatch failed:', err.message);
	process.exit(1);
});
