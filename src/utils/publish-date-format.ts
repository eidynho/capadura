import { getYear } from "date-fns";

export function publishDateFormat(date?: Date | null | string) {
    if (!date) {
        return "Sem informação";
    }

    if (date.toString().indexOf("-") !== -1) {
        return `${getYear(new Date(date))}`;
    }

    return `${date}`;
}
