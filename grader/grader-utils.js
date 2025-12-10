function levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
  
    const matrix = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  
    for (let i = 0; i <= m; i++) {
      matrix[i][0] = i;
    }
  
    for (let j = 0; j <= n; j++) {
      matrix[0][j] = j;
    }
  
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j - 1] + 1
          );
        }
      }
    }
  
    return matrix[m][n];
  };

  export {levenshteinDistance};