/* eslint-disable @typescript-eslint/no-explicit-any */
import { API, type APIResponse } from "./api-client";
import { type Activity, ActivityScope, ActivityType } from "$lib/types";

export { 
  getMyActivities,
}

/**
 * Get the updated list of all my activities
 * @returns APIResponse
 */
async function getMyActivities(params: {
  fromSequence: bigint, 
  limit?: number,
}): Promise<APIResponse> {
  try {
    const rs = await API.query("get_my_notifications", {
      fromSequence: Number(params.fromSequence),
      limit: params.limit || 100
    });
    
    return {
      data: rs.error ? null : rs.data.map((t: any) => {
        // convert types and scope from strings to enums
        t.type = isType(t.type);
        t.scope = isScope(t.scope);
        return t;
      }),
      error: rs.error ? rs.error : undefined
    }; 
  }
  catch(error: any) {
    return {
      data: null,
      error: error
    }
  }
}

function isType(s: string) {
  if (s === 'message') return ActivityType.message;
  if (s === 'request') return ActivityType.request;
  if (s === 'transaction') return ActivityType.transaction;
}

function isScope(s: string) {
  if (s === 'all') return ActivityScope.all;
  if (s === 'group') return ActivityScope.group;
  if (s === 'personal') return ActivityScope.personal;
}
