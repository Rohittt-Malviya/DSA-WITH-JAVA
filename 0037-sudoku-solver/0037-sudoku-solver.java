class Solution {
    public void solveSudoku(char[][] board) {
        sudo(board);
    }
     static boolean isSafe(char[][] board,int[] empty){
        for (int a=0;a<board.length;a++){
            for (int b=0;b<board[0].length;b++){
                if(board[a][b]=='.'){
                    empty[0]=a;
                    empty[1]=b;
                    return true;
                }
            }
        } return false;
    }static boolean isplace(char[][] board,char value,int row,int col){
        for (int j=0;j<board[0].length;j++) {// this is to check that entire row
            if (board[row][j] == value) {
                return false;
            }
        }
        for (int p=0;p<board.length;p++){// this to check the entire column
            if (board[p][col]==value){
                return false;
            }
        }
        int srow=row-row%3;
        int scol=col-col%3;
        for (int i=0;i<3;i++){
            for (int j=0;j<3;j++){
                int arow=srow+i;
                int acol=scol+j;
                if (board[arow][acol]==value){
                    return false;
                }
            }
        }
        return true;
    }
    static boolean sudo(char[][] board){
        int r=board.length;
        int c=board[0].length;
        int[] empty=new int[2];
        if(!isSafe(board,empty)){
            return true;
        }
        int row=empty[0];
        int col=empty[1];
        for (int t=1;t<=9;t++){
            char value=(char) (t+'0');
            if(isplace(board,value,row,col)){
                board[row][col]=value;
                if(sudo(board)==true){
                    return true;
                }
            } board[row][col]='.';
        }
        return false;
    }
}