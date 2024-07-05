import { API, type APIResponse } from "./api-client";

export {
    stopClaimings,
    enableVoting,
    closeVoting,
    reopenVoting,
    startTally,
    closeTally,
    issueCredentials
}

async function stopClaimings(planUid : string) : Promise<any> {
    const rs = await API.mutate("stop_claimings", {planUid});
    if (rs.error) 
      return rs;
    return rs.data;
}

async function enableVoting(planUid : string) : Promise<any> {
    const rs = await API.mutate("enable_voting", {planUid});
    if (rs.error) 
      return rs;
    return rs.data;
}

async function closeVoting(planUid : string) : Promise<any> {
    const rs = await API.mutate("close_voting", {planUid});
    if (rs.error) 
      return rs;
    return rs.data;
}

async function reopenVoting(planUid : string) : Promise<any> {
    const rs = await API.mutate("reopen_voting", {planUid});
    if (rs.error) 
      return rs;
    return rs.data;
}

async function startTally(planUid : string) : Promise<any> {
    const rs = await API.mutate("start_tally", {planUid});
    if (rs.error) 
      return rs;
    return rs.data;
}

async function closeTally(planUid : string) : Promise<any> {
    const rs = await API.mutate("close_tally", {planUid});
    if (rs.error) 
      return rs;
    return rs.data;
}
  
  async function issueCredentials(planUid : string) : Promise<any> {
    const rs = await API.mutate("issue_credentials", {planUid});
    if (rs.error) 
      return rs;
    return rs.data;
}
