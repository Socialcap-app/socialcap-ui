import { API } from "./api-client";
import type { Plan } from "$lib/types/plan";

export { 
  sendInvites
}

/**
 * Send invites to users with email
 * @returns Plan 
 */
async function sendInvites(params: { 
  recipients: string // comma separated list of emails
}): Promise<any> {
  const rs = await API.mutate("invite", params);
  if (rs.error) throw rs.error; // TODO handle error
  return rs.data;
}
