export class DateUtils {
  static GetTodaysDate(): string {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; //January is 0!
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }
}
