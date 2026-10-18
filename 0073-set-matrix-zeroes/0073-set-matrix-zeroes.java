class Solution {
    public void setZeroes(int[][] matrix) {
        int[][] original = new int[matrix.length][matrix[0].length];
for (int i = 0; i < matrix.length; i++) {
    original[i] = matrix[i].clone();
}
        for(int i=0;i<matrix.length;i++){
            for(int j=0;j<matrix[0].length;j++){
                if(isfound(original,i,j)){
                matrix[i][j]=0;
            }
            }
        }
    }
    static boolean isfound(int[][] matrix,int row,int col){
        for(int i=0;i<matrix.length;i++){
            if(matrix[i][col]==0){
                return true;
            }
        }for(int j=0;j<matrix[0].length;j++){
            if(matrix[row][j]==0){
                return true;
            }
            
            
        }
        return false;
    }
    
}