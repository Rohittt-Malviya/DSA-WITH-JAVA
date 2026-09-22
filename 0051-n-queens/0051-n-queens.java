class Solution {
    public List<List<String>> solveNQueens(int n) {
     char[][]board=new char[n][n];
        
        for(int i=0;i<n;i++){
            Arrays.fill(board[i],'.');
        }
        List<List<String>> list=new ArrayList<>();
        int col=0;
        solve(board,n,col,list);
        return list;
    }
     static boolean Isplace(int r,int col,int n,char[][] board){
        int ro=r;
        int co=col;
        while(co>=0){
            if(board[ro][co]=='Q'){
                return false;
            }
            co--;
        }
         ro=r;
         co=col;
        while(ro<n && co>=0){
            if(board[ro][co]=='Q'){
                return false;
            }
            co--;
            ro++;
        }
         ro=r;
         co=col;
        while(ro>=0 && co>=0){
            if(board[ro][co]=='Q'){
                return false;
            }
            co--;
            ro--;
        }
        return true;
     }
    static void solve(char[][] board,int n,int col,List<List<String>> list){
        if(col>=n){
            List<String> k=new ArrayList<>();
                for(int i=0;i<n;i++){
                    k.add( new String(board[i]));
                }
                list.add(k);
                return;
                }

            for(int r=0;r<n;r++){
                    if(Isplace(r,col,n,board)){
                        board[r][col]='Q';
                        solve(board,n,col+1,list);
                        board[r][col]='.';
                    }
                  }
            

        } 
    
 }   
