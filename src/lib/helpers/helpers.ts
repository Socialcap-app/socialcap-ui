import { dayjs } from "svelte-time";
export function capitalizeFirstLetter(text: string | undefined): string {
    if (!text) return '';
    text = text.toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function convertDateToISO(date: Date | undefined): string | null {
    if (!date) return null;
    const d = dayjs(date, "utc").toDate().toISOString()
    console.log("convert to iso", d)
    return d;
}