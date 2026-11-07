class Solution {
    public int gcdOfOddEvenSums(int n) {
       int a=n*n;
       int b=(n+1)*n;
       return gcd(a,b);
    }
    public int gcd(int a,int b){
        if(a==0){
            return b;
        }
        return gcd(b%a,a);
    }
}