function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}
function createMatrix(row, col) {
  const arr = new Array(col);
  for (let i = 0; i < col; i++) {
    arr[i] = new Array(row).fill(0);
  }
  return arr;
}

function duplicateMatrix(mat) {
  const newMat = new Array(mat.length);
  for (let i = 0; i < mat.length; i++) {
    newMat[i] = mat[i].copyWithin();
  }
  return newMat;
}

function autoScale() {
  const scale = min(
    (windowHeight-200)/Global.size.height,
    windowWidth / Global.size.width
  );
  Global.scale = scale;
  return scale;
}