export type { IdentityCredential }

interface IdentityCredential {
    label: string // a name or label for this identity, assigned by user
    pin: string // a six digits pin number, assigned by the user
    file?: string
}