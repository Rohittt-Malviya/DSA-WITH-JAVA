class Solution {
    public int[][] transpose(int[][] matrix) {
        int[][] matrixes=new int[matrix[0].length][matrix.length];
        for(int i=0;i<matrixes.length;i++){
            for(int j=0;j<matrixes[0].length;j++){
                matrixes[i][j]=matrix[j][i];
            }
        }
        return matrixes;
    }
}