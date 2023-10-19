import { getYear } from "date-fns";

export function publishDateFormat(date?: Date | null | string) {
    if (!date) {
        return "Sem informação";
    }

    const dateHasHyphen = date.toString().indexOf("-") !== -1;
    if (dateHasHyphen) {
        return `${getYear(new Date(date))}`;
    }

    return `${date}`;
}
