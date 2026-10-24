class Solution {
    public int[][] generateMatrix(int n) {
        int[][] matrix=new int[n][n];
        int count=1;
        int fc=0;
        int fr=0;
        int lc=matrix[0].length-1;
        int lr=matrix.length-1;
        while( fr<=lr && fc<=lc ){
            for(int i=fc;i<=lc;i++){
                matrix[fr][i]=count++;
               // count++;
            } fr++;
            for(int i=fr;i<=lr;i++){
                matrix[i][lc]=count++;
                //count++;
            }lc--;
            if(fr<=lr){
                for(int i=lc;i>=fc;i--){
                    matrix[lr][i]=count++;
                   // count++;
                }
                lr--;
            }
            if(fc<=lc){
            for(int i=lr;i>=fr;i--){
                matrix[i][fc]=count++;
               // count++;
                }
                fc++;

           }
        }return matrix;
        
    }
}