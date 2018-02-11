export class StringUtils {

  static Displayify(camelCase: string): string {
    const theString = camelCase;
    const result = theString
      // insert a space before all caps
      .replace(/([A-Z])/g, ' $1')
      // uppercase the first character
      .replace(/^./, str => str.toUpperCase());
    console.log(`Displaify(${camelCase}) = ${result}`);
    return result;
  }
}
