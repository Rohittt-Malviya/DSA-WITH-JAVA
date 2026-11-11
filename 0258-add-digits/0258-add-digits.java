class Solution {
    public int addDigits(int num) {
        int ans=0;
        while(num>0){
            int di=num%10;
             ans=ans+di;
            num/=10;
            if(num==0){
                if(ans<10)return ans;
            num=ans;
            ans=0;}
        }return num;
    }
}