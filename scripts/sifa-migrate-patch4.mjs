#!/usr/bin/env node
/**
 * Adds the résumé's "Nonprofit Leadership Experience" bullets for Gotham
 * Data Clinic, which never made it into the Sifa description.
 *
 * Usage:
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch4.mjs --dry-run
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch4.mjs
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

async function putRecord(token, collection, rkey, record, label) {
	opCount++;
	console.log(`[${opCount}] EDIT ${collection}/${rkey}: ${label}`);
	if (DRY_RUN) return;
	const res = await fetch(`${PDS_URL}/xrpc/com.atproto.repo.putRecord`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
		body: JSON.stringify({ repo: DID, collection, rkey, record })
	});
	if (!res.ok) throw new Error(`putRecord failed (${collection}/${rkey}, ${label}): ${res.status} ${await res.text()}`);
}

async function main() {
	console.log(DRY_RUN ? '=== DRY RUN — no writes will be made ===\n' : '=== LIVE RUN — writing to Sifa ===\n');
	const token = DRY_RUN ? null : await login();

	await putRecord(token, 'id.sifa.profile.position', '3mizjdque222b', {
		$type: 'id.sifa.profile.position',
		title: 'President',
		company: 'Gotham Data Clinic',
		agentRef: { did: 'did:plc:34pb7avp5yrjan4n3pfzq26f', name: 'Gotham Data Clinic', entityRef: 'https://ror.org/03k0d2d56' },
		createdAt: '2026-04-09T00:09:11.167Z',
		entityRef: 'https://ror.org/03k0d2d56',
		isPrimary: true,
		startedAt: '2019-11',
		companyDid: 'did:plc:34pb7avp5yrjan4n3pfzq26f',
		employmentType: 'id.sifa.defs#boardMember',
		description:
			'We are the Gotham Data Clinic, and we are focused on researching, building, and sharing data science education tools for the next generation of scientists and technologists.\n\n' +
			'Originally founded in 2019 as CiELabs, the nonprofit was on hiatus through the pandemic. In 2023, we rebranded and refocused our efforts.\n\n' +
			'• Founded and established the nonprofit from its incorporation through its application for federal tax exemption.\n' +
			'• Lead workshops on data literacy with partner organizations.\n' +
			'• Build new partnerships with NYC Public Schools and CUNY.\n' +
			'• Lead product development work for new digital infrastructure to teach data science at scale.\n' +
			'• Write scholarly work to support both our community and product development work.'
	}, 'Gotham Data Clinic — add Nonprofit Leadership Experience bullets');

	console.log(`\n${opCount} operations ${DRY_RUN ? 'planned' : 'completed'}.`);
}

main().catch((err) => {
	console.error('\nPatch failed:', err.message);
	process.exit(1);
});
