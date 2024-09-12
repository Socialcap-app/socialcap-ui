/** @type {import('./$types').PageLoad} */
export async function load({ params, route, url }) {
  let planUid = url.searchParams.get('mp');
  let mode = url.searchParams.get('mode');
  return {
    uid: params.uid,
    planUid: planUid,
    mode: mode
  };
}