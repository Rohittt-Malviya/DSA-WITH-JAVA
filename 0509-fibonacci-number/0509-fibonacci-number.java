class Solution {
    //static int[] dp;
    public int fib(int n) {
       int[] dp=new int[n+1];
        if(n<=1){
            return n;
        }
        if(dp[n]!=0){
            return dp[n];
        }
        int ans=fib(n-1)+fib(n-2);
        dp[n]=ans;
        return ans;
    }
}