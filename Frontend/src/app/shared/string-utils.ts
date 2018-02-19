export class StringUtils {

  static xlsColumnDef: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']; 

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
