/** @type {import('./$types').PageLoad} */
export async function load( { params, route, url })  {
  const communityUid =  url.searchParams.get('communityUid')
    return {
      uid: params.uid,
      communityUid: communityUid
    };
  }