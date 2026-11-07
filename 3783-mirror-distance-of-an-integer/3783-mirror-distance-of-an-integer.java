class Solution {
    public int mirrorDistance(int n) {
        int a=n;
        int rev=0;
        while(a!=0){
            int di=a%10;
            rev=rev*10+di;
            a/=10;

        }return Math.abs(n-rev);
    }
}