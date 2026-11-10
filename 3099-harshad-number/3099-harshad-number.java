class Solution {
    public int sumOfTheDigitsOfHarshadNumber(int x) {
        int n=x;
        int ans=0;
        while(x!=0){
            int di=x%10;
            ans=ans+di;
            x/=10;

        }
        if(n%ans!=0)return -1;
        return ans;
    }
}