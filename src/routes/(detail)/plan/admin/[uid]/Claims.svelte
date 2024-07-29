<script lang="ts">
	import { Input, Dropdown, Button, DropdownItem, Tooltip, Label } from 'flowbite-svelte';
	import type { Plan } from '$lib/types';
	import type { Claim } from '$lib/types/claim';
	import { DownloadOutline, InfoCircleOutline } from 'flowbite-svelte-icons';
	import { API } from '$lib/api';
	import ClaimsTable from './ClaimsTable.svelte';
	import { ALL_STATES } from '$lib/types/states';

	export let plan: Plan | undefined = undefined,
		claims: Claim[] = [];

	let columns = [],
		contains = '',
		orderBy = [];

	$: planClaims = claims.filter((c) => c.planUid === plan?.uid);
	$: fields = prepareColumnsSelector(planClaims);
	$: searchableClaims = makeSearchable(planClaims);
	$: downloadLink = setDownloadLink();
	$: columns = filterSelected(fields);
	$: filteredClaims = filterClaims(searchableClaims!, contains);
	$: communityUid = plan?.communityUid;

	function makeSearchable(claims: Claim[]) {
		if ((claims || []).length === 0) return;

		claims = claims.map((claim) => {
			let values = Array.isArray(claim.evidenceData)
				? claim.evidenceData
				: JSON.parse(claim.evidenceData!);
			if (typeof values === 'string') values = JSON.parse(values);
			if (values.length === 0) return claim;
			const texts = (values || []).map((t: any) => '[' + t.value + ']').join('');
			claim.searchable = (texts + claim.applicant)
				// + claim.evidenceData["details"]  // ToDo add fixed details field on evidence data
				.toUpperCase();

			claim.evidenceData = Array.isArray(claim.evidenceData)
				? claim.evidenceData
				: JSON.parse(claim.evidenceData!);

			return claim;
		});

		return claims;
	}

	function prepareColumnsSelector(claims: Claim[]) {
		if ((claims || []).length === 0) return [];
		const evidenceData = Array.isArray(claims[0].evidenceData)
			? claims[0].evidenceData
			: JSON.parse(claims[0].evidenceData!);
		if (evidenceData.length === 0) return [];
		return evidenceData.map((t: any, j: number) => {
			return {
				label: t.label,
				index: j,
				isRemark: t.type === 'remark',
				selected: false
			};
		});
	}

	function filterSelected(fields: any) {
		if ((fields || []).length === 0) return;

		let cols = fields.filter((t: any) => t.selected).map((t: any) => t.index);
		console.log('cols', cols);
		return cols;
	}

	function filterClaims(claims: Claim[], word: string) {
		if (!contains.trim().length) return claims;
		word = word.toUpperCase();
		let filtered: Claim[] = [];
		claims.forEach((claim) => {
			let ok = claim.searchable.includes(word);
			if (ok) filtered.push(claim);
		});
		return filtered;
	}

	function setDownloadLink() {
		return {
			href: `${API.baseUrl}/download/plan_claims?uid=${communityUid}&planUid=${plan?.uid}`,
			fileName: 'claims.csv'
		};
	}
</script>

<div>
	<div class="flex items-center justify-between gap-3 p-3">
		<div class="flex space-x-2 w-full">
			<Input type="search" placeholder="Search ..." bind:value={contains} />
		</div>
		<Button outline color="dark" class="rounded-2 gap-2">
			<a 
			  href={downloadLink.href} 
			  download={downloadLink.fileName}>
			  <DownloadOutline name="download" />
			</a>
			Download
		  </Button>
	</div>

	<ClaimsTable data={filteredClaims} />
</div>
