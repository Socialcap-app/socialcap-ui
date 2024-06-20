
export { 
  type Activity,
  ActivityScope,
  ActivityType 
}

interface Activity {
    // Uid and sequence (autonum) of the notification
    uid: string
    sequence: bigint

    // scope for this notification: all, group, personal
    scope: ActivityScope 

    // subject who will receive or started this notification
    // it can be used to bind it to a NATS suscription
    // if scope == personal it contains the userUid
    // if scope == group it contains the community Uid
    // if scope == all it is contains 'all'
    subject: string 

    // type of the notified activity: transaction, message, request
    type: ActivityType 

    // text message, can contain HTML codes to improve readability 
    memo: string

    // state of the activity: NONE, WAITING, DONE, UNPAID
    state: number

    // when the activity was created (UTC)
    createdUTC: Date

    // metadata in JSON format for the given activity, it will be deserialized
    // by the users of the notification and may change depending on 'type' 
    metadata: string
}

enum ActivityType {
  transaction,// involves some MINA transaction
  message,    // just informative
  request     // needs some action from user or admin
}

enum ActivityScope {
  all,      // it must be sent to everyone
  group,    // it must be sent memebers of a given community
  personal  // it must be sent to a particuar user
}
