class Solution {
    public int differenceOfSums(int n, int m) {
        int non=0;
        int div=0;
        while(n!=0){
            if(n%m==0){
                div=div+n;
            }else{
                non=non+n;
            }
            n=n-1;
        }return non-div;
    }
}