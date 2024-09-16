/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    return {
      uid: params.uid
    };
  }