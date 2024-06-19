export function batteryColor(charge: number): string {
    if (charge > 75) {
        return "bg-green-500";
    } else if (charge > 50) {
        return "bg-yellow-500";
    } else if (charge > 25) {
        return "bg-orange-500";
    } else {
        return "bg-red-500";
    }
}
