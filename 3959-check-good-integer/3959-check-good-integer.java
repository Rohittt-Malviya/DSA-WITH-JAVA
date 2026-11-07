class Solution {
    public boolean checkGoodInteger(int n) {
        int sum=0;
        int mul=0;
        while(n!=0){
       int d=n%10;
       sum=sum+d;
       mul=mul+(d*d);
       n/=10;
        }
        if((mul-sum)>=50){
            return true;
        }return false;
    }
}