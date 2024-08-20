export async function pinFile(params: {
  file: File;
  keyvalues: { [key: string]: string };
}): Promise<string | undefined> {
  const { file, keyvalues } = params;
  try {
    const formData = new FormData();
    const metadata = {
      name: file.name,
      keyvalues: {
        ...keyvalues,
        mimeType: file.type,
        size: file.size.toString(),
        filename: file.name ?? "",
      },
    };
    formData.append("file", file);
    formData.append("pinataMetadata", JSON.stringify(metadata));
    formData.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));
    const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
    const IPFS_URL = import.meta.env.VITE_IPFS_URL;
    const endpoint = IPFS_URL;
    if (endpoint === undefined) throw new Error("IPFS URL is undefined");
    const key = PINATA_JWT;
    if (key === undefined) throw new Error("IPFS Key is undefined");
    const headers = {
      Authorization: "Bearer " + key,
    };
    console.log("pinFile", { endpoint, key, metadata, headers, formData });

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      headers: headers
    });

    const parsed = await response.json();
    if (!response.ok) {
      console.error("pinFile error on fetch", response.status, response.statusText, parsed.error.message);
    }

    if (parsed.IpfsHash) {
      console.log( "parsed", parsed)
      return parsed.IpfsHash;
    } else {
      console.error("pinFile error 1", parsed.error);
      return undefined;
    }
  } catch (err) {
    console.error("pinFile error 2 - catch", err);
    return undefined;
  }
}