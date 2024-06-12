# Support for NATS

## Concepts

The App will notify activities by publishing to the `socialcap:notifications`
subject. 

This subject is being listened by the API and will do some things with
the notification (such as saving them in the Postgres DB, to have an history 
of all activities). It may do some additional work depending on the message.

AFTER the API processes the message it will create a new message depending on 
the scope and publish this message, even with some new information (such 
as a transaction metadata). The published message will be re-directed to one 
of this subjects:

- `socialcap:all`: for messages to everyone.
-  `socialcap:group.${uid}`: for messages to some community, where 'uid' 
    is the target community UID.
- `socialcap:personal.${uid}`: for messages to some user, where 'uid' 
    is the target user UID.

The App will we listening to this subjects and will refresh the Activites list
accordingly.    

## Usage

**Notifications from App**

~~~
  import { NATSclient } from "$lib/nats";
	import { getCurrentUser } from '$lib/store';

  let user = getCurrentUser();

  NATSClient.notify('personal', { 
    memo: `Payment sent for claim: '01234...6789'`,
    subject: user?.uid,
    type: 'transaction',
    state: 9, // WAITING
    metadata: `{ 
      "hash": "5Ju8dUC3NDZ2hNgrGS8ykBQHx7Mu76EUE3UZ2RxPm1UT7Sys9MCc", 
      "type": "zk-tx", 
      "net": "devnet"
    }`
  });
~~~

**App listens to messages**

~~~
  import { NATSclient } from "$lib/nats";

  function handleMessage(subject, data) {
    console.log(`handleMessage subject=${subject}`, data);

    // do something with the message here ...
    // for example refresh the Activities list 
  }

  NATSClient.listen([
    // process messages to everyone
    { subject: 'socialcap:all', handler: handleMessage },

    // process messages only from my communities
    { subject: 'socialcap:groups.def...123', handler: handleMessage },
    { subject: 'socialcap:groups.abc...023', handler: handleMessage },

    // process messages destined just for me 
    { subject: 'socialcap:personal.ec3...ddd', handler: handleMessage },
  ])
~~~

## Example notifications

~~~
    {
      scope: 'group',
      type: ActivityType.message,
      memo: 'Community X has a new member'+
        '<br>👋 Say hi to Luis Pperino Pomodoro !',
      createdUTC: new Date('2024-06-05T12:30:00.000Z'),
      state: 0,
      metadata: '{}'
    },
    {
      scope: 'personal',
      type: ActivityType.transaction,
      memo: `Payment sent for claim: '01234...6789'`
        +'<br>Please wait for confirmation',
      createdUTC: new Date('2024-06-05T12:30:00.000Z'),
      state: 9,
      metadata: `{ 
        "hash": "5Ju8dUC3NDZ2hNgrGS8ykBQHx7Mu76EUE3UZ2RxPm1UT7Sys9MCc", 
        "type": "zk-tx", 
        "net": "devnet"
      }`
    },
    {
      scope: 'personal',
      type: ActivityType.transaction,
      memo: `Payment failed for claim: '01234...6789'`
        +'<br>Please try again !',
      createdUTC: new Date('2024-06-05T12:30:00.000Z'),
      state: 12,
      metadata: `{ 
        "hash": "5Ju8dUC3NDZ2hNgrGS8ykBQHx7Mu76EUE3UZ2RxPm1UT7Sys9MCc", 
        "type": "zk-tx", 
        "net": "devnet"
      }`
    },
    {
      scope: 'personal',
      type: ActivityType.transaction,
      memo: `Payment received for claim <b>01234...6789</b> 
        <br>Your claim has been succesfully submitted !'`,
      createdUTC: new Date('2024-06-05T12:30:00.000Z'),
      state: 10,
      metadata: `{ 
        "hash": "5Ju8dUC3NDZ2hNgrGS8ykBQHx7Mu76EUE3UZ2RxPm1UT7Sys9MCc", 
        "type": "zk-tx", 
        "net": "devnet"
      }`
    },
~~~